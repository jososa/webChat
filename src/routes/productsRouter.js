import { Router } from "express"
import fs from "fs"
import { ProductManager } from '../controllers/ProductManager.js'

const productos = new ProductManager()

const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
    const getProd = await productos.getProducts()
    let limit = parseInt(req.query.limit)
    if(!limit) return res.send(await getProd)
    let allProd = await getProd
    let prodLimit = allProd.slice(0,limit)
    res.send(prodLimit)
})

productsRouter.get("/:prodId", async (req, res) => {
    const getProd = await productos.getProducts()
    let prodId = parseInt(req.params.prodId)
    let allProd = await getProd
    let prod = allProd.find((product) => (product.id == prodId))
    if(!prod) return res.json({ error: "Producto no encontrado" })
    res.send(prod)
})

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
      await productos.addProduct(newProduct)
      res.json({message: "Producto agregado"})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
})

productsRouter.put("/:prodId", async (req, res) => {

    const productId = req.params.prodId
    const updatedFields = req.body
    try {
      const updatedProduct = await productos.updateProduct(
        productId,
        updatedFields
      );
      res.json({ status: "Producto actualizado", updatedProduct })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
})

productsRouter.delete("/:prodId", async (req, res) => {

    const productId = req.params.prodId
    try {
      await productos.deleteProduct(productId)
      res.json({ status: "Producto eliminado" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
})

export default productsRouter