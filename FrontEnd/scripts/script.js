const projets = await fetch('http://localhost:5678/api/works').then(projets => projets.json())
//console.log('projets :', projets);

const galleryElement = document.querySelector('.gallery')

function afficherProjets(array) {

    galleryElement.innerText = ''

    for (let i = 0; i < array.length; i++) {
    
        const figureElement = document.createElement('figure')
        const imgElement = document.createElement('img')
        const captionElement = document.createElement('figcaption')
    
        imgElement.setAttribute('src', array[i].imageUrl)
        imgElement.setAttribute('alt', array[i].title)
        captionElement.innerText = array[i].title
    
        figureElement.appendChild(imgElement)
        figureElement.appendChild(captionElement)
        galleryElement.appendChild(figureElement)
    }
}

afficherProjets(projets)


const categories = await fetch('http://localhost:5678/api/categories').then(categories => categories.json())
//console.log('categories :', categories);

const buttonContainer = document.querySelector('.button-container')

const defaultButton = document.createElement('button')
defaultButton.classList.add('button-categories', 'button-categories-selected')
defaultButton.setAttribute('id', 'button0')
defaultButton.innerText = "Tout"
buttonContainer.appendChild(defaultButton)

for (let i = 0; i < categories.length; i++) {
    
    const button = document.createElement('button')
    button.classList.add('button-categories')
    button.setAttribute('id', 'button' + (i + 1))

    button.innerText = categories[i].name
    buttonContainer.appendChild(button)
}

const buttonElement  = document.querySelectorAll('.button-categories')

for (let i = 0; i < buttonElement.length; i++) {

    buttonElement[i].addEventListener('click', function (){

        const current = document.querySelector('.button-categories-selected')
        current.classList.remove('button-categories-selected')
        buttonElement[i].classList.add('button-categories-selected')
        
        let catMap = []

        if (i !== 0) {
            catMap = projets.filter(function (x){
                return x.categoryId === i
            })            
        }
        else{
            catMap = projets
        }

        console.log('catMap :', catMap);
        afficherProjets(catMap)
    })  
}