import {createLabel, createInput, createSelect, afficherImage} from './tools.js'
import { connection } from './auth.js'
const localhost = 'http://localhost:5678/api/'

/*** PROJETS ***/

const galleryElement = document.querySelector('.gallery')
let projets = await fetch(localhost + 'works').then(projets => projets.json()).catch(() => {errorGET()})

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

/*** CATEGORIES ***/

const categories = await fetch(localhost + 'categories').then(categories => categories.json())
const buttonContainer = document.querySelector('.button-container')
const buttonElement  = document.querySelectorAll('.button-categories')
const defaultButton = document.createElement('button')

defaultButton.classList.add('button-categories', 'button-categories-selected')
defaultButton.setAttribute('id', 'button0')
defaultButton.innerText = "Tout"
buttonContainer.appendChild(defaultButton)

//Génération boutons de tri

for (let i = 0; i < categories.length; i++) {
    
    const button = document.createElement('button')
    button.classList.add('button-categories')
    button.setAttribute('id', 'button' + (i + 1))

    button.innerText = categories[i].name
    buttonContainer.appendChild(button)
}

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
        afficherProjets(catMap, galleryElement)
    })  
}

/*** INTERFACE ADMIN ***/
const token = connection()
console.log(token)

/*** MODALE ***/

const modal = document.querySelector('.modale')
const modalOpen = document.querySelector('.modifier-link')
const modalClose = document.querySelector('.modale-close')
const modaleContent = document.querySelector('.modale-content')

modalOpen.addEventListener('click', function (event){
    event.preventDefault()
    modal.showModal()
})

modalClose.addEventListener('click', () => {fermerModale()})

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
            trashContainer.addEventListener('click', async function (){
        
                const del = await fetch(`http://localhost:5678/api/works/${projets[i].id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })


                console.log('projets :', projets);
                console.log('i :', i);
                console.log('projets[i].id :', projets[i].id);


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
    buttonSubmit.classList.add('button', 'real-button', 'modale-submit', 'grey-button')
    buttonSubmit.setAttribute('type', 'submit')
    buttonSubmit.innerText = 'Valider'
    buttonSubmit.addEventListener('click', async (event) => {

        event.preventDefault()

        if(inputTitre.value === '' || selectCat.value === '' || inputAdd.files[0] === undefined){

            const array = []

            if (inputTitre.value === '') {
                console.log('titre')
                array.push(inputTitre)
            }
            if (selectCat.value === '') {
                console.log('catégorie')
                array.push(selectCat)
            }
            if (inputAdd.files[0] === undefined) {
                console.log('photo')
                array.push(divAjout)
                array.push(inputAdd)
            }

            for (let i = 0; i < array.length; i++) {
                array[i].classList.add('wrong-connection')
                array[i].addEventListener('input', () => {
                    array[i].classList.remove('wrong-connection')
                })
            }
        }
        else{
            let formData = new FormData()
            formData.append('title', inputTitre.value)
            formData.append('category', selectCat.value)
            formData.append('image', inputAdd.files[0])
    
            const reponse = await fetch(localhost + 'works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            console.log(reponse)
    
            projets = await fetch(localhost + 'works').then(projets => projets.json())
            afficherProjets(projets, galleryElement)
            fermerModale()
            console.log(projets)        
        }
    })

    inputAdd.addEventListener('change', () => { checkForValidation() })
    inputTitre.addEventListener('change', () => { checkForValidation() })
    selectCat.addEventListener('change', () => { checkForValidation() })

    function checkForValidation(){

        if (inputAdd.files[0] !== undefined && inputTitre.value !== '' && selectCat.value !== '') {
            console.log('OK')
            buttonSubmit.classList.remove('grey-button')
        }
        else{
            buttonSubmit.classList.add('grey-button')
        }
    }

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

function fermerModale() {
    modal.close()
    genererModaleGalerie()
}

function errorGET(){
    console.log('erreur')
    const erreur = document.createElement('h3')
    erreur.innerText = 'ERREUR SERVEUR'
    document.getElementById('portfolio').appendChild(erreur)
}