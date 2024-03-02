// const buttonAll = document.querySelector(".filter__btn-id-null");
// const buttonId1 = document.querySelector(".filter__btn-id-1");
// const buttonId2 = document.querySelector(".filter__btn-id-2");
// const buttonId3 = document.querySelector(".filter__btn-id-3");

const form = document.querySelector("#modale-projet-form");
const returnBtn = document.querySelector(".js-modale-return");

const filters = document.querySelector('.filters');
const buttonAll = document.createElement('button');
buttonAll.classList.add(`filter__btn`);
buttonAll.classList.add(`filter__btn-id-null`);
buttonAll.classList.add(`filter__btn--active`);
buttonAll.innerHTML =  'Tous';
filters.appendChild(buttonAll);

// let dataCategory;
getCategory("isFilterButton");




const gallery = document.querySelector('.gallery');

const modaleAjout = document.querySelector(".modale-projet");
const btnAjout = document.querySelector(".js-modale-projet");

const btnListCategory = document.querySelector(".js-categoryId");

const btnCreateWorks = document.querySelector(".js-add-work");

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
            data = data.filter(data => data.categoryId == id);
        }
            console.log('data= ', data);

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


// Ajouter le tri des projets par catégorie dans la galerie
buttonAll.addEventListener("click", () => { // Tous
        generationProjets(data, null);})
// buttonId1.addEventListener("click", () => { // Objets
//         generationProjets(data, 1);})
// buttonId2.addEventListener("click", () => { // Appartements
//         generationProjets(data, 2);})
// buttonId3.addEventListener("click", () => { // Hôtels & restaurants
//         generationProjets(data, 3);})

const AlredyLogged = document.querySelector(".isLogged");
const token = localStorage.getItem("token");
const a = document.querySelector(".admin__modifer");

const modale = document.querySelector(".modale");
const buttonModifier = document.querySelector(".js-modale");
const buttonCloseModale = document.querySelector(".js-modale-close");
const works = document.querySelector(".js-admin-projets"); 

if (token) {

    let edition = document.querySelectorAll(".edition");
    /* POUR BOUTONS MODIER ET BANNER */
    edition.forEach((element) => {
      element.hidden = false;
    });

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

    var message = document.createElement("p");
    message.classList.add("errorMessage");
    
    btnAjout.addEventListener("click", () => { // Tous
        modaleAjout.removeAttribute("aria-hidden");
        modaleAjout.removeAttribute("style");
        var data = getCategory("isPickList");
        message.innerHTML =  '';
    });

    btnCreateWorks.addEventListener("click", postProjets);

    returnBtn.addEventListener("click", returnToModaleGallery);

    function resetmodaleSectionProjets() {  
        works.innerHTML = "";
    }
}

function returnToModaleGallery(){
    modaleAjout.style.display = "none";
}

async function generateWorksForModale() {
    const response = await fetch('http://localhost:5678/api/works'); 
    var data  = await response.json();

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
    if (projet != null) {
        projet.style.display = "none";
    }
    
}


async function getCategory(origine) {
    const response = await fetch('http://localhost:5678/api/categories'); 
    var data = await response.json();
    dataCategory = data;
    console.log ('category =', data);

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



const containerAjoutImage = document.querySelector(".form-group-photo");

//let previewDiv = document.querySelector(".preview");

// document.getElementById("image-input").addEventListener("change", function (e) {
//   if (e.target.files[0]) {
//     previewDiv.style.display = "flex";
//   }
// });

//image.addEventListener("click", afficheImage);

//function afficheImage(){
    //previewDiv.style.display = "flex";
    // containerAjoutImage.innerHTML = '';
    // var selectedImage = document.createElement("IMG");
    // selectedImage.setAttribute("src", URL.createObjectURL(image.files[0]));
    // selectedImage.setAttribute("width", "304");
    // selectedImage.setAttribute("height", "228");
    // selectedImage.setAttribute("alt", "The Pulpit Rock");
    // //selectedImage.src = URL.createObjectURL(image.files[0]); window.URL.createObjectURL(new Blob(image.files[0], {type: "application/zip"}))
    // containerAjoutImage.appendChild(selectedImage);
//}
const optionCategory = '';
async function postProjets(event) {
    event.preventDefault();
    try {
        const image = document.querySelector(".js-image").files[0];
        const title = document.getElementById("titre").value;
        var optionCategory = document.querySelector(".js-categoryId").value;

        const formData = new FormData();
            formData.append("title", title);
            formData.append("category", optionCategory);
            formData.append("image", image);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);
        console.log('json = ', json);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        //form
        
        if (response.status === 201) {
            console.log ('le projet a été ajouté avec succé');
            message.innerHTML =  'Le projet a été ajouté avec succé';
            generateWorksForModale();
            backToModale ();
            generationProjets(data, null);

        }else if (response.status === 400) {
            console.log('response.status = ', response.status);
            message.innerHTML =  'Merci de remplir tous les champs';
        } else if (response.status === 500) {
            console.log('response.status = ', response.status);
            message.innerHTML =  'Erreur serveur';
        }else if (response.status === 401) {
            console.log('response.status = ', response.status);
            message.innerHTML =  "Vous n'êtes pas autorisé à ajouter un projet";
            window.location.href = "login.html";
        }
        form.appendChild(message);
    }catch (error) {
        console.log(error);
    }
    
 }

 let previewDiv = document.querySelector(".preview");

document.getElementById("photo").addEventListener("change", function (e) {
  if (e.target.files[0]) {
    previewDiv.style.display = "flex";
  }
});

form.addEventListener("input", function (event) {
    let isValid = form.checkValidity();
    if (isValid) {
      document.querySelector(".js-add-work").disabled = false;
      document.querySelector(".js-add-work").style.background =
        "#1D6154";
      document.querySelector(".js-add-work").style.color =
        "white";
    } else {
      document.querySelector(".js-add-work").style.background = "grey";
    }
  });

 function backToModale () {
    modaleAjout.style.display = "none";
};

 