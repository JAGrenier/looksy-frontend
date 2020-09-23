const baseURL = "https://looksy-backend.herokuapp.com/"
const itemURL = `${baseURL}/items`
const userURL = `${baseURL}/users`

fetchItems()

function fetchItems() {
    fetch(`${itemURL}`)
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
    modelCard.append(modelAR, name, author)
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