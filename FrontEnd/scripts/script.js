const projets = await fetch('http://localhost:5678/api/works').then(projets => projets.json())
console.log('projets :', projets);

const galleryElement = document.querySelector('.gallery')

for (let i = 0; i < projets.length; i++) {
    
    const figureElement = document.createElement('figure')
    const imgElement = document.createElement('img')
    const captionElement = document.createElement('figcaption')

    imgElement.setAttribute('src', projets[i].imageUrl)
    imgElement.setAttribute('alt', projets[i].title)
    captionElement.innerText = projets[i].title

    figureElement.appendChild(imgElement)
    figureElement.appendChild(captionElement)
    galleryElement.appendChild(figureElement)
}

const categories = await fetch('http://localhost:5678/api/categories').then(categories => categories.json())
console.log('categories :', categories);

const buttonContainer = document.querySelector('.button-container')

const defaultButton = document.createElement('button')
defaultButton.classList.add('button-categories', 'button-categories-selected')
defaultButton.innerText = "Tout"
buttonContainer.appendChild(defaultButton)

for (let i = 0; i < categories.length; i++) {
    
    const button = document.createElement('button')
    button.classList.add('button-categories')

    button.innerText = categories[i].name
    buttonContainer.appendChild(button)
}



