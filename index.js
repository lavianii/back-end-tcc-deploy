// npm i express mysql2 dotenv nodemon


const bd = require('./src/database/bd');
const express = require('express');
const app = express();


//ter acesso as funcoes
const rotas = require('./src/controllers/usuarioEnviaComunicado');
const rotasCrime = require('./src/controllers/crimeEnviaComunicado');
const rotasSugestao = require('./src/controllers/sugestaoEnviaComunicado');

function middleWareGlobal(req, res, next) {
    console.time('Duraçao');
    console.log(req.url);

    next();

    console.log(req.url);
    console.timeEnd('Duraçao');
}

// ativa o servidor com o banco
const servidor = async () => {

    const ret = await bd.criaTabela();

    if (ret === null) {
        console.log('Não estabeleceu a conexao com o BD');
        console.log(ret);
        process.exit(1);
    }
    if (ret === false) {
        console.log('Não foi possivel CRIAR A TABELA');
        console.log(ret);
        process.exit(1)
    }

    app.use(express.json());
    app.use(middleWareGlobal);

    //evitar erro de cors
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    //rotas do usuario
    app.post('/incluir', rotas.inclusao);
    app.get('/recupera/:id', rotas.recupera);
    app.get('/recuperaTodos', rotas.recuperaTodos);
    app.get('/login/:email/:senha', rotas.login);
    app.delete('/remove/:id', rotas.remove);
    app.put('/atualiza/:id', rotas.atualiza);

    //rotas do crime
    app.post('/incluirCrime', rotasCrime.incluaCrime);
    app.get('/recuperaCrime/:id', rotasCrime.recuperaCrime);
    app.get('/recuperaBairro', rotasCrime.recuperaBairro);
    app.delete('/removeCrime/:id', rotasCrime.removeCrime);
    app.put('/atualizaCrime/:id', rotasCrime.atualizaCrime);
    app.put('/atualizaQtdCrimes/:id', rotasCrime.atualizaQtdCrimes);

    //rotas sugestao
    app.post('/incluirSugestao', rotasSugestao.inclusao);
    app.get('/recuperaSugestao', rotasSugestao.recuperaTodos);
    app.get('/recuperaSugestao/:id', rotasSugestao.recupera);
    app.delete('/deletarSugestao/:id', rotasSugestao.remove);

    app.get('/', (req, res) => {
        res.send('Conectado');
    })
    console.log('Conectado na porta 3001');
    app.listen(3001)
}
servidor();