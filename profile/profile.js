// const { parse } = require("path")

const $ = {
    menu: document.querySelector('.ham-menu'),
    uploadURL: "https://looksy-file-uploader.herokuapp.com/upload",
    // baseURL: "https://looksy-backend.herokuapp.com",
    baseURL: "http://localhost:3000",
    userId: null,
    upload: document.querySelector('#photo-upload-form')
}

const queryParams = new URLSearchParams(window.location.search)
$.userId = queryParams.get('user_id')

fetch(`${$.baseURL}/users/${$.userId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})
    .then(parseResponse)
    .then(displayProfile)

function displayProfile(user) {
    createWelcomeMessage(user)
    createMenu()
    renderUserAvatar(user)
    renderBio(user)
    renderBioEditButton(user)
    $.upload.addEventListener('submit', (event) => uploadFile(event, user))
    return user
}

function renderBioEditButton(user) {
    const about = document.querySelector('#bio')
    const editButton = renderEditButton()
    about.insertAdjacentElement('afterend', editButton)
    editButton.addEventListener('click', (event) => renderBioTextArea(event, user))
}

function renderEditButton() {
    const editButton = document.createElement('button')
    editButton.textContent = "Edit Bio"
    editButton.classList.add('edit-button')
    return editButton
}

function renderBioTextArea(event, user) {
    document.querySelector('.edit-button').remove()
    const bioForm = document.querySelector('#user-bio-form')
    bioForm.classList.toggle('hidden')
    const bio = document.querySelector('.user-bio-form')
    bio.value = user.bio
    const saveButton = document.querySelector('.bio-save-button')
    bioForm.addEventListener('submit', (event) => updateUserBio(event, user))
}

function updateUserBio(event, user) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const bioData = formData.get('bio')
    console.log(bioData)
    fetch(`${$.baseURL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            bio: bioData
        })
    }).then(parseResponse)
    .then(console.log)
}

function renderBio(user) {
    const bio = document.querySelector('#bio')
    bio.textContent = user.bio 
    if (bio.textContent === null) {
        bio.innerHTML === `<em>"No user bio, click edit to make one"</em>`
    }
}

function renderUserAvatar(user) {
    const img = document.querySelector('#avatar')
    if (user.image) {
        img.src = user.image
    } else {
        img.src = "https://www.pngitem.com/pimgs/m/504-5040528_empty-profile-picture-png-transparent-png.png"
    }
}

function createMenu() {
    const profileLink = document.createElement('li')
    const homeLink = document.querySelector('.nav-links').firstElementChild
    const logoutLink = document.createElement('li')
    const lastLink = document.querySelector('.nav-links').lastElementChild
    profileLink.innerHTML = `<a href="../profile/profile.html?user_id=${localStorage.getItem('id')}" class="link">My Profile</a>`
    logoutLink.innerHTML = `<a href="/" class="link">Logout</a>`
    homeLink.insertAdjacentElement('afterend', profileLink)
    lastLink.insertAdjacentElement('afterend', logoutLink)
    logoutLink.addEventListener('click', logout)
}

async function createWelcomeMessage(user) {
    const titleContainer = document.querySelector('.title-card')
    const welcome = document.querySelector('.welcome-user')
    welcome.textContent = `Welcome ${user.username}!`
    titleContainer.append(welcome)
}

function uploadFile(event, user) {
    event.preventDefault()
    const $message = document.querySelector("#message");
    const formData = new FormData(event.target)
    fetch($.uploadURL, {
        method: "POST",
        body: formData
    }).then(parseResponse)
    .then(({data, error}) => {
        console.log(error)
        updateUserImage(data, user)
            .then(parseResponse)
            .then(renderUpdatedImage)
    })
}

function renderUpdatedImage(user) {
    const img = document.querySelector('#avatar')
    img.src = user.image
    img.alt = `${user.username}'s profile picture`
}

async function updateUserImage(data, user) {
    return fetch(`${$.baseURL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            image: data
        })
    })
}

// .then(parseResponse)
//     .then(({data, error}) => {
//         const message = error
//             ? `There was an error: ${error}`
//             : `File was uploaded to: <a href="${data}">${data}</a>`
//         $message.innerHTML = `<p>${message}</p>`;
//     }).catch(error => {
//         $message.innerHTML = `<p>There was an error: ${error.message}</p>`
//     })

$.menu.addEventListener('click', animateMenu)

function contactsOverlay() {
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









