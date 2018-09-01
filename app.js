//Carrega dependencias
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Carrega modulos das rotas
const Rota_Produtos = require("./api/rotas/produtos");
const Rota_Pedidos = require("./api/rotas/pedidos");
const Rota_Usuarios = require("./api/rotas/usuarios");

//Conecta com o mongodb
mongoose.connect(process.env.STRING_CONNECTION);
mongoose.Promise = global.Promise;

//Define formatacao de saida no console
app.use(morgan("dev"));

//Define rota de envio de arquivos via formulario
app.use('/uploads', express.static('uploads'));

//Define formas de entrada
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Define cabecalho de forma explicita
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //Define quais metodos serao permitidos
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Define Rotas para atender solicitacoes
app.use("/produtos", Rota_Produtos);
app.use("/pedidos", Rota_Pedidos);
app.use("/usuarios", Rota_Usuarios);

//Define erro de requisicao na api
app.use((req, res, next) => {
  const error = new Error("Erro de requisição, verifique a URL.");
  error.status = 404;
  next(error);
});

//Define retorno para erros no servidor
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//Exporta modulo
module.exports = app;