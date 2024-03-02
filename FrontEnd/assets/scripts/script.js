//Les décalarations/initialisations
let previewDiv = document.querySelector(".preview");
let data = null;

const AlredyLogged = document.querySelector(".isLogged");
const token = localStorage.getItem("token");
const a = document.querySelector(".admin__modifer");
const modale = document.querySelector(".modale");
const buttonModifier = document.querySelector(".js-modale");
const buttonCloseModale = document.querySelector(".js-modale-close");
const works = document.querySelector(".js-admin-projets"); 
const form = document.querySelector("#modale-projet-form");
const returnBtn = document.querySelector(".js-modale-return");
const filters = document.querySelector('.filters');
const buttonAll = document.createElement('button');
const gallery = document.querySelector('.gallery');
const modaleAjout = document.querySelector(".modale-projet");
const btnAjout = document.querySelector(".js-modale-projet");
const btnListCategory = document.querySelector(".js-categoryId");
const btnCreateWorks = document.querySelector(".js-add-work");
const containerAjoutImage = document.querySelector(".form-group-photo");
const formData = new FormData();

buttonAll.classList.add(`filter__btn`);
buttonAll.classList.add(`filter__btn-id-null`);
buttonAll.classList.add(`filter__btn--active`);
buttonAll.innerHTML =  'Tous';
filters.appendChild(buttonAll);

//Les Web services ::::
async function appelApi2GetAllWorks () {
    const response = await fetch('http://localhost:5678/api/works'); 
    return data = await response.json();
}

async function appelApiToDeleteWork(workId) { 
    return await fetch(`http://localhost:5678/api/works/${workId}`, {
         method: "DELETE",
         headers: { Authorization: `Bearer ${token}`},
     });
 }

async function appelApiToGetCategories() { 
    const response = await fetch('http://localhost:5678/api/categories'); 
    return await response.json();
}

async function appelApiToPostNewWork() { 
    return await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
}

//////////////Les fonctions
function resetGallery() {
	gallery.innerHTML = "";
}

function returnToModaleGallery(){
    modaleAjout.style.display = "none";
}

// Récupérer dynamiquement les données des travaux via l’API
async function generationProjets(data, id) {
    data = await appelApi2GetAllWorks ();
    resetGallery();

        if ([1, 2, 3].includes(id)) {
            data = data.filter(data => data.categoryId == id);
        }

// Change la couleur du bouton en fonction du filtre
            document.querySelectorAll(".filter__btn").forEach(btn => {
                btn.classList.remove("filter__btn--active");
            })
            document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");

        for (let i = 0; i < data.length; i++) {

            const figure = document.createElement('figure');
            const image = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            gallery.appendChild(figure);
            figure.classList.add(`js-projet-${data[i].id}`);
            
            image.src = data[i].imageUrl;
            figure.appendChild(image);

            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
}

// afficher tous les works dans la modale :
async function generateWorksForModale() {
    data = await appelApi2GetAllWorks ();

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
    var response = await appelApiToDeleteWork(this.classList[0]);
    if (response.status === 204) {
        refreshPage(this.classList[0])
    }

}

async function refreshPage(i){
    generateWorksForModale(); // Re lance une génération des projets dans la modale admin
    // supprime le projet de la page d'accueil
    const projet = document.querySelector(`.js-projet-${i}`);
    if (projet != null) {
        projet.style.display = "none";
    } 
}

async function getCategory(origine) {
    data = await appelApiToGetCategories();
    dataCategory = data;

    if (origine == 'isFilterButton') {
        constructionFiltreButtonDom(data);
    } else {
        constructionPicklistDom(data);
    }
}

function constructionFiltreButtonDom (data) {
    for (let i = 0; i < data.length; i++) {
        const buttonCategory = document.createElement('button');   
        buttonCategory.classList.add(`filter__btn-id-${data[i].id}`);
        buttonCategory.classList.add(`filter__btn`);
        buttonCategory.innerHTML =  data[i].name;
        filters.appendChild(buttonCategory);

        buttonCategory.addEventListener("click", () => {
                     generationProjets(data, data[i].id);})
    }
}

function constructionPicklistDom (data) {
    btnListCategory.innerHTML='';
    
    const option0 = document.createElement("option");
    option0.innerHTML = '';
    option0.classList.add("option_class");
    btnListCategory.appendChild(option0);

    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.innerHTML = data[i].name;
        option.value = data[i].id;
        option.classList.add("option_class");
        btnListCategory.appendChild(option);
    }
}

async function postProjets(event) {
    event.preventDefault();
    try {
        var image = document.querySelector(".js-image").files[0];
        var title = document.getElementById("titre").value;
        var optionCategory = document.querySelector(".js-categoryId").value;


            formData.append("title", title);
            formData.append("category", optionCategory);
            formData.append("image", image);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);
        
        response = await appelApiToPostNewWork();

        //form
        
        if (response.status === 201) {
            message.innerHTML =  'Le projet a été ajouté avec succé';
            generateWorksForModale();
            window.location.href = "index.html";
            generationProjets(data, null);

        }else if (response.status === 400) {

            message.innerHTML =  'Merci de remplir tous les champs';
        } else if (response.status === 500) {

            message.innerHTML =  'Merci de remplir tous les champs';
        }else if (response.status === 401) {

            message.innerHTML =  "Vous n'êtes pas autorisé à ajouter un projet";
            window.location.href = "login.html";
        }
        form.appendChild(message);
    }catch (error) {

    }
 }

getCategory("isFilterButton");

generationProjets(data, null);

//*********les events Listner */
// Ajouter le tri des projets par catégorie dans la galerie
buttonAll.addEventListener("click", () => { // Tous
        generationProjets(data, null);})

form.addEventListener("input", function (event) {
    let isValid = form.checkValidity();
    if (isValid) {
        document.querySelector(".js-add-work").disabled = false;
        document.querySelector(".js-add-work").style.background = "#1D6154";
        document.querySelector(".js-add-work").style.color = "white";
        message.innerHTML = '';
    } else {
        document.querySelector(".js-add-work").style.background = "grey";
        }
});

if (token) {

    let edition = document.querySelectorAll(".edition");
    /* POUR BOUTONS MODIER ET BANNER */
    edition.forEach((element) => {
      element.hidden = false;
    });

    AlredyLogged.innerHTML = "logout";
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

    var message = document.createElement("p");
    message.classList.add("errorMessage");

    btnAjout.addEventListener("click", () => { // Tous
        modaleAjout.removeAttribute("aria-hidden");
        modaleAjout.removeAttribute("style");
        var data = getCategory("isPickList");
        message.innerHTML =  '';
        document.querySelector(".js-add-work").style.background = "grey";

    });

    btnCreateWorks.addEventListener("click", postProjets);

    returnBtn.addEventListener("click", returnToModaleGallery);

    function resetmodaleSectionProjets() {  
        works.innerHTML = "";
    }
}

document.getElementById("photo").addEventListener("change", function (e) {
  if (e.target.files[0]) {
    previewDiv.style.display = "flex";
  }
});
