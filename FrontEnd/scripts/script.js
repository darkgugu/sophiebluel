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
            trashContainer.classList.add(`trash-${i}`)
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

const token = document.cookie.split('; ').find((x) => x.startsWith('token='))?.split('=')[1]

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
const modaleContent = document.querySelector('.modale-content')

modalOpen.addEventListener('click', function (event){
    event.preventDefault()
    modal.showModal()
})

modalClose.addEventListener('click', function (){

    modal.close()
    genererModaleGalerie()

})

genererModaleGalerie()

function genererModaleGalerie() {

    modaleContent.innerText = ''
    try {
        document.querySelector('.modale-back').classList = ''    
    } catch (error) {
        console.log(error)
    }
    
    const modaleTitre = document.createElement('h3')
    const modalePhoto = document.createElement('div')
    const modaleLigne = document.createElement('div')
    const modaleButton = document.createElement('button')

    modaleTitre.innerText = 'Galerie photo'
    modalePhoto.classList.add('modale-photos')
    modaleLigne.classList.add('modale-ligne')
    modaleButton.classList.add('button', 'real-button')
    modaleButton.innerText = 'Ajouter une photo'

    modaleContent.appendChild(modaleTitre)
    modaleContent.appendChild(modalePhoto)
    modaleContent.appendChild(modaleLigne)
    modaleContent.appendChild(modaleButton)

    const photoContainer = document.querySelector('.modale-photos')

    afficherProjets(projets, photoContainer)
    
    trashListener()
    
    function trashListener(){
    
        for (let i = 0; i < projets.length; i++) {
            const trashContainer = document.querySelector(`.trash-${i}`)
            //console.log('trashContainer :', trashContainer);
            trashContainer.addEventListener('click', async function (){
                console.log(trashContainer.classList[1])
        
                const del = await fetch(`http://localhost:5678/api/works/${projets[i].id}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                })
                projets.splice(i, 1)
                console.log(del)
    
                afficherProjets(projets, galleryElement)
                afficherProjets(projets, photoContainer)
                trashListener()
            })
        }
    }

    modaleButton.addEventListener('click', function (){

        genererModaleAjout()
    })
}




function genererModaleAjout() {

    modaleContent.innerText = ''

    const modaleBack = document.createElement('i')
    modaleBack.classList.add('fa-solid', 'fa-arrow-left', 'fa-xl', 'modale-back')
    modal.appendChild(modaleBack)

    const titre = document.createElement('h3')
    titre.innerText = 'Ajout photo'

    const divAjout = document.createElement('div')
    divAjout.classList.add('modale-ajout')
    const i = document.createElement('i')
    i.classList.add('fa-regular', 'fa-image')
    const labelAdd = createLabel('ajout')
    labelAdd.classList.add('button', 'real-button')
    labelAdd.innerText = '+ Ajouter photo'
    const inputAdd = createInput('file', 'ajout')
    inputAdd.setAttribute('accept', 'image/jpeg, image/png, image/jpg')
    const p = document.createElement('p')
    p.innerText = 'jpg, png: 4mo max'

    divAjout.appendChild(i)
    divAjout.appendChild(labelAdd)
    divAjout.appendChild(inputAdd)
    divAjout.appendChild(p)

    inputAdd.addEventListener('change', () => {
        console.log('added image')
        divAjout.appendChild(afficherImage(divAjout, inputAdd))
    })
    
    
    const section = document.createElement('section')
    section.classList.add('form-ajout')
    const form = document.createElement('form')
    const labelTitre = createLabel('Titre')
    const labelCat = createLabel('Catégorie')
    const inputTitre = createInput('text', 'Titre')
    const selectCat = createSelect(categories, 'Catégorie')
    const ligne = document.createElement('div')
    ligne.classList.add('modale-ligne')
    const buttonSubmit = document.createElement('button')
    buttonSubmit.classList.add('button', 'real-button', 'modale-submit')
    buttonSubmit.setAttribute('type', 'submit')
    buttonSubmit.innerText = 'Valider'

    form.appendChild(labelTitre)
    form.appendChild(inputTitre)
    form.appendChild(labelCat)
    form.appendChild(selectCat)
    form.appendChild(ligne)
    form.appendChild(buttonSubmit)
    section.appendChild(form)

    modaleContent.appendChild(titre)
    modaleContent.appendChild(divAjout)
    modaleContent.appendChild(section)

    modaleBack.addEventListener('click', function (){
    
        genererModaleGalerie()
    })
}

function createLabel(name){

    const label = document.createElement('label')
    label.innerText = name
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    name = name.toLowerCase()
    label.setAttribute('for', name)
    
    
    return label
}

function createInput(type, name) {

    const input = document.createElement('input')
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    name = name.toLowerCase()
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    input.setAttribute('id', name)
    return input
}

function createSelect(array, name) {
    
    const select = document.createElement('select')
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    name = name.toLowerCase()
    select.setAttribute('name', name)
    select.setAttribute('id', name)

    const option = document.createElement('option')
    option.setAttribute('value', '')
    select.appendChild(option)

    for (let i = 0; i < array.length; i++) {
        
        const option = document.createElement('option')
        option.setAttribute('value', array[i].name)
        option.innerText = array[i].name
        select.appendChild(option)
    }

    return select
}

function afficherImage(container, input){

    container.innerText = ''
    const image = document.createElement('img')
    image.src = URL.createObjectURL(input.files[0])
    return image
}


/* const img = document.getElementById('affImg')
const upload = document.getElementById('test')
upload.addEventListener('change', () => {
    console.log('File name :', upload.files[0].name)
    img.src = URL.createObjectURL(upload.files[0])
}) */
