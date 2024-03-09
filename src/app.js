import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductManager from './controllers/ProductManager.js'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import viewsRouter from './routes/viewsRouter.js'


const productos = new ProductManager()

const app = express()
const PORT = process.env.PORT || 8080

//app.listen(port,() => console.log("Servidor corriendo en puerto ", port))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.use("/",viewsRouter)

//Carpeta de vistas
app.set('views', `${__dirname}/views`)

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

//Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)

const server = app.listen(PORT,()=>console.log("Listening in",PORT))

const socketServer = new Server(server)

const msg=[]

socketServer.on('connection', async(socket)=>{
    //console.log("Conectado al socket del server con ID: ", socket.id)

    const lstProd = await productos.getProducts()
    socketServer.emit("listaProductos", lstProd)

    socket.on("altaProducto", async(obj)=>{
        try {
            await productos.addProduct(obj)
            const lstProd = await productos.getProducts()
            socketServer.emit("listaProductos",lstProd)
        } catch (error) {
            console.log("Error al crear producto: ", error.message)
        }
    })

    socket.on("deleteProduct", async(prodId)=>{
        await productos.deleteProduct(prodId)
        const lstProd = await productos.getProducts()
        socketServer.emit("listaProductos",lstProd)
    })

    socket.on('message',data => {
        msg.push(data)
        socketServer.emit('messageLog', msg)

    })

})
