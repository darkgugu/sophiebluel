export function connection(){
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

    return token
}