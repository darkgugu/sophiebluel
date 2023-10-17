const projets = await fetch('http://localhost:5678/api/works').then(projets => projets.json())
//console.log('projets :', projets);

const galleryElement = document.querySelector('.gallery')

function afficherProjets(array, element) {

    element.innerText = ''

    for (let i = 0; i < array.length; i++) {
    
        const figureElement = document.createElement('figure')
        const imgElement = document.createElement('img')
    
        imgElement.setAttribute('src', array[i].imageUrl)
        imgElement.setAttribute('alt', array[i].title)

        figureElement.appendChild(imgElement)
        
        if (element === galleryElement) {
            const captionElement = document.createElement('figcaption')
            captionElement.innerText = array[i].title
            figureElement.appendChild(captionElement)
        }
        else{
            const trashContainer = document.createElement('div')
            const trash = document.createElement('i')

            trashContainer.classList.add('modale-corbeille')
            trash.classList.add('fa-solid', 'fa-trash-can', 'fa-xs')

            trashContainer.appendChild(trash)
            figureElement.appendChild(trashContainer)
        }

        element.appendChild(figureElement)
    }
}

afficherProjets(projets, galleryElement)


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
        afficherProjets(catMap, galleryElement)
    })  
}

if (document.cookie.includes('admin=true')) {
    
    const logout = document.getElementById('login')
    logout.innerText = 'logout'
    logout.setAttribute('href', '')
    logout.addEventListener('click', function (){
        document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        console.log('Cookies supprimés, deconnexion')
    })

    //Ajout d'une margin bottom au header
    const header = document.querySelector('header')
    header.classList.add('header-edition')

    const notDisplayed = document.querySelectorAll('.notDisplayed')
    for (let i = 0; i < notDisplayed.length; i++) {
        notDisplayed[i].classList.remove('notDisplayed')
    }

    const categories = document.querySelector('.button-container')
    categories.innerText = ''
}

// Modale

const modal = document.querySelector('.modale')
const modalOpen = document.querySelector('.modifier-link')
const modalClose = document.querySelector('.modale-close')

modalOpen.addEventListener('click', function (event){
    event.preventDefault()
    modal.showModal()
})

modalClose.addEventListener('click', function (){

    modal.close()
})

const photoContainer = document.querySelector('.modale-photos')

afficherProjets(projets, photoContainer)