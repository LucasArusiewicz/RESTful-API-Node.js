//Carrega dependencias
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Carrega modelo de dado
const Usuario = require("../Schema/usuario");

//Exporta modulo de cadastro
exports.cadastrar = (req, res, next) => {

    //Procura e-mail no banco
    Usuario.find({
        email: req.body.email
    }).exec().then(user => {
        
        //Caso já exista
        if (user.length >= 1) {
            return res.status(409).json({
                message: "E-mail já foi cadastrado."
            });

        //Caso e-mail nao esteja presente no banco
        } else {

            //Cria hash da senha
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {

                    //Caso tenha erro na operacao, retorna informacao
                    return res.status(500).json({
                        error: err
                    });
                } else {

                    //Cria novo Usuario e armazena no banco
                    const usuario = new Usuario({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    usuario.save().then(resultado => {
                            console.log(resultado);
                            res.status(201).json({
                                message: "Usuário Criado."
                            });
                        })

                        //Caso ocorra um erro ao criar o Usuario
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    });
};

//Exporta modulo de Login
exports.login = (req, res, next) => {

    //Procura login no banco
    Usuario.find({
            email: req.body.email
        }).exec().then(user => {

            //Caso nao retona um Usuario com o e-mail fornecido
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Falha na autenticação"
                });
            }

            //Compara hash com senha fornecida
            bcrypt.compare(req.body.password, user[0].password, (err, resultado) => {
                if (err) {
                    return res.status(401).json({
                        message: "Falha na autenticação"
                    });
                }
                if (resultado) {

                    //Cria JWT de 1h
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Autenticado com sucesso.",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Falha na autenticação"
                });
            });
        })

        //Caso ocorra um erro ao autenticar o Usuario
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Exporta modulo de remover Usuario
exports.remover = (req, res, next) => {

    //Remove Usuario
    Usuario.remove({
            _id: req.params.userId
        })
        .exec().then(result => {
            res.status(200).json({
                message: "Usuário Deletado."
            });
        })

        //Caso ocorra um erro ao excluir um Usuario
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};