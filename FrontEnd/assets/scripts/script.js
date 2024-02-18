

const buttonAll = document.querySelector(".filter__btn-id-null");

// Récupérer dynamiquement les données des travaux via l’API
async function generationProjets() {
    const response = await fetch('http://localhost:5678/api/works'); 
    data = await response.json();
    console.log('data= ', data);

    for (let i = 0; i < data.length; i++) {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');


        const gallery = document.querySelector('.gallery');
        gallery.appendChild(figure);

        image.src = data[i].imageUrl;
        figure.appendChild(image);

        figcaption.innerHTML = data[i].title;
        figure.appendChild(figcaption);
    }

}

// Ajouter le tri des projets par catégorie dans la galerie
buttonAll.addEventListener("click", () => { 
    generationProjets();})