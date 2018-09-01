//Carrega dependencias
const mongoose = require("mongoose");
const Produto = require("../Schema/produto");

//Exporta modulo que retorna todos os Produtos
exports.produtos = (req, res, next) => {

    //Realiza busca de todos os Produtos cadastrados
    Produto.find().select("_id nome preco descricao imagem").exec().then(docs => {
            const retorno = {
                numero: docs.length,
                produtos: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nome: doc.nome,
                        descricao: doc.descricao,
                        preco: doc.preco,
                        imagem: doc.imagem,
                        request: {
                            type: "GET",
                            url: process.env.URL_PRODUTOS + doc._id
                        }
                    };
                })
            };
            res.status(200).json(retorno);
        })

        //Caso aconteca algum problema na hora de realizar a busa
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de criacao de Produtos
exports.novo_produto = (req, res, next) => {

    //Cria novo produto
    const produto = new Produto({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.name,
        descricao: req.body.descricao,
        imagem: req.file.path,
        preco: req.body.price
    });

    //Salva Produto no banco
    produto.save().then(resultado => {

            //Retorna resultado da operacao
            console.log(resultado);
            res.status(201).json({
                message: "Produto Criado com Sucesso.",
                ProdutoCriado: {
                    _id: resultado._id,
                    nome: resultado.nome,
                    descricao: resultado.descricao,
                    preco: resultado.preco,
                    request: {
                        type: "GET",
                        url: process.env.URL_PRODUTOS + resultado._id
                    }
                }
            });
        })

        //Caso ocorra algum erro na hora de criar o Produto
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de consulta de Produtos
exports.consulta_produto = (req, res, next) => {

    //Pesquisa Produto no banco
    Produto.findById(req.params.produtoId).select("_id nome descricao imagem preco").exec().then(doc => {
            console.log("Consulta ", doc);
            if (doc) {

                //Retorna resultado da operacao
                res.status(200).json({
                    produto: doc,
                    request: {
                        type: "GET",
                        url: process.env.URL_PRODUTOS
                    }
                });
            } else {
                res.status(404).json({
                    message: "Nenhum valor encontrado através do ID fornecido."
                });
            }
        })

        //Caso ocorra algum erro na hora de pesquisar no banco
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de update de Produtos
exports.update_produto = (req, res, next) => {

    //Coleta informacoes necessaria para realizar o update
    const id = req.params.produtoId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    //Atualiza Produto
    Produto.update({
            _id: id
        }, {
            $set: updateOps

            //Retorna resultado da operacao
        }).exec().then(resultado => {
            console.log(resultado);
            res.status(200).json({
                message: "Produto Atualizado.",
                request: {
                    type: "GET",
                    url: process.env.URL_PRODUTOS + id
                }
            });
        })

        //Caso ocorra algum erro na hora de atualizar Produto
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de exclusao de Produto
exports.remover_produto = (req, res, next) => {

    //Remove Produto do banco
    Produto.remove({
            _id: req.params.produtoId
        })
        .exec().then(result => {
            res.status(200).json({
                message: "Produto Deletado",
                request: {
                    type: "POST",
                    url: process.env.URL_PRODUTOS,
                    body: {
                        nome: "String",
                        descricao: "String",
                        imagem: "Path",
                        preco: "Number"
                    }
                }
            });
        })

        //Caso ocorra algum erro na hora de deletar Produto do banco
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};