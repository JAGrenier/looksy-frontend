const $ = {
    menu: document.querySelector('.ham-menu'),
    // baseURL: "https://looksy-backend.herokuapp.com",
    userId: null,
    baseURL: "http://localhost:3000",
    loginForm: document.querySelector('.login-form'),
    createUserForm: document.querySelector('.new-user-form'),
    createUserButton: document.querySelector('.create-user-button'),
    loginButton: document.querySelector('.login-button')
}

$.menu.addEventListener('click', animateMenu)
$.createUserButton.addEventListener('click', (event) => displayCreateUserForm(event))
$.loginButton.addEventListener('click', (event) => displayLoginForm(event))
$.createUserForm.addEventListener('submit', createNewUser)
$.loginForm.addEventListener('submit', createUserLogin)

function animateMenu() {
    $.menu.classList.toggle("animated")
    document.querySelector('#nav-links').classList.toggle("animated")
    document.querySelector('.menu-bg').classList.toggle("animated-bg")
}

function createUserLogin(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const username = formData.get("username")
    const password = formData.get("password")
    loginUser(username, password)
}

async function logUserData(data) {
    let {user, token} = data
    localStorage.setItem('token', token)
    localStorage.setItem('username', user.username)
    $.userId = user.id
}

async function loginUser(username, password) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    await fetch(`${$.baseURL}/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({username, password})
    }).then(response => response.json())
        .then(logUserData)
        .then(createWelcomeMessage)
    userSetup()
}

// function createWelcomeMessage(user) {

// }

function userSetup() {
    deleteForms()
    createMenu()
    fetchItems()
}

function createMenu() {
    const profileLink = document.createElement('li')
    const homeLink = document.querySelector('.nav-links').firstElementChild
    const logoutLink = document.createElement('li')
    const lastLink = document.querySelector('.nav-links').lastElementChild
    profileLink.innerHTML = `<a class="link">My Profile</a>`
    logoutLink.innerHTML = `<a href="/" class="link">Logout</a>`
    homeLink.insertAdjacentElement('afterend', profileLink)
    lastLink.insertAdjacentElement('afterend', logoutLink)
    logoutLink.addEventListener('click', logout)
    // const lis = document.querySelectorAll('.nav-links > li')
    // let i = lis.length * 10
    // lis.forEach(element => {
    //     element.style.padding = `${i}px`
    //     i = i - 4
    // })
}

function deleteForms() {
    const signUpButtons = document.querySelector('.forms')
    signUpButtons.remove()
}

async function createNewUser(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")
    await postNewUser(username, email, password)
    loginUser(username, password)
}

function postNewUser(username, email, password) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    const user = {
        username,
        email,
        password
    }
    return fetch(`${$.baseURL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({user})
    })
}

function displayLoginForm(event) {
    $.loginForm.classList.toggle("hidden")
    if (!$.createUserForm.classList.contains("hidden")) {
        $.createUserForm.classList.toggle("hidden")
    }
}

function displayCreateUserForm(event) {
    $.createUserForm.classList.toggle("hidden")
    if (!$.loginForm.classList.contains("hidden")) {
        $.loginForm.classList.toggle("hidden")
    }
}

function fetchItems() {
    fetch(`${$.baseURL}/items`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(render3DModels)
}

function render3DModels(models) {
    models.forEach(renderAllModels)
}

function renderAllModels(model) {
    const modelCard = generateModelCard()
    const modelAR = render3DARModel(model)
    const name = renderModelName(model)
    const author = renderAuthorLink(model)
    const favoriteButton = renderFavoriteButton(model)
    modelCard.append(modelAR, name, author, favoriteButton)
}

function renderFavoriteButton(model) {
    const favoriteButton = document.createElement('button')
    favoriteButton.textContent = "heart"
    favoriteButton.dataset.modelId = model.id
    return favoriteButton
}

function renderModelName(model) {
    const name = document.createElement('h3')
    name.textContent = model.name
    return name
}

function render3DARModel(model) {
    const render = document.createElement('div')
    render.src = model.gltfsrc
    render.innerHTML = `<model-viewer src="${model.gltfsrc}" camera-controls auto-rotate magic-leap ar ios-src="${model.usdzsrc}"></model-viewer>`
    return render
}

function renderAuthorLink(model) {
    const author = document.createElement('p')
    author.classList.add('credits')
    author.innerHTML = `Made by: <a href="${model.authorURL}">${model.author}</a>`
    return author
}

function generateModelCard() {
    const cardContainer = document.querySelector('.card-container')
    const modelCard = document.createElement('div')
    modelCard.classList.add('model-card')
    cardContainer.appendChild(modelCard)
    return modelCard
}

function logout() {
    localStorage.clear()
}