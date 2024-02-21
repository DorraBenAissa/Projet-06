const loginMdpError = document.querySelector(".loginMdp__error"); 
const email = document.getElementById("email");
const password = document.getElementById("password");

var token = localStorage.removeItem("token");

const submit = document.getElementById("submit");


// Au clic, on envoie les valeurs de connextion
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

async function login(user) {
    loginMdpError.innerHTML = "";
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    }); 
    let data = await response.json();
    console.log('dataLogin= ', data);

    if (response.status == 200){
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    }
    else {
        const p = document.createElement("p");
            p.innerHTML = "Erreur dans l’identifiant ou le mot de passee";
            loginMdpError.appendChild(p);

    }
}
//token = localStorage.removeItem("token");