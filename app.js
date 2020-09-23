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

function generateModelCard() {
    const cardContainer = document.querySelector('.card-container')
    const modelCard = document.createElement('div')
    modelCard.classList.add('model-card')
    cardContainer.appendChild(modelCard)
    return modelCard
}