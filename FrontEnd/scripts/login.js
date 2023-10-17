const email = document.getElementById('email')
const password = document.getElementById('password')

const logForm = document.getElementById('log')

logForm.addEventListener('submit', async function (event){

    event.preventDefault()

    const credentials = {
        email: email.value,
        password: password.value
    }

    const chargeUtile = JSON.stringify(credentials)

    const reponse = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: chargeUtile
    })

    const status = reponse.status

    const reponseJson = await reponse.json()

    document.cookie = `userId=${reponseJson.userId}`
    document.cookie = `token=${reponseJson.token}`
    document.cookie = 'admin=true'

    const errorElement = document.getElementById('error-container')

    if(status === 200){
        window.location.replace('index.html')
    }
    else if(status === 401 || status === 404){

        email.classList.add('wrong-connection')
        password.classList.add('wrong-connection')

        email.addEventListener('input', function (){
            email.classList.remove('wrong-connection')
        })
        password.addEventListener('input', function (){
            password.classList.remove('wrong-connection')
        })


        if (status === 401) {
            errorElement.innerText = 'Mauvaise adresse mail ou mot de passe'
        }
        else{
            errorElement.innerText = 'Utilisateur inconnu'
        }
    }
    else{
        errorElement.innerText = 'Erreur'
    }
})