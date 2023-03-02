function filtrarCpf(dados, cpf) {
    const filtroCpf = dados.contas.find((conta) => {
        return conta.usuario.cpf === cpf
    });
    return filtroCpf;
};

function filtrarEmail(dados, email) {
    const filtroEmail = dados.contas.find((conta) => {
        return conta.usuario.email === email
    });
    return filtroEmail;
};

function filtrarIndiceConta(dados, element){
    const filtrandoIndice = dados.contas.findIndex((conta) => {
        return conta.numero === element;
    });
    return filtrandoIndice;
};

function filtrarID(dados, numeroConta) {
    const filtroId = dados.contas.find((conta) => {
        return conta.numero === numeroConta;
    });
    return filtroId;
};

const escreverArquivo = (rota, arquivo) => {
    fs.writeFile(rota, 'module.exports =');
    fs.appendFile(rota, arquivo);
};

function validacaoBody(req) {
    
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
    if (!nome.trim() || !cpf.trim() || !data_nascimento.trim() || !telefone.trim() || !email.trim() || !senha.trim()) {
        return 'O Campo Nome obrigatorio'
    };

};


module.exports = {
    filtrarCpf,
    filtrarEmail,
    escreverArquivo,
    filtrarID,
    filtrarIndiceConta,
    validacaoBody
};
