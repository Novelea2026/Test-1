const supabaseUrl = "https://ccmhegxkxyqemqbnqvro.supabase.co";

const supabaseKey = "JOUW_KEY_HIER";

const client = supabase.createClient(
    supabaseUrl,
    supabaseKey
);


async function login() {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });


    if (error) {

        document.getElementById("melding").innerHTML =
        "Login mislukt";

        console.log(error);

        return;
    }


    window.location.href = "dashboard.html";

}
