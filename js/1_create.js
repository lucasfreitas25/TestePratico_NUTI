//Pega as config da base
const db = require('./_database')
//Função que cria as tabelas
async function createTables(){
    //conecta com banco
    await db.connect()

    //Passa a query a ser executada
    await db.query(`CREATE TABLE quantidade_tags(
        idquantidade serial primary key,
        tag varchar(30),
        quantidade int
    )`)
    
    //Fecha o banco
    await db.end()
    console.log('Tabela Criadas');
}

createTables()