const buttonAll = document.querySelector(".filter__btn-id-null");
const buttonId1 = document.querySelector(".filter__btn-id-1");
const buttonId2 = document.querySelector(".filter__btn-id-2");
const buttonId3 = document.querySelector(".filter__btn-id-3");

const gallery = document.querySelector('.gallery');

let data = null;
generationProjets(data, null);

function resetGallery() {  
	gallery.innerHTML = "";
}

// Récupérer dynamiquement les données des travaux via l’API
async function generationProjets(data, id) {
    const response = await fetch('http://localhost:5678/api/works'); 
    data = await response.json();
    resetGallery();

        if ([1, 2, 3].includes(id)) {
            data = data.filter(data => data.categoryId == id);}
            console.log('data= ', data);

                    // Change la couleur du bouton en fonction du filtre
            document.querySelectorAll(".filter__btn").forEach(btn => {
                btn.classList.remove("filter__btn--active");})
            document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");

        for (let i = 0; i < data.length; i++) {

            const figure = document.createElement('figure');
            const image = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            gallery.appendChild(figure);

            image.src = data[i].imageUrl;
            figure.appendChild(image);

            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
}


// Ajouter le tri des projets par catégorie dans la galerie
buttonAll.addEventListener("click", () => { // Tous
        generationProjets(data, null);})
buttonId1.addEventListener("click", () => { // Objets
        generationProjets(data, 1);})
buttonId2.addEventListener("click", () => { // Appartements
        generationProjets(data, 2);})
buttonId3.addEventListener("click", () => { // Hôtels & restaurants
        generationProjets(data, 3);})

const AlredyLogged = document.querySelector(".isLogged");
var token = localStorage.getItem("token");
const a = document.querySelector(".admin__modifer");

const modale = document.querySelector(".modale");
const buttonModifier = document.querySelector(".js-modale");
const buttonCloseModale = document.querySelector(".js-modale-close");
const works = document.querySelector(".js-admin-projets"); 

if (token) {
    AlredyLogged.innerHTML = "Logout";
    a.removeAttribute("aria-hidden");
    a.removeAttribute("style");

    buttonModifier.addEventListener("click", () => { 
        modale.removeAttribute("aria-hidden");
        modale.removeAttribute("style");

        generateWorksForModale();

    });

    buttonCloseModale.addEventListener("click", () => { 
        modale.setAttribute("aria-hidden");
    });
}

function resetmodaleSectionProjets() {  
	works.innerHTML = "";
}

async function generateWorksForModale() {
    const response = await fetch('http://localhost:5678/api/works'); 
    var data = await response.json();

    console.log("generateWorksOnModale = ",data);

    resetmodaleSectionProjets();

    for (let i = 0; i < data.length; i++) {

        const div = document.createElement("div");
        div.classList.add("gallery__item-modale");
        works.appendChild(div);

        const img = document.createElement("img");
        img.src = data[i].imageUrl;
        img.alt = data[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(data[i].id, "js-delete-work");


        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can"); 
        p.appendChild(icon);

    }
    deleteWork();
}

function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjets);
    }
}

async function deleteProjets() {

   const response = await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
    });
    if (response.status === 204) {
        refreshPage(this.classList[0])
    }

}

async function refreshPage(i){
    generateWorksForModale(); // Re lance une génération des projets dans la modale admin

    // supprime le projet de la page d'accueil
    const projet = document.querySelector(`.js-projet-${i}`);
    projet.style.display = "none";
}