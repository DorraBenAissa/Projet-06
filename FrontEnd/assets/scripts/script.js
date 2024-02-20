

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
    console.log('data= ', data);
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
    