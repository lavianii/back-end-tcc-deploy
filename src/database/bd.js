const getConexao = async () => {

    if (global.conexao && global.conexao.state !== 'disconnected')
        return global.conexao;

    const mysql = require('mysql2/promise');
    const bdConfig = require('./bdConfig');

    try {
        const conexao = await mysql.createConnection(bdConfig);
        global.conexao = conexao;
        return conexao;

    } catch (error) {
        return null;
    }

}

async function criaTabela() {

    const conexao = await getConexao();

    if (conexao === undefined)
        return null;

    sqlUsuario = 'CREATE TABLE IF NOT EXISTS usuario(id INT not null AUTO_INCREMENT, nome VARCHAR(60)NOT NULL, senha VARCHAR(20) NOT NULL, email VARCHAR(60), PRIMARY KEY (id));';
    
    sqlCrimes = 'CREATE TABLE IF NOT EXISTS crimes(id INT not null AUTO_INCREMENT, bairro VARCHAR(60)NOT NULL, tipoCrime VARCHAR(60) NOT NULL, qtd INT NOT NULL DEFAULT 1, PRIMARY KEY (id));';

  sqlSugestoes = 'CREATE TABLE IF NOT EXISTS sugestoesTbl (id int not null AUTO_INCREMENT, sugestoesBairro VARCHAR(60)not null, PRIMARY KEY (id))'

    try {
      await conexao.query(sqlUsuario);
      await conexao.query(sqlCrimes);
      await conexao.query(sqlSugestoes);
      return true;
      
    } catch (error) {

        return false;
    }
}

module.exports = { getConexao, criaTabela }