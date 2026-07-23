const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";

const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// LOGIN

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const { data, error } = await client.auth.signInWithPassword({
        email,
        password
    });


    if (error) {

        document.getElementById("melding").innerHTML =
        "Login mislukt: " + error.message;

        return;
    }


    window.location.href = "dashboard.html";
}



// DASHBOARD

async function laadDashboard() {

    const prijzenDiv = document.getElementById("prijzen");

    if (!prijzenDiv) {
        return;
    }


    const { data, error } = await client
        .from("Prijzen")
        .select("*");


    if (error) {
        console.log(error);
        prijzenDiv.innerHTML = "Fout bij laden";
        return;
    }


    let html = "";


    data.forEach(item => {

        html += `
            <div>
                <h3>${item.naam}</h3>
                <input value="${item.prijs}">
            </div>
        `;

    });


    prijzenDiv.innerHTML = html;

}


laadDashboard();
