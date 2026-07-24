const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";


const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);



// ===============================
// WINKELMAND
// ===============================


let winkelwagen = [];




function updateCart(){

    const teller = document.getElementById("cartCount");

    if(teller){

        teller.innerHTML = winkelwagen.length;

    }

}





function voegToeAanWinkelwagen(gerecht){


    winkelwagen.push(gerecht);


    updateCart();


    alert(
        gerecht.naam + " toegevoegd aan winkelwagen"
    );


}





// ===============================
// MENU LADEN
// ===============================


async function laadMenu(){


    const menu = document.getElementById("prijzen");


    if(!menu){

        return;

    }



    menu.innerHTML = `

        <div class="loading">

            🍜 Menu wordt geladen...

        </div>

    `;




    const { data, error } = await client

    .from("Prijzen")

    .select("*")

    .order("id", {ascending:true});





    if(error){

        console.log(error);

        menu.innerHTML =
        "Menu kan niet geladen worden.";

        return;

    }






    let categorieen = {};





    data.forEach(gerecht => {



        const categorie =
        gerecht.categorie || "Ongecategoriseerd";



        if(!categorieen[categorie]){

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



            if(!gerechten[item.naam]){

                gerechten[item.naam] = [];

            }


            gerechten[item.naam].push(item);



        });







        Object.keys(gerechten).forEach(naam => {



            const item = gerechten[naam][0];



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

                ${variant.variant || ""}

                </span>



                <span class="menu-price">

                € ${Number(variant.prijs)
                .toFixed(2)
                .replace(".",",")}

                </span>



                </div>


                `;



            });







            html += `


            <button

            class="add-cart"

            onclick='voegToeAanWinkelwagen(${JSON.stringify(item)})'>

            🛒 Toevoegen


            </button>



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
