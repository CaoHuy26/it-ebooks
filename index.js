const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/:category/:id', async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  const url = `http://www.allitebooks.org/${category}/page/${id}`;
  const data = await axios.get(url);
  if (data.status === 200) {
    const html = data.data;
    const $ = cheerio.load(html);
  
    const ebooks = [];
    $('article').each((i, element) => {
      const $element = $(element);
      const $title = $element.find('.entry-title a');
      const $image = $element.find('.attachment-post-thumbnail');
      const $description = $element.find('.entry-summary p');
      const authors = [];
      $(element).find('.entry-author a').each((i, element) => {
        author = $(element).text();
        authors.push(author);
      })
  
      const ebook = {
        title: $title.text(),
        image: $image.attr('src'),
        description: $description.text(),
        author: authors
      }
      ebooks.push(ebook);
    })
  
    res.json(ebooks);
  }
})

app.listen(3000, err => {
  if (err) {
    throw err;
  }
  console.log('App is listening on port 3000...')
})



