// =========================
// PIE-NONG-THAI
// SUPABASE MENU LADEN
// =========================


const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";


const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);





async function laadMenu() {


    const menu = document.getElementById("prijzen");


    if (!menu) {
        return;
    }



    const { data, error } = await client

        .from("Prijzen")

        .select("*")

        .order("id");




    if (error) {


        console.log(error);


        menu.innerHTML =

        "<p>Menu kan niet geladen worden.</p>";


        return;

    }





    let html = "";




    data.forEach(gerecht => {



        html += `

        <div class="menu-card">


            <h3>
                ${gerecht.naam}
            </h3>


            <p class="menu-price">

                € ${Number(gerecht.prijs)
                .toFixed(2)
                .replace(".", ",")}

            </p>


        </div>

        `;



    });





    menu.innerHTML = html;



}





laadMenu();
