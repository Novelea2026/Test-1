const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";
const supabaseKey = "HIER_JE_PUBLISHABLE_KEY";

const client = supabase.createClient(supabaseUrl, supabaseKey);

async function laadPrijzen() {
    const { data, error } = await client
        .from("prijzen")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    let html = "";

    data.forEach(item => {
        html += `<p>${item.naam} - €${item.prijs}</p>`;
    });

    document.getElementById("prijzen").innerHTML = html;
}

laadPrijzen();
