const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";
const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";

const client = supabase.createClient(supabaseUrl, supabaseKey);

// --------------------
// LOGIN
// --------------------
async function login() {

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) return;

    const { error } = await client.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        document.getElementById("melding").innerText =
            "Login mislukt: " + error.message;
        return;
    }

    window.location.href = "dashboard.html";
}

// --------------------
// DASHBOARD LADEN
// --------------------
async function laadDashboard() {

    const prijzenDiv = document.getElementById("prijzen");

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

                € <input
                    class="prijs-input"
                    data-id="${item.id}"
                    type="number"
                    value="${item.prijs}">
            </div>
        `;

    });

    html += `
        <button onclick="opslaanPrijzen()">
            Opslaan
        </button>

        <p id="melding"></p>
    `;

    prijzenDiv.innerHTML = html;
}

// --------------------
// OPSLAAN
// --------------------
async function opslaanPrijzen() {

    const inputs = document.querySelectorAll(".prijs-input");

    for (const input of inputs) {

        const id = Number(input.dataset.id);
        const prijs = Number(input.value);

        const { error } = await client
            .from("Prijzen")
            .update({ prijs: prijs })
            .eq("id", id);

        if (error) {
            console.log(error);

            document.getElementById("melding").innerText =
                "Opslaan mislukt.";

            return;
        }

    }

    document.getElementById("melding").innerText =
        "✅ Prijzen opgeslagen!";
}

// Dashboard automatisch laden
laadDashboard();
