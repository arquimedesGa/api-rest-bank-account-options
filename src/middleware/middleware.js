
async function password(req, res, next) {
    try {
        const { senha_banco } = req.query;
        if(!senha_banco) {
            return res.status(401).json({mensagem: 'por favor informar a senha'});
        };
        if(senha_banco !== dados.banco.senha) {
            return res.status(401).json({mensagem : 'Senha errada por favor digite a senha novamente'})
        };
        return next();
    } catch (error) {
        return res.status(401).json({mensagem : 'Usuario nao autenticado nao tem autorizacao'});
    };

};




module.exports = {
    password,
};