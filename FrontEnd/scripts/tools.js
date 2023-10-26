export function createLabel(name){

    const label = document.createElement('label')
    label.innerText = name
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    name = name.toLowerCase()
    label.setAttribute('for', name)
    
    
    return label
}

export function createInput(type, name) {

    const input = document.createElement('input')
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    name = name.toLowerCase()
    input.setAttribute('type', type)
    input.setAttribute('name', name)
    input.setAttribute('id', name)
    return input
}

export function createSelect(array, name) {
    
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
        option.setAttribute('value', array[i].id)
        option.innerText = array[i].name
        select.appendChild(option)
    }

    return select
}

export function afficherImage(container, input){

    container.innerText = ''
    const image = document.createElement('img')
    image.setAttribute('id', 'imgAdd')
    image.src = URL.createObjectURL(input.files[0])
    return image
}