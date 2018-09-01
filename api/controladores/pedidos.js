//Carrega dependencias
const mongoose = require("mongoose");
const Pedido = require("../Schema/pedido");
const Produto = require("../Schema/produto");

//Exporta modulo que retorna todos os Pedidos
exports.pedidos = (req, res, next) => {

    //Realiza busca no banco
    Pedido.find()
        .select("_id produto quantidade")
        .populate("produto", "nome").exec().then(docs => {
            res.status(200).json({
                numero: docs.length,
                pedidos: docs.map(doc => {
                    return {
                        _id: doc._id,
                        produto: doc.produto,
                        quantidade: doc.quantidade,
                        request: {
                            type: "GET",
                            url: process.env.URL_PEDIDOS + doc._id
                        }
                    };
                })
            });
        })

        //Caso aconteca algum problema ao realizar busca
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de criacao de Pedidos
exports.novo_pedido = (req, res, next) => {

    //Verifica se produto fornecida esta cadastrado no banco
    Produto.findById(req.body.produtoId).then(produto => {
            if (!produto) {
                return res.status(404).json({
                    message: "Produto não encontrado."
                });
            }

            //Caso esteja, cria novo Pedido
            const pedido = new Pedido({
                _id: mongoose.Types.ObjectId(),
                quantidade: req.body.quantidade,
                produto: req.body.produtoId
            });

            //Salva Pedido no banco
            return pedido.save();

        //Retorna resultado da operacao
        }).then(resultado => {
            console.log(resultado);
            res.status(201).json({
                message: "Pedido armazenado.",
                PedidoCriado: {
                    _id: resultado._id,
                    produto: resultado.produto,
                    quantidade: resultado.quantidade
                },
                request: {
                    type: "GET",
                    url: process.env.URL_PEDIDOS + resultado._id
                }
            });
        })

        //Caso ocorra algum erro na hora de criar o Pedido
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de consulta de Pedidos
exports.consulta_pedido = (req, res, next) => {

    //Pesquisa Pedido no banco
    Pedido.findById(req.params.pedidoId).populate("produto").exec().then(pedido => {
            if (!pedido) {
                return res.status(404).json({
                    message: "Pedido não encontrado."
                });
            }

            //Retorna Pedido
            res.status(200).json({
                pedido: pedido,
                type: "GET",
                request: {
                    url: process.env.URL_PEDIDOS
                }
            });
        })

        //Caso ocorra algum erro na hora de pesquisar no banco
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de exclusao de Pedido
exports.deleta_pedido = (req, res, next) => {

    //Remove Pedido do banco
    Pedido.remove({
            _id: req.params.pedidoId
        }).exec().then(result => {
            res.status(200).json({
                message: "Pedido Removido.",
                request: {
                    type: "POST",
                    url: process.env.URL_PEDIDOS,
                    body: {
                        produto: "ID",
                        quantidade: "Number"
                    }
                }
            });
        })

        //Caso ocorra algum erro na hora de deletar Pedido do banco
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};