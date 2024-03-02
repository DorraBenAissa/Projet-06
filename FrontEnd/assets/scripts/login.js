//Déclarations/initalisations
const loginMdpError = document.querySelector(".loginMdp__error");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");

var token = localStorage.removeItem("token");

//Web Service d'Authentification (Login)
async function appelApiToPostLogin(user) {
    return await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
}

//Les fonctions
async function login(user) {
    loginMdpError.innerHTML = "";
    response = await appelApiToPostLogin(user);
    let data = await response.json();

    if (response.status == 200) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    }
    else {
        const p = document.createElement("p");
        p.innerHTML = "Erreur dans l’identifiant ou le mot de passee";
        loginMdpError.appendChild(p);
    }
}

//Event Listener
// Au clic, on envoie les valeurs de connextion
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})




