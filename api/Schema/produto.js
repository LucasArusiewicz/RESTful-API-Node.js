//Carrega modulo
const mongoose = require('mongoose');

//Cria modelo de dado
const produtoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String, required: true },
    preco: { type: Number, required: true }
});

//Exporta modelo
module.exports = mongoose.model('Produto', produtoSchema);