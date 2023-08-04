const db = require('./_database');

async function selectValor(){
    await db.connect()  
    var resultado

    resultado = await db.query("SELECT tag, quantidade FROM quantidade_tags")
    console.log("Resultado:")
    console.log(resultado.rows);    

    await db.end()
}

selectValor()