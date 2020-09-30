const $ = {
    menu: document.querySelector('.ham-menu'),
    // baseURL: "https://looksy-backend.herokuapp.com",
    baseURL: "http://localhost:3000",
    userId: null,
    upload: document.querySelector('#photo-upload-form')
}

$.upload.addEventListener('submit', uploadFile)
// $.upload.addEventListener('change', (event) => console.dir(event.target.parentNode))
const queryParams = new URLSearchParams(window.location.search)
$.userId = queryParams.get('user_id')
fetch(`${$.baseURL}/users/${$.userId}`, {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})
    .then(parseResponse)
    .then(console.log)

function displayProfile(user) {
    return user
}

function uploadFile(event) {
    event.preventDefault()
    const photo = document.querySelector('#upload').files[0]
    console.log(photo)
    fetch(`${$.baseURL}/attachment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }, 
        body: JSON.stringify({
            avatar: photo
        })
    }).then(parseResponse)
    .then(console.log)
}

$.menu.addEventListener('click', animateMenu)

function contactsOverlay(){
    const overlay = document.querySelector('#contact-overlay')
    if (overlay.style.display === "flex") {
        overlay.style.display = "none"
    } else {
    overlay.style.display = "flex"
    }
}

function logout() {
    localStorage.clear()
}

function parseResponse(response) {
    return response.json()
}

function animateMenu() {
    $.menu.classList.toggle("animated")
    document.querySelector('#nav-links').classList.toggle("animated")
    document.querySelector('.menu-bg').classList.toggle("animated-bg")
}