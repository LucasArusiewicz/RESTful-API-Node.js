//Carrega dependencias
const express = require("express");
const router = express.Router();
const multer = require('multer');

//Carrega controladores e autenticador
const Controlador_Pedido = require('../controladores/produtos');
const checkAuth = require('../middleware/check-auth');

//Define pasta onde sera salva os arquivo upados
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

//Define filtro de entrada para os arquivos upados, somente imagens jpeg/png
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//Define tamanho maximo de upload para 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Define Rotas para /produtos
router.get("/", Controlador_Pedido.produtos);
router.post("/", checkAuth, upload.single('imagem'), Controlador_Pedido.novo_produto);
router.get("/:produtoId", Controlador_Pedido.consulta_produto);
router.patch("/:produtoId", checkAuth, Controlador_Pedido.update_produto);
router.delete("/:produtoId", checkAuth, Controlador_Pedido.remover_produto);

//Exporta rota
module.exports = router;