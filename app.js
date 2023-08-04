const express = require('express'); //construção de aplicativos web em Node.js
const app = express();
const db = require('./js/_database'); 
const cheerio = require('cheerio'); //biblioteca que permite fazer análise e manipulação de documentos HTML
const axios = require('axios'); //Fazer requisições HTTP em navegadores e em ambientes do Node.js

//Seta aonde esta a views desse back
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados uma vez no início do servidor
db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

app.get('/', (req, res) => {
  res.render('index', { resultados: [] }); // Inicialmente, envia um array vazio
});

//Seleciona o ação do html pelo metodo post
app.post('/executar', async (req, res) => {
  try {   
    //Dropa a tabela
    await db.query('DROP TABLE IF EXISTS quantidade_tags');
    //Cria a tabela
    await db.query(`CREATE TABLE quantidade_tags(
      idquantidade serial primary key,
      tag varchar(30),
      quantidade int
    )`);
    
    const { url } = req.body;
    const response = await axios.get(url);
    const htmlData = response.data;
    
    const $ = cheerio.load(htmlData);
    
    const tagCounts = {};//conta as tags
    const allTags = $('*');//pega todas as tags do ste
    
    //contar a frequência das tags HTML em um documento da web
    allTags.each((index, element) => {
      const tag = element.tagName.toLowerCase();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    //inseri as tags
    const queryTag = "INSERT INTO quantidade_tags (tag, quantidade) VALUES ($1, $2)";
    
    for (const tag in tagCounts) {
      await db.query(queryTag, [tag, tagCounts[tag]]);
    }
    
    //Seleciona as tags
    const queryResult = await db.query('SELECT * FROM quantidade_tags');
    
    //imprimi a query resultado no caso 
    res.render('index', { resultados: queryResult.rows }); 
  } catch (err) {
    console.error('Erro ao recuperar dados do banco de dados:', err);
    res.status(500).send('Erro ao recuperar dados do banco de dados');
  }
});

//Botao que fecha o banco de dados
app.post('/acabar', async (req, res) => {
  try {
    await db.end();
    console.log('Banco de dados fechado');
    res.send('Banco de dados fechado');
  } catch (err) {
    console.error('Erro ao fechar a conexão com o banco de dados:', err);
    res.status(500).send('Erro ao fechar a conexão com o banco de dados');
  }
});
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
