const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";

const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// ======================
// LOGIN
// ======================

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });


    if (error) {

        document.getElementById("melding").innerHTML =
            "Login mislukt: " + error.message;

        console.log(error);

        return;
    }


    console.log("Ingelogd:", data);

    window.location.href = "dashboard.html";

}



// ======================
// PRIJZEN LADEN
// ======================

async function laadDashboard() {

    const prijzenDiv = document.getElementById("prijzen");


    if (!prijzenDiv) {
        return;
    }


    const { data, error } = await client
        .from("Prijzen")
        .select("*")
        .order("id");


    if (error) {

        console.log(error);

        prijzenDiv.innerHTML =
            "Fout bij laden van prijzen.";

        return;
    }


    let html = "";


    data.forEach(item => {

        html += `
            <div class="prijs-item">

                <strong>${item.naam}</strong>

                <br>

                € 
                <input 
                    class="prijs-input"
                    data-id="${item.id}"
                    type="number"
                    value="${item.prijs}"
                >

            </div>
        `;

    });


    prijzenDiv.innerHTML = html;

}



// ======================
// PRIJZEN OPSLAAN
// ======================

async function opslaanPrijzen() {


    const inputs = document.querySelectorAll(".prijs-input");


    for (const input of inputs) {


        const id = input.dataset.id;

        const nieuwePrijs = Number(input.value);



        const { error } = await client
            .from("Prijzen")
            .update({
                prijs: nieuwePrijs
            })
            .eq("id", id);



        if (error) {

            console.log(error);

            document.getElementById("melding").innerHTML =
                "❌ Opslaan mislukt.";

            return;

        }

    }



    document.getElementById("melding").innerHTML =
        "✅ Prijzen opgeslagen!";

}



// ======================
// UITLOGGEN
// ======================

async function uitloggen() {


    await client.auth.signOut();


    window.location.href = "login.html";

}



// Dashboard automatisch laden
laadDashboard();
