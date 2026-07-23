const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";


const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);





// ===============================
// MENU LADEN
// ===============================


async function laadMenu() {


    const menu = document.getElementById("prijzen");


    if (!menu) {

        return;

    }



    // Loading

    menu.innerHTML = `

        <div class="loading">

            🍜 Menu wordt geladen...

        </div>

    `;





    const { data, error } = await client

        .from("Prijzen")

        .select("*")

        .order("id", { ascending: true });





    if (error) {


        console.log(error);


        menu.innerHTML = `

        <p>

            Het menu kon niet geladen worden.

            Probeer later opnieuw.

        </p>

        `;


        return;

    }





    if (!data || data.length === 0) {


        menu.innerHTML = `

        <p>

            Er zijn momenteel geen gerechten beschikbaar.

        </p>

        `;


        return;

    }






    let categorieen = {};





    // Gerechten verdelen per categorie

    data.forEach(gerecht => {



        const categorie = gerecht.categorie || "Menu";



        if (!categorieen[categorie]) {


            categorieen[categorie] = [];


        }



        categorieen[categorie].push(gerecht);



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



            const eerste = gerechten[naam][0];



            html += `


            <div class="menu-card">


                <h3>

                    ${naam}

                </h3>



            `;






            // Beschrijving tonen

            if (eerste.beschrijving) {



                html += `


                <p class="menu-description">

                    ${eerste.beschrijving}

                </p>


                `;


            }








            // Varianten tonen


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






// Start menu

laadMenu();
