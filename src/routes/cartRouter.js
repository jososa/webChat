import { Router } from "express"
import fs from "fs"
import { CartManager } from '../controllers/CartManager.js'

const carrito = new CartManager()

const cartRouter = Router()

cartRouter.post("/", async (req, res) => {

    try {
        const newCart = await carrito.createCart();
        res.status(201).send({ status: "Carrito creado", payload: newCart })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: "Error al crear el carrito",  error: error.message })
    }
})


cartRouter.get("/:cid", async (req, res) => {

    try {
        const cid = req.params.cid;
        const cart = await carrito.getCartById(cid)
        res.json(cart)

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: "Internal Server Error",  error: error.message})
    }
})

cartRouter.post("/:cid/product/:prodId", async (req, res) => {

    const { cid, prodId } = req.params;

    try {
      const updatedCart = await carrito.addProductsToCart(cid, prodId)
      res.status(201).send({ status: "Producto agregado al carrito" })
    } catch (error) {
        res.status(500).send({ status: "Internal Server Error",  error: error.message })
    }
})

export default cartRouter