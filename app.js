console.log("working")

const baseURL = "http://localhost:3000"
const itemURL = `${baseURL}/items`
const userURL = "http://localhost:3000/users"

fetch(`${itemURL}`)
    .then(response => response.json())
    .then(render3DModels)

function render3DModels(models) {
    models.forEach(renderAllModels)
}

function renderAllModels(model) {
    const modelCard = generateModelCard()
    const name = renderModelName(model, modelCard)
    const modelAR = render3DARModel(model, modelCard)
}

function renderModelName(model, modelCard) {
    const name = document.createElement('h3')
    name.textContent = model.name
    modelCard.appendChild(name)
    return name
}

function render3DARModel(model, modelCard) {
    const render = document.createElement('div')
    render.innerHTML = `<model-viewer src="${model.gltfsrc}" camera-controls auto-rotate ar ios-src="${model.usdzsrc}"></model-viewer>`
    modelCard.appendChild(render)
    return render
}

function generateModelCard() {
    const cardContainer = document.querySelector('.card-container')
    const modelCard = document.createElement('div')
    modelCard.classList.add('model-card')
    cardContainer.appendChild(modelCard)
    return modelCard
}