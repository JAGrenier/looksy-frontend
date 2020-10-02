const $ = {
    menu: document.querySelector('.ham-menu'),
    uploadURL: "https://looksy-file-uploader.herokuapp.com/upload",
    baseURL: "https://looksy-backend.herokuapp.com",
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
    const editButton = document.querySelector('.edit-button')
    editButton.addEventListener('click', (event) => renderBioForm(user))
    // renderBioEditButton(user)
    $.upload.addEventListener('submit', (event) => uploadFile(event, user))
}

// function renderBioEditButton(user) {
//     const about = document.querySelector('#bio')
//     const editButton = renderEditButton()
//     about.insertAdjacentElement('afterend', editButton)
//     editButton.addEventListener('click', (event) => renderBioTextArea(event, user))
// }

// function renderEditButton() {
//     const editButton = document.createElement('button')
//     editButton.textContent = "Edit Bio"
//     editButton.classList.add('edit-button')
//     return editButton
// }

function renderBioForm(user) {
    toggleEditButton()
    console.log("edit toggle")
    const bioFormDiv = document.querySelector('#bio-form-div')
    const bioForm = createBioTextArea(bioFormDiv, user)
    // const bioForm = createBioTextArea(bioFormDiv, user)

    // const bioForm = document.querySelector('#user-bio-form')
    // toggleBioForm(bioForm)
    // const bio = document.querySelector('#user-bio-form')
    // bio.value = user.bio
    // bioForm.addEventListener('submit', (event) => updateUserBio(event, user))
}

function createBioTextArea(div, user) {
    const bioForm = document.createElement('form')
    bioForm.classList.add("user-bio-form")
    div.appendChild(bioForm)
    const bioTextArea = renderTextArea(user)
    const saveButton = renderSaveButton()
    bioForm.append(bioTextArea, saveButton)
    bioForm.addEventListener('submit', (event) => updateUserBio(event, user))
    return bioForm
}

function renderSaveButton() {
    const saveButton = document.createElement('button')
    saveButton.type = "submit"
    saveButton.textContent = "Save"
    saveButton.classList.add("bio-save-button")
    return saveButton
}

function renderTextArea(user) {
    const textArea = document.createElement('textarea')
    textArea.value = user.bio
    textArea.name = "bio"
    textArea.classList.add('bio-text-area') 
    return textArea
}


function toggleEditButton() {
    document.querySelector('.edit-button').classList.toggle('hidden')
}

function toggleBioForm(bioForm) {
    bioForm.classList.toggle('hidden')
}

function updateUserBio(event, user) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const bioData = formData.get('bio')
    fetch(`${$.baseURL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            user: {
                bio: bioData
            }
        })
    }).then(parseResponse)
    .then(renderBio)
    defaultBioLook()
}

function defaultBioLook() {
    const userBioForm = document.querySelector('.user-bio-form')
    userBioForm.classList.toggle('hidden')
    const editButton = document.querySelector('.edit-button')
    editButton.classList.toggle('hidden')
}

function renderBio(user) {
    const bio = document.querySelector('#bio')
    bio.innerHTML = user.bio
    // if (bio.innerHTML === undefined) {
    //     bio.innerHTML === `<em>"No user bio, click edit to make one"</em>`
    // }
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
        const message = error
            // If there was an error, show it
            ? `There was an error: ${error}`
            // Otherwise, show the URL of the uploaded file
            : `File was uploaded to: <a href="${data}">${data}</a>`
        $message.innerHTML = `<p>${message}</p>`;
    }).catch(error => {
        // If there was a problem, show the error message
        $message.innerHTML = `
            <p>There was an error: ${error.message}</p>
        `;
    });
}
        // updateUserImage(data, user)
        //     .then(parseResponse)
//         //     .then(renderUpdatedImage)
//     })
// }

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
            user: {
                image: data
            }
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

function contactOverlay() {
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


// Hi my name is TJ and I'm actually the creator of Looksy. It's so cool to see this app come together and share it with people!