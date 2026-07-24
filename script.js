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






function openCart(){


    const popup =
    document.getElementById("cartPopup");


    if(popup){

        popup.style.display="flex";

    }


    toonWinkelwagen();


}





async function plaatsBestelling(){


    const naam =
    document.getElementById("naam").value;



    const telefoon =
    document.getElementById("telefoon").value;



    const afhaaltijd =
    document.getElementById("ophaaltijd").value;



    const opmerking =
    document.getElementById("opmerking").value;




    if(
        naam === "" ||
        telefoon === "" ||
        afhaaltijd === ""
    ){

        alert(
        "Vul naam, telefoonnummer en afhaaltijd in."
        );

        return;

    }






    if(winkelwagen.length === 0){

        alert(
        "Uw winkelwagen is leeg."
        );

        return;

    }






    let totaal = 0;


    winkelwagen.forEach(item=>{

        totaal += Number(item.prijs);

    });







    const {data,error} = await client

    .from("Bestellingen")

    .insert([{


        naam:naam,


        telefoon:telefoon,


        afhaaltijd:afhaaltijd,


        opmerking:opmerking,


        gerechten:winkelwagen,


        totaal:totaal,


        status:"Nieuw"



    }]);








    if(error){


        console.log(error);


        alert(
        "Bestelling opslaan mislukt."
        );


        return;


    }







    alert(
    "Bedankt! Uw bestelling is ontvangen."
    );




    winkelwagen=[];


    updateCart();


    closeCart();


}

function closeCart(){


    const popup =
    document.getElementById("cartPopup");


    if(popup){

        popup.style.display="none";

    }


}







function toonWinkelwagen(){


    const lijst =
    document.getElementById("cartItems");


    const totaal =
    document.getElementById("cartTotal");



    if(!lijst){

        return;

    }





    if(winkelwagen.length === 0){


        lijst.innerHTML =
        "Uw winkelwagen is leeg.";


        totaal.innerHTML =
        "0,00";


        return;


    }






    let html = "";

    let bedrag = 0;





    winkelwagen.forEach((item,index)=>{


        bedrag += Number(item.prijs);




        html += `


        <div class="cart-item">


            <span>

                ${item.naam}

            </span>



            <span>

                € ${Number(item.prijs)
                .toFixed(2)
                .replace(".",",")}

            </span>




            <button

            class="remove-item"

            onclick="verwijderItem(${index})">

                X

            </button>



        </div>


        `;



    });






    lijst.innerHTML = html;



    totaal.innerHTML =

    bedrag
    .toFixed(2)
    .replace(".",",");



}








function verwijderItem(index){


    winkelwagen.splice(index,1);


    updateCart();


    toonWinkelwagen();


}









// ===============================
// MENU LADEN
// ===============================


async function laadMenu(){



    const menu =
    document.getElementById("prijzen");



    if(!menu){

        return;

    }






    menu.innerHTML = `

    <div class="loading">

        🍜 Menu wordt geladen...

    </div>

    `;







    const {data,error} = await client

    .from("Prijzen")

    .select("*")

    .order("id",{ascending:true});






    if(error){


        console.log(error);


        menu.innerHTML =
        "Menu kan niet geladen worden.";


        return;


    }







    let categorieen = {};






    data.forEach(gerecht=>{


        const categorie =

        gerecht.categorie || "Ongecategoriseerd";




        if(!categorieen[categorie]){


            categorieen[categorie]=[];


        }




        categorieen[categorie].push(gerecht);



    });







    let html="";








    Object.keys(categorieen).forEach(categorie=>{



        html += `


        <div class="menu-categorie">


            <h2>

                ${categorie}

            </h2>



        `;







        let gerechten = {};








        categorieen[categorie].forEach(item=>{



            if(!gerechten[item.naam]){


                gerechten[item.naam]=[];


            }



            gerechten[item.naam].push(item);



        });








        Object.keys(gerechten).forEach(naam=>{



            const item = gerechten[naam][0];






            html += `



            <div class="menu-card">


                <h3>

                    ${naam}

                </h3>



            `;









            gerechten[naam].forEach(variant=>{



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









// ===============================
// KNOPPEN
// ===============================


document.addEventListener("DOMContentLoaded",()=>{



    const knop =
    document.getElementById("cartButton");



    const sluiten =
    document.getElementById("closeCart");



    const bestellen =
    document.getElementById("checkoutButton");





    if(knop){


        knop.onclick = openCart;


    }





    if(sluiten){


        sluiten.onclick = closeCart;


    }





    if(bestellen){


        bestellen.onclick = plaatsBestelling;


    }



});


// ===============================
// START WEBSITE
// ===============================

laadMenu();
