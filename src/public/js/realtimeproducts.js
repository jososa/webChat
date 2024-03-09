
const socketClient = io()

socketClient.on("listaProductos", (obj)=>{
    refreshProducts(obj)
})

function refreshProducts(listProd){
    const divProd = document.getElementById('list-products')
    let prodHTML = ""

    listProd.forEach((product) =>{
        prodHTML += `

    <div class="col">
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top img-fluid" alt="...">
          <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">${product.code}</p>
            <p class="card-text">${product.price}</p>
            <p class="card-text">${product.stock}</p>
            <p class="card-text">${product.category}</p>
          </div>
          <button type="submit" class="btn btn-primary" onclick="deleteProduct(${product.id})">Eliminar</button>
        </div>
    </div>
      `
    })

    divProd.innerHTML=prodHTML
}

function deleteProduct(productId){
    socketClient.emit("deleteProduct",productId)
}


let form = document.getElementById('product-form')
form.addEventListener("submit", (evt) =>{
    evt.preventDefault()

    let title = form.elements.title.value
    let description = form.elements.description.value
    let code = form.elements.code.value
    let price = form.elements.price.value
    let stock = form.elements.stock.value
    let category = form.elements.category.value
    let thumbnail = form.elements.thumbnail.value

    const newProduct = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category,
        thumbnail: thumbnail
    }

    socketClient.emit("altaProducto", newProduct)

    form.reset()
})

let user;

window.onload = () => {
    Swal.fire({
        title: "Login",
        text: "Ingrese nombre de usuario",
        input: "text",
        inputValidator: (value) => {
            return !value && "Ingrese nombre para continuar!"
        },
        icon: "success"
      }).then((result) => {
        user = result.value
        socketClient.emit('auth',user)
      })
}

const chatbox = document.getElementById("chatbox")
chatbox.addEventListener('keyup', e => {
    if(e.key === "Enter"){
        socketClient.emit('message',{user: user,message:chatbox.value})
    }
})

let log = document.getElementById("log")

socketClient.on('messageLog', data =>{
    let messages = ""

    data.forEach(msg => {
        messages+=`${msg.user} dice: ${msg.message}<br/>`
    })

    log.innerHTML=messages
})