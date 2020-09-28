const $ = {
    baseURL: "https://looksy-backend.herokuapp.com",
}

const createUserButton = document.querySelector('.create-user-button')
const loginButton = document.querySelector('.login-button')

createUserButton.addEventListener('click', (event) => displayCreateUserForm(event))
loginButton.addEventListener('click', (event) => displayLoginForm(event))

function displayLoginForm(event) {
    const loginForm = document.querySelector('.login-form')
    const createUserForm = document.querySelector('.new-user-form')
    loginForm.classList.toggle("hidden")
    if (!createUserForm.classList.contains("hidden")) {
        createUserForm.classList.toggle("hidden")
    }
}

function displayCreateUserForm(event) {
    const loginForm = document.querySelector('.login-form')
    const createUserForm = document.querySelector('.new-user-form')
    createUserForm.classList.toggle("hidden")
    if (!loginForm.classList.contains("hidden")) {
        loginForm.classList.toggle("hidden")
    }
}

// fetchItems()

function fetchItems() {
    fetch(`${$.baseURL}/items`)
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