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



    let categorieen = {};



    data.forEach(gerecht => {


        if (!categorieen[gerecht.categorie]) {

            categorieen[gerecht.categorie] = [];

        }


        categorieen[gerecht.categorie].push(gerecht);


    });





    let html = "";



    Object.keys(categorieen).forEach(categorie => {


        html += `

        <div class="menu-categorie">

            <h2>
                ${categorie}
            </h2>

        `;



        let gerechten = {};



        categorieen[categorie].forEach(item => {


            if (!gerechten[item.naam]) {

                gerechten[item.naam] = [];

            }


            gerechten[item.naam].push(item);


        });




        Object.keys(gerechten).forEach(naam => {


            html += `

            <div class="menu-card">

                <h3>
                    ${naam}
                </h3>


            `;



            gerechten[naam].forEach(variant => {


                html += `

                <div class="variant">

                    <span>
                        ${variant.variant}
                    </span>


                    <span class="menu-price">

                        € ${Number(variant.prijs)
                        .toFixed(2)
                        .replace(".", ",")}

                    </span>

                </div>

                `;


            });



            html += `

            </div>

            `;


        });



        html += `

        </div>

        `;


    });



    menu.innerHTML = html;


}



laadMenu();
