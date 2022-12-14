const bd = require('../bd.js');

const inclua = async (sugestoes) => {

    const conexao = await bd.getConexao();

    if (conexao === null)
        return null;

    try {
        const sql = 'INSERT INTO sugestoesTbl (sugestoesBairro) VALUES (?)';
        const dados = [sugestoes.sugestoesBairro];
        await conexao.query(sql, dados);

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

}

const recuperaTodos = async () => {

    const conexao = await bd.getConexao();

    if(conexao === null)
        return null;

    try{

        const sql = 'SELECT * FROM sugestoesTbl';
        const [linhas] = await conexao.query(sql);

        return linhas;

    } catch(error){
        console.log(error);
        return false;
    }
}

const recupera = async (id) => {
    const conexao = await bd.getConexao();

    if (conexao === null)
        return null;

    try {

        const sql = 'SELECT sugestoesBairro FROM sugestoesTbl WHERE id=?';
        const dados = [id];
        const [linhas] = await conexao.query(sql, dados);

        return linhas;

    } catch (error) {
        console.log(error);
        return false;
    }
}

const remove = async (id) => {
    const conexao = await bd.getConexao();

    if (conexao === null)
        return null;

    try {
        const sql = 'DELETE FROM sugestoesTbl WHERE id=?';
        const dados = [id];
        await conexao.query(sql, dados);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { inclua, remove, recuperaTodos, recupera }