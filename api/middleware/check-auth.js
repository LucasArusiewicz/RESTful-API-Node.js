//Carrega modulos
const jwt = require('jsonwebtoken');

//Exporta modulo
module.exports = (req, res, next) => {
    //Carrega token e tenta autenticar
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Falha na autenticação'
        });
    }
};