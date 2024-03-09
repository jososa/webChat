import { Router } from "express"
import ProductManager from '../controllers/ProductManager.js'

const productos = new ProductManager()

const viewsRouter = Router()


viewsRouter.get("/", async (req, res)=>{
    let allProducts = await productos.getProducts()
    res.render('home', {products : allProducts})
})


viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
})


export default viewsRouter