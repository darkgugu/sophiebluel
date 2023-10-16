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
    }).then(reponse => reponse.json())

    document.cookie = `userId=${reponse.userId}`
    document.cookie = `token=${reponse.token}`
    document.cookie = 'admin=true'

    if(reponse.message !== 'user not found'){
        window.location.replace('index.html')
    }
})