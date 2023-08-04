const db = require('./_database')

async function createTables(){
    await db.connect()

    await db.query('DROP TABLE quantidade_tags')

    await db.end()
    console.log('Tabela removidas');
}

createTables()