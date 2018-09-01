//Carrega dependencias
const express = require("express");
const router = express.Router();

//Carrega controladores e autenticador
const Controlador_Usuario = require('../controladores/usuarios');
const checkAuth = require('../middleware/check-auth');

//Define Rotas para /usuarios
router.post("/cadastrar", Controlador_Usuario.cadastrar);
router.post("/login", Controlador_Usuario.login);
router.delete("/:userId", checkAuth, Controlador_Usuario.remover);

//Exporta rota
module.exports = router;