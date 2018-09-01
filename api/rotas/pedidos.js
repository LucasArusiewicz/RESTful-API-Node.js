//Carrega dependencias
const express = require("express");
const router = express.Router();

//Carrega controladores e autenticador
const Controlador_Pedido = require('../controladores/pedidos');
const checkAuth = require('../middleware/check-auth');

//Define Rotas para /pedidos
router.get("/", checkAuth, Controlador_Pedido.pedidos);
router.post("/", checkAuth, Controlador_Pedido.novo_pedido);
router.get("/:pedidoId", checkAuth, Controlador_Pedido.consulta_pedido);
router.delete("/:pedidoId", checkAuth, Controlador_Pedido.deleta_pedido);

//Exporta rota
module.exports = router;