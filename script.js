const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";
const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey);

async function laadPrijzen() {
    const prijzenDiv = document.getElementById("prijzen");

    const { data, error } = await client
        .from("prijzen")
        .select("*");

    if (error) {
        console.error(error);
        prijzenDiv.innerHTML = "<p>Fout bij het laden van de prijzen.</p>";
        return;
    }

    if (data.length === 0) {
        prijzenDiv.innerHTML = "<p>Er zijn nog geen prijzen toegevoegd.</p>";
        return;
    }

    let html = "";

    data.forEach(item => {
        html += `
            <div class="prijs">
                <h3>${item.naam}</h3>
                <p>€${item.prijs}</p>
            </div>
        `;
    });

    prijzenDiv.innerHTML = html;
}

laadPrijzen();
