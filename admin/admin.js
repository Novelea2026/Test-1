const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "sb_publishable_cGdgaq80rMC3tuARMGgNDA_gzgPTmtT";


const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);





// =================================
// LOGIN
// =================================


async function login(){


    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;




    const { data, error } = await client.auth.signInWithPassword({

        email: email,

        password: password

    });





    if(error){


        document.getElementById("melding").innerHTML =

        "Login mislukt: " + error.message;


        console.log(error);


        return;

    }




    window.location.href = "dashboard.html";


}







// =================================
// MENU LADEN ADMIN
// =================================


async function laden(){


    const lijst = document.getElementById("lijst");


    if(!lijst){

        return;

    }




    const {data,error} = await client

    .from("Prijzen")

    .select("*")

    .order("id");





    if(error){


        console.log(error);


        lijst.innerHTML =

        "Kan menu niet laden";


        return;

    }






    let html = "";





    data.forEach(item => {



        html += `


        <div class="admin-item">


            <h3>

            ${item.naam}

            </h3>



            <p>

            ${item.beschrijving || ""}

            </p>



            <p>

            ${item.variant}

            -

            € ${Number(item.prijs)
            .toFixed(2)
            .replace(".", ",")}

            </p>



            <small>

            ${item.categorie}

            </small>



            <br><br>



            <button onclick="verwijderen(${item.id})">

                Verwijderen

            </button>



        </div>


        `;



    });





    lijst.innerHTML = html;



}








// =================================
// GERECHT TOEVOEGEN
// =================================


async function toevoegen(){



    const naam = document.getElementById("naam").value;


    const beschrijving = document.getElementById("beschrijving").value;


    const categorie = document.getElementById("categorie").value;


    const variant = document.getElementById("variant").value;


    const prijs = document.getElementById("prijs").value;







    if(!naam || !prijs){


        document.getElementById("melding").innerHTML =

        "Vul minimaal naam en prijs in.";


        return;


    }







    const {data,error} = await client

    .from("Prijzen")

    .insert([{


        naam: naam,


        beschrijving: beschrijving,


        categorie: categorie,


        variant: variant,


        prijs: Number(prijs)



    }]);








    if(error){



        console.log(error);



        document.getElementById("melding").innerHTML =

        "Toevoegen mislukt";


        return;



    }






    document.getElementById("melding").innerHTML =

    "Gerecht toegevoegd!";






    // velden leegmaken


    document.getElementById("naam").value="";

    document.getElementById("beschrijving").value="";

    document.getElementById("prijs").value="";





    laden();



}








// =================================
// VERWIJDEREN
// =================================


async function verwijderen(id){



    const bevestiging = confirm(

        "Weet je zeker dat je dit gerecht wilt verwijderen?"

    );



    if(!bevestiging){

        return;

    }







    const {error} = await client

    .from("Prijzen")

    .delete()

    .eq("id", id);







    if(error){


        console.log(error);


        alert("Verwijderen mislukt");


        return;


    }






    laden();



}






// =================================
// START
// =================================


laden();
