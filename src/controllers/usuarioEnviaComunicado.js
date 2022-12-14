const comunicado = require('../models/comunicado');
const usuario = require('../models/usuario');
const usuarioDBO = require('../database/dbo/usuarioDBO')


const inclusao = async (req, res) => {

    if (Object.values(req.body).length < 3 || !req.body.nome || !req.body.senha || !req.body.email) {

        const erro = comunicado.novoComunicado('Ddi', 'Dados inesperados', 'Não foram fornecidos as informações esperadas').object;

        return res.status(422).json(erro);
    }

    let novoUsuario;
    try {
        novoUsuario = usuario.novoUsuario(req.body.id, req.body.nome, req.body.senha, req.body.email);
    }
    catch (error) {
        const erro = comunicado.novoComunicado('TDE', 'Dados de tipos errados', 'Dados fornecidos incorretos').object;
        return res.status(422).json(erro);
    }

    const ret = await usuarioDBO.inclua(novoUsuario);

    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;

        return res.status(500).json(erro);
    }

    if (ret === false) {
        const erro = comunicado.novoComunicado('USE', 'Usuario já existe', 'Já existe um Usuario com esse id').object;
        return res.status(409).json(erro);
    }

    const sucesso = comunicado.novoComunicado('IBS', 'Inclusao bem sucedida', 'Incluido com sucesso').object;
    return res.status(201).json(sucesso);
}

const recupera = async (req, res) => {

    if (Object.values(req.body).length != 0) {
        const erro = comunicado.novo('DSP', 'Fornecimento de dados sem proposito', 'Foram fornecidos dados desnecessarios').object;
        return res.status(422).json(erro);
    }

    const id = req.params.id;
    const ret = await usuarioDBO.recupera(id);


    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;
        return res.status(500).json(erro);

    } else if (ret === false) {
        const erro = comunicado.novoComunicado('FNC', 'Falha no comando de SQL', 'O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);

    } else if (ret.length === 0) {
        const erro = comunicado.novoComunicado('UNE', 'Usuario inexistente', 'Não há Usuario cadastrado com esse id').object;
        return res.status(404).json(erro);

    } else {
        return res.status(200).json(ret);
    }
}

const remove = async (req, res) => {

    if (Object.values(req.body).length !== 0) {
        const erro = comunicado.novoComunicado('DSP', 'Fornecimento de dados sem proposito', 'Foram fornecidos dados desnecessarios').object;
        return res.status(422).json(erro);
    }

    const id = req.params.id;
    let ret = await usuarioDBO.recupera(id);

    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;
        return res.status(500).json(erro);
    }
    else if (ret === false) {
        const erro = comunicado.novoComunicado('FNC', 'Falha no comando de SQL', 'O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);
    }

    else if (ret.length == 0) {
        const erro = comunicado.novoComunicado('UNE', 'Usuario inexistente', 'Não há usuario cadastrado com esse id').object;
        return res.status(404).json(erro);
    } else {

        ret = await usuarioDBO.remove(id);
    }

    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;
        return res.status(500).json(erro);
    }

    else if (ret === false) {
        const erro = comunicado.novoComunicado('FNC', 'Falha no comando de SQL', 'O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);
    } else {

        const sucesso = comunicado.novoComunicado('RBS', 'Remoçao bem sucedida', 'O usuario removido com sucesso').object;
        return res.status(201).json(sucesso);
    }
}

const atualiza = async (req, res) => {
    if (Object.values(req.body).length < 3 || !req.body.nome || !req.body.senha || !req.body.email) {

        const erro = comunicado.novoComunicado('Ddi', 'Dados inesperados', 'Não foram fornecidos as informações esperadas').object;

        return res.status(422).json(erro);
    }

    let novosDados;
    try {
        novosDados = usuario.novoUsuario(req.body.id, req.body.nome, req.body.senha, req.body.email);
    }
    catch (error) {
        const erro = comunicado.novoComunicado('TDE', 'Dados de tipos errados', 'Dados fornecidos incorretos').object;
        return res.status(422).json(erro);
    }

    const id = req.params.id;
    let ret = await usuarioDBO.recupera(id);

    if(ret === false){
        const erro = comunicado.novoComunicado('FNC','Falha no comando de SQL','O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);

    }else if(ret.length === 0){
        const erro =  comunicado.novoComunicado('UNE','Usuario inexistente','Não há uma usuario cadastrado com esse id').object; 
        return res.status(404).json(erro);
    }

    ret = await usuarioDBO.atualiza(novosDados);

    if(ret === null){
        const erro = comunicado.novoComunicado('CBD','Sem conexao com o BD','Não foi possivel estabelecer conexao com o banco de dados').object; 
        console.log(ret);
        return res.status(500).json(erro);
    
    }else if(ret === false){
        const erro =  comunicado.novoComunicado('FNC','Falha de comando de SQL','O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);
    }else{
        const sucesso = comunicado.novoComunicado('ABS','Atualizaçao bem sucedida','A pessoa foi Atualizada com sucesso').object; 
        return res.status(201).json(sucesso); 
    }
}

const recuperaTodos = async (req, res) => {

    if(Object.values(req.body).length != 0){
        const erro = comunicado.novo('DSP', 'Fornecimento de dados sem proposito', 'Foram fornecidos dados desnecessarios').object;
        
        return res.status(422).json(erro);
    } 

    const ret = await usuarioDBO.recuperaTodos();

    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;
        return res.status(500).json(erro);

    } else if (ret === false) {
        const erro = comunicado.novoComunicado('FNC', 'Falha no comando de SQL', 'O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);

    } else if (ret.length === 0) {
        const erro = comunicado.novoComunicado('UNE', 'Usuario inexistente', 'Não há Usuario cadastrado com esse id').object;
        return res.status(404).json(erro);

    } else {
        return res.status(200).json(ret);
    }
}

const login = async (req, res) => {

  if(Object.values(req.body).length > 2 || !req.params.email || !req.params.senha){
    const erro = comunicado.novo('DSP', 'Fornecimento de dados sem proposito', 'Foram fornecidos dados desnecessarios').object;        
    return res.status(422).json(erro);
    }

    const login = req.params
    const ret = await usuarioDBO.login(login);

    if (ret === null) {
        const erro = comunicado.novoComunicado('CBD', 'Sem conexao com o BD', 'Não foi possivel estabelecer conexao com o banco de dados').object;
        return res.status(500).json(erro);

    } else if (ret === false) {
        const erro = comunicado.novoComunicado('FNC', 'Falha no comando de SQL', 'O comando de SQL apresenta algum erro').object;
        return res.status(409).json(erro);

    } else if (ret.length === 0) {
        const erro = comunicado.novoComunicado('UNE', 'Usuario inexistente', 'Não há Usuario cadastrado com esse id').object;
        return res.status(404).json(erro);

    } else {
        return res.status(200).json(ret);
    }
}

module.exports = { inclusao, recupera, remove, atualiza, recuperaTodos, login }