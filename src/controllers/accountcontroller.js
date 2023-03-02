const db = require('../dbconnect');
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');


const controllers = {
    async listofAccounts(req, res){
        try {
            res.status(200).json(bancodedados.contas);
        } catch (error) {
            res.status(400).json({mensagem : 'Lista nao existe erro inesperado.'})
        };
        
    },
    
    async creatingBankAccount(req, res) {
        try {
            const validacao = utilidades.validacaoBody(req);
    
            if(validacao){
                return res.status(400).json({mensagem : 'Todos os campos sao obrigatorios'});
            };
    
            const {cpf, email} = req.body;
    
            let cpfFind = utilidades.filtrarCpf(dados, cpf);
    
            let emailFind = utilidades.filtrarEmail(dados, email);
            
            if(cpfFind || emailFind) {
                return res.status(400).json({mensagem : 'email ou cpf ja tem cadastro em nosso banco.'})
            };
            
            dados.contas.push({numero : uuidv4(), saldo : 0, usuario : {...req.body}});
            
            let dadosAstring = JSON.stringify(dados)
            
           utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
    
            return res.status(201).json();
            
        } catch (error) {
            return res.status(500).json(error.message);
        };
        
    },
    
    async modifiedAccounts(req, res) {
        try {
            const validacao = utilidades.validacaoBody(req);
    
            if(validacao){
                return res.status(400).json({mensagem : 'Todos os campos sao obrigatorios'});
            };
    
            const {cpf, email} = req.body;
    
            const {numeroConta} = req.params;
    
            const filtrandonumeroDeConta = utilidades.filtrarID(dados, numeroConta);
    
            if(!filtrandonumeroDeConta) {
                return res.status(400).json({mensagem : 'Id invalido ou usuario nao existe'});
            };
    
            if(filtrandonumeroDeConta.usuario.cpf !== cpf || filtrandonumeroDeConta.usuario.email !== email) {
                let cpfFiltrado = utilidades.filtrarCpf(dados, cpf);
                let emailFiltrado = utilidades.filtrarEmail(dados, email);
                let numeroContaEmail;
                let numeroContaCpf;
                if(cpfFiltrado){
                    numeroContaCpf = cpfFiltrado.numero !== filtrandonumeroDeConta.numero;
                };
                if(numeroContaCpf) {
                    return res.status(400).json({mensagem : 'Cpf Cadastrado em outra conta'});
                };
                if(emailFiltrado){
                    numeroContaEmail = emailFiltrado.numero !== filtrandonumeroDeConta.numero;
                };
                if(numeroContaEmail) {
                    return res.status(400).json({mensagem : 'Email Cadastrado em outra conta'});
                };
    
            };
            let indiceConta = utilidades.filtrarIndiceConta(dados, numeroConta);
    
            dados.contas[indiceConta].usuario = {...req.body};
    
            let dadosAstring = JSON.stringify(dados)
            
            utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
            
            return res.status(204).json();
           
        } catch (error) {
            res.status(500).json({mensagem : error.message});
        };
    
    },
    
    async DeleteAccounts(req, res) {
        try {
            const {numeroConta} = req.params;
    
            const indiceConta = utilidades.filtrarIndiceConta(dados, numeroConta);
    
            if(indiceConta === -1) {
                return res.status(400).json({mensagem : 'Id invalido ou usuario nao existe'});
            };
    
            if(dados.contas[indiceConta].saldo > 0) {
                return res.status(403).json({"mensagem": "A conta só pode ser removida se o saldo for zero!"})
            };
    
            dados.contas.splice(indiceConta, 1);
    
            let dadosAstring = JSON.stringify(dados)
            
            utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
            
            return res.status(204).json();
    
        } catch (error) {
            res.status(500).json({mensagem : error.message});
        };
    },
    
    async accountDeposit (req, res){
        try {
            const {numero_conta, valor} = req.body;
    
            if(!numero_conta) {
                return res.status(400).json({mensagem : 'por Favor informe o numero da Conta'});
        
            };
        
            if (!valor || valor <= 0){
                return res.status(400).json({mensagem : 'por favor informe un valor a depositar valido'});
            };
            
            const indiceDeConta = utilidades.filtrarIndiceConta(dados, numero_conta);
        
            if (indiceDeConta === -1) {
                return res.status(400).json({mensagem : 'conta informada nao existe'});
            };
    
            
            const deposito = { data : new Date(),
            ...req.body};
        
            dados.contas[indiceDeConta].saldo += valor;
        
            dados.depositos.push(deposito);
        
            let dadosAstring = JSON.stringify(dados);
                
            utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
            
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json({mensagem : error.message});
        };
    
    },
    
    async withdrawAccount(req, res) {
        try {
            const {numero_conta, valor, senha } = req.body;
            if(!numero_conta || !valor || !senha){
                return res.status(400).json({mensagem : 'Todos os campos devem ser informados'});
            };
            const indiceDaConta = utilidades.filtrarIndiceConta(dados, numero_conta);
            if(indiceDaConta === -1) {
                return res.status(400).json({mensagem : 'A conta informada nao existe por favor insira uma conta valida'})
            };
            if(valor <= 0) {
                return res.status(400).json({"mensagem": "O valor não pode ser menor que zero!"});
            };
            if(dados.contas[indiceDaConta].usuario.senha !== senha){
                return res.status(401).json({mensagem : 'Senha invalida por favor tente novamente'});
            };
    
            if(dados.contas[indiceDaConta].saldo < valor) {
                return res.status(400).json({mensagem: 'usuario nao tem saldo Suficiente para realizar o saque'});
            }
            
            const saque = { data : new Date(),
                numero_conta,
                valor};
            
            dados.contas[indiceDaConta].saldo -= valor;
            
            dados.saques.push(saque);
           
            let dadosAstring = JSON.stringify(dados);
                    
            utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
                
            return res.status(204).json();
            
        } catch (error) {
            return res.status(500).json({mensagem : error.message});
        };
    },
    
    async transferAccount(req, res) {
        try {
            const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    
            if(!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
                res.status(400).json({mensagem : 'Todos os campos sao obrigatorios para realizar a operacao'});
            };
    
            const indiceContaOrigem = utilidades.filtrarIndiceConta(dados, numero_conta_origem);
            const indiceContaDestino = utilidades.filtrarIndiceConta(dados, numero_conta_destino);
    
            if (indiceContaOrigem === -1){
                return res.status(400).json({mensagem : 'conta de origem informada nao existe'});
            };
    
            if (indiceContaDestino === -1){
                return res.status(400).json({mensagem : 'conta de Destino informada nao existe'});
            };
    
            if(dados.contas[indiceContaOrigem].usuario.senha !== senha){
                return res.status(400).json({mensagem : 'Senha invalida por favor tente novamente'});
            };
            
            if(dados.contas[indiceContaOrigem].saldo < valor) {
                return res.status(400).json({mensagem: 'usuario nao tem saldo Suficiente para realizar a transferencia'});
            };
    
            dados.contas[indiceContaOrigem].saldo -= valor;
            dados.contas[indiceContaDestino].saldo += valor;
    
            const transferencia = { data : new Date(), ...req.body};
    
            dados.transferencias.push(transferencia);
    
            let dadosAstring = JSON.stringify(dados);
                    
            utilidades.escreverArquivo('src/bancodedados.js', dadosAstring);
                
            return res.status(204).json();
    
        } catch (error) {
            return res.status(500).json({mensagem : error.message});
        };
    },
    
    async accountBalance(req, res) {
        try {
            const {numero_conta, senha} = req.query;
    
            if(!numero_conta || !senha){
                return res.status(400).json({mensagem : 'A senha e numero de conta deve ser informado'});
            };
    
            const indiceConta = utilidades.filtrarIndiceConta(dados, numero_conta);
    
            if(indiceConta === -1){
                return res.status(400).json({mensagem:'conta nao encontrada ou nao existe'});
            };
    
            if(dados.contas[indiceConta].usuario.senha !== senha){
                return res.status(403).json({mensagem : 'Senha invalida'});
            };
    
            return res.status(200).json(dados.contas[indiceConta].saldo);
    
    
        } catch (error) {
            return res.status(500).json({mensagem : error.message});
        };
    },
    
    async extractAccount(req, res) {
        try {
            const {numero_conta, senha} = req.query;
    
            if(!numero_conta || !senha){
                return res.status(400).json({mensagem : 'A senha e numero de conta deve ser informado'});
            };
    
            const indiceConta = utilidades.filtrarIndiceConta(dados, numero_conta);
    
            if(indiceConta === -1){
                return res.status(400).json({mensagem:'conta nao encontrada ou nao existe'});
            };
    
            if(dados.contas[indiceConta].usuario.senha !== senha){
                return res.status(403).json({mensagem : 'Senha invalida'});
            };
    
            const depositos = dados.depositos.filter((deposito) => {
                return deposito.numero_conta === numero_conta;
            });
            const saques = dados.saques.filter((saque) => {
                return saque.numero_conta === numero_conta;
            });
            const transferenciasEnviadas = dados.transferencias.filter((transferencia) => {
                return transferencia.numero_conta_origem === numero_conta;
            });
            const transferenciasRecebidas = dados.transferencias.filter((transferencia) => {
                return transferencia.numero_conta_destino === numero_conta;
            });
    
            return res.status(200).json({depositos, saques, transferenciasEnviadas, transferenciasRecebidas});
           
    
        } catch (error) {
            return res.status(500).json({mensagem : error.message});
        };
    
    }
};


module.exports = controllers;
