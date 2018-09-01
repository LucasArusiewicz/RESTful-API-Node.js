//Carrega modulo
const mongoose = require('mongoose');

//Cria modelo de dado
const pedidoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
    quantidade: { type: Number, default: 1 }
});

//Exporta modelo
module.exports = mongoose.model('Pedido', pedidoSchema);