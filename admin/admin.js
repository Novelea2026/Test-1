const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";
const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";

const client = supabase.createClient(supabaseUrl, supabaseKey);

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await client.auth.signInWithPassword({
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

    // Alleen uitvoeren op dashboard.html
    if (!prijzenDiv) return;

    const { data, error } = await client
        .from("Prijzen")
        .select("*")
        .order("id");

    if (error) {
        prijzenDiv.innerHTML = "Fout bij laden.";
        console.log(error);
        return;
    }

    let html = "";

    data.forEach(item => {

        html += `
            <div style="margin-bottom:20px;">
                <strong>${item.naam}</strong><br>

                <input
                    class="prijs-input"
                    data-id="${item.id}"
                    value="${item.prijs}"
                    type="number"
                >
            </div>
        `;

    });

    prijzenDiv.innerHTML = html;
}

// OPSLAAN
async function opslaanPrijzen() {

    const inputs = document.querySelectorAll(".prijs-input");

    for (const input of inputs) {

        const id = input.dataset.id;
        const prijs = Number(input.value);

        const { error } = await client
            .from("Prijzen")
            .update({
                prijs: prijs
            })
            .eq("id", id);

        if (error) {
            console.log(error);
            document.getElementById("melding").innerHTML =
                "Opslaan mislukt.";
            return;
        }
    }

    document.getElementById("melding").innerHTML =
        "✅ Prijzen succesvol opgeslagen!";
}

// Dashboard automatisch laden
laadDashboard();
