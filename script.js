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






function closeCart(){


    const popup =
    document.getElementById("cartPopup");


    if(popup){

        popup.style.display="none";

    }


}






// ===============================
// BESTELLING PLAATSEN
// ===============================


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






    const {error} = await client

    .from("Bestellingen")

    .insert([{

        naam: naam,

        telefoon: telefoon,

        afhaaltijd: afhaaltijd,

        opmerking: opmerking,

        gerechten: winkelwagen,

        totaal: totaal,

        status: "Nieuw"

    }]);






    if(error){


        console.log(error);


        alert(
            "Bestelling opslaan mislukt."
        );


        return;


    }





    // ===============================
    // GEGEVENS NAAR BETAALPAGINA
    // ===============================


    localStorage.setItem(
        "bedrag",
        totaal.toFixed(2).replace(".",",")
    );



    localStorage.setItem(
        "omschrijving",
        "Bestelling Pie-Nong-Thai - " + naam
    );



    localStorage.setItem(
        "afhaaltijd",
        afhaaltijd
    );



    winkelwagen = [];


    updateCart();



    window.location.href =
    "betaling.html";


}
// ===============================
// WINKELWAGEN TONEN
// ===============================


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


        if(totaal){

            totaal.innerHTML =
            "0,00";

        }


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



    if(totaal){


        totaal.innerHTML =

        bedrag
        .toFixed(2)
        .replace(".",",");


    }



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



        let gerechten={};




        categorieen[categorie].forEach(item=>{


            if(!gerechten[item.naam]){

                gerechten[item.naam]=[];

            }


            gerechten[item.naam].push(item);


        });





        Object.keys(gerechten).forEach(naam=>{


            html += `


            <div class="menu-card">


            <h3>

                ${naam}

            </h3>


            `;




            gerechten[naam].forEach(variant=>{


                html += `



                <div class="variant">


                    <div>


                        <strong>

                            ${variant.variant || "Normaal"}

                        </strong>



                        <div class="menu-price">


                            € ${Number(variant.prijs)

                            .toFixed(2)

                            .replace(".",",")}


                        </div>


                    </div>





                    <button

                    class="add-cart"

                    onclick='voegToeAanWinkelwagen(${JSON.stringify(variant)})'>


                        🛒 Toevoegen


                    </button>



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

// ===============================
// TAAL WISSELEN
// ===============================

const translations = {

    nl: {

        navHome: "Home",
        navAbout: "Over ons",
        navMenuText: "Menu",
        navOpening: "Openingstijden",
        navContact: "Contact",

        heroSubtitle: "AUTHENTIEKE THAISE KEUKEN",
        heroTitle: "Welkom bij Pie-Nong-Thai",
        heroText: "Ontdek de echte smaken van Thailand. Dagelijks vers bereide gerechten, bereid met traditionele recepten, verse ingrediënten en veel passie.",
        heroButton: "Bekijk het menu",

        aboutTitle: "Over ons",
        aboutText1: "Bij Pie-Nong-Thai bereiden wij authentieke Thaise gerechten met verse ingrediënten en traditionele recepten.",
        aboutText2: "Van geurige curry's tot heerlijke noedelgerechten en verse soepen. Iedere maaltijd wordt met zorg bereid zodat u kunt genieten van de echte smaak van Thailand.",

        menuTitle: "Ons Menu",
        menuIntro: "Ontdek onze authentieke Thaise gerechten. Kies uit heerlijke voorgerechten, verse soepen, pittige salades en traditionele hoofdgerechten.",

        whyTitle: "Waarom Pie-Nong-Thai?",
        whyCard1Title: "Authentiek Thais",
        whyCard1Text: "Onze gerechten worden bereid volgens traditionele Thaise recepten met de echte smaken van Thailand.",
        whyCard2Title: "Verse ingrediënten",
        whyCard2Text: "Wij gebruiken verse producten om iedere dag smaakvolle gerechten te bereiden.",
        whyCard3Title: "Met passie bereid",
        whyCard3Text: "Elke maaltijd wordt met zorg bereid zodat u kunt genieten van een echte Thaise ervaring.",

        openingTitle: "Openingstijden",
        weekLabel: "Maandag t/m Zondag",
        weekHours: "17:00 - 21:30",

        contactTitle: "Contact",
        addressTitle: "Adres",
        phoneTitle: "Telefoon",
        restaurantTitle: "Restaurant",

        orderTitle: "Bestel gemakkelijk",
        callButton: "📞 Bel ons",
        whatsappButton: "💬 WhatsApp",

        reviewsTitle: "Wat onze klanten zeggen",
        review1: "Heerlijk eten en echte Thaise smaken. Zeker een aanrader!",
        review2: "Verse gerechten, vriendelijke service en grote porties.",
        review3: "Een van de beste Thaise restaurants. Wij komen zeker terug.",

        footerText: "Authentieke Thaise keuken"

    },


    en: {

        navHome: "Home",
        navAbout: "About Us",
        navMenuText: "Menu",
        navOpening: "Opening Hours",
        navContact: "Contact",

        heroSubtitle: "AUTHENTIC THAI CUISINE",
        heroTitle: "Welcome to Pie-Nong-Thai",
        heroText: "Discover the real flavours of Thailand. Freshly prepared dishes every day, made with traditional recipes, fresh ingredients and passion.",
        heroButton: "View Menu",

        aboutTitle: "About Us",
        aboutText1: "At Pie-Nong-Thai we prepare authentic Thai dishes with fresh ingredients and traditional recipes.",
        aboutText2: "From delicious curries to tasty noodle dishes and fresh soups. Every meal is prepared with care so you can enjoy the true taste of Thailand.",

        menuTitle: "Our Menu",
        menuIntro: "Discover our authentic Thai dishes. Choose from delicious starters, fresh soups, spicy salads and traditional main courses.",

        whyTitle: "Why Pie-Nong-Thai?",
        whyCard1Title: "Authentic Thai",
        whyCard1Text: "Our dishes are prepared according to traditional Thai recipes with the real flavours of Thailand.",
        whyCard2Title: "Fresh Ingredients",
        whyCard2Text: "We use fresh products to prepare delicious dishes every day.",
        whyCard3Title: "Prepared with Passion",
        whyCard3Text: "Every meal is prepared with care so you can enjoy a real Thai experience.",

        openingTitle: "Opening Hours",
        weekLabel: "Monday to Sunday",
        weekHours: "17:00 - 21:30",

        contactTitle: "Contact",
        addressTitle: "Address",
        phoneTitle: "Phone",
        restaurantTitle: "Restaurant",

        orderTitle: "Order Easily",
        callButton: "📞 Call Us",
        whatsappButton: "💬 WhatsApp",

        reviewsTitle: "What Our Customers Say",
        review1: "Delicious food and real Thai flavours. Highly recommended!",
        review2: "Fresh dishes, friendly service and large portions.",
        review3: "One of the best Thai restaurants. We will definitely come back.",

        footerText: "Authentic Thai Cuisine"

    }

};




function changeLanguage(language){


    Object.keys(translations[language]).forEach(id=>{


        const element = document.getElementById(id);


        if(element){

            element.innerText = translations[language][id];

        }


    });



    localStorage.setItem("language", language);


}





const languageSwitcher =
document.getElementById("languageSwitcher");



if(languageSwitcher){


    const savedLanguage =
    localStorage.getItem("language") || "nl";


    languageSwitcher.value = savedLanguage;



    changeLanguage(savedLanguage);



    languageSwitcher.addEventListener(
        "change",
        function(){

            changeLanguage(this.value);

        }
    );


}
// ===============================
// HAMBURGER MENU
// ===============================

document.addEventListener("DOMContentLoaded",()=>{


    const hamburger =
    document.getElementById("hamburger");


    const navMenu =
    document.getElementById("navMenu");



    if(hamburger && navMenu){


        hamburger.onclick = function(){


            navMenu.classList.toggle("active");


        };


    }




    const menuLinks =
    document.querySelectorAll(".nav-menu a");



    menuLinks.forEach(link=>{


        link.onclick = function(){


            if(navMenu){

                navMenu.classList.remove("active");

            }


        };


    });



});
