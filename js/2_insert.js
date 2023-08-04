const cheerio = require('cheerio');
const axios = require('axios');
const db = require('./_database');

async function insertValor(url) {
  try {
    await db.connect();

    // Faz a requisição para obter o conteúdo HTML do site
    const response = await axios.get(url);
    const htmlData = response.data;

    const $ = cheerio.load(htmlData);

    // Contagem das tags HTML
    const tagCounts = {};

    // Obtém todas as tags presentes no HTML
    const allTags = $('*');

    allTags.each((index, element) => {
      const tag = element.tagName.toLowerCase();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const queryTag = "INSERT INTO quantidade_tags (tag, quantidade) VALUES ($1, $2)";

    for (const tag in tagCounts) {
      await db.query(queryTag, [tag, tagCounts[tag]]);
    }

    await db.end();
    console.log("Dados Coletados");
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
}


const siteUrl = 'https://www.ic.ufmt.br'; 
insertValor(siteUrl);
