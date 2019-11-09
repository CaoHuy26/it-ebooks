const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(express.urlencoded());

// Search
app.post('/search', async (req, res) => {
  const { name } = req.body
  const url = `http://www.allitebooks.org/?s=${name}`;

  try {
    const data = await axios.get(url);
    const html = data.data;
  
    const $ = cheerio.load(html);
    const ebooks = [];
    $('article').each((i, e) => {
      const $article = $(e);
      const $image = $article.find('.entry-thumbnail img').attr('src');
      const $title = $article.find('.entry-title a').text();
      const $link = $article.find('.entry-title a').attr('href');
      const $description = $article.find('.entry-summary p').text();
      const $authors = [];
      $article.find('.entry-author a').each((i, e) => {
        const author = {
          name: $(e).text(),
          link: $(e).attr('href')
        }
  
        $authors.push(author);
      })
  
      const ebook = {
        image: $image,
        title: $title,
        link: $link,
        description: $description,
        author: $authors
      }
  
      ebooks.push(ebook);
    });
  
    res.status(200).json(ebooks);
  }
  catch (ex) {
    res.status(404).json('Not found');
  }
  
});

// Index
app.get('/page/:id', async (req, res) => {
  const id = req.params.id;
  const url = `http://www.allitebooks.org/page/${id}`;
  try {
    const data = await axios.get(url);
    const html = data.data;
  
    const $ = cheerio.load(html);
    const ebooks = [];
    $('article').each((i, e) => {
      const $article = $(e);
      const $image = $article.find('.entry-thumbnail img').attr('src');
      const $title = $article.find('.entry-title a').text();
      const $link = $article.find('.entry-title a').attr('href');
      const $description = $article.find('.entry-summary p').text();
      const $authors = [];
      $article.find('.entry-author a').each((i, e) => {
        const author = {
          name: $(e).text(),
          link: $(e).attr('href')
        }
  
        $authors.push(author);
      })
  
      const ebook = {
        image: $image,
        title: $title,
        link: $link,
        description: $description,
        author: $authors
      }
  
      ebooks.push(ebook);
    });
  
    res.status(200).json(ebooks);
  }
  catch (ex) {
    res.status(404).json('Not found')
  }
  
});

// get all book of author
app.get('/author/:nameOfAuthor', async (req, res) => {
  const nameOfAuthor = req.params.nameOfAuthor;
  const url = `http://www.allitebooks.org/author/${nameOfAuthor}`;
  try {
    const data = await axios.get(url);
    const html = data.data;
  
    const $ = cheerio.load(html);
    const ebooks = [];
    $('article').each((i, e) => {
      const $article = $(e);
      const $image = $article.find('.entry-thumbnail img').attr('src');
      const $title = $article.find('.entry-title a').text();
      const $link = $article.find('.entry-title a').attr('href');
      const $description = $article.find('.entry-summary p').text();
      const $authors = [];
      $article.find('.entry-author a').each((i, e) => {
        const author = {
          name: $(e).text(),
          link: $(e).attr('href')
        }
  
        $authors.push(author);
      })
  
      const ebook = {
        image: $image,
        title: $title,
        link: $link,
        description: $description,
        author: $authors
      }
  
      ebooks.push(ebook);
    });
  
    res.status(200).json(ebooks);
  }
  catch (ex) {
    res.status(404).json('Not found');
  }
});

// Get detail book
app.get('/book/:nameOfBook', async (req, res) => {
  const nameOfBook = req.params.nameOfBook;

  const url = `http://www.allitebooks.org/${nameOfBook}`;
  try {
    const data = await axios.get(url);
    const html = data.data;
  
    const $ = cheerio.load(html);
    const $element = $('article');
    const $name = $element.find('.entry-header h1').text();
    const $title = $element.find('.entry-header h4').text();
    const $image = $element.find('.entry-body-thumbnail img').attr('src');
    const $linkDownload = $element.find('.download-links a').attr('href');
  
    const $details = [];
    $('.book-detail').find('dd').each((i, e) => {
      $details.push($(e).text());
    })
    const $detail = {
      author: $details[0],
      ISBN_10: $details[1],
      year: $details[2],
      pages: $details[3],
      language: $details[4],
      fileSize: $details[5],
      fileFormate: $details[6],
      category: $details[7]
    }

    const $descriptions = [];
    $('.entry-content').find('p').each((i, e) => {
      if (!$(e).text()) {
        $descriptions.push($('.entry-content').find('div').eq(i).text());
      }
      else {
        $descriptions.push($(e).text());
      }
      
    })
  
    // you can learn
    const $benefits = [];
    $('.entry-content').find('li').each((i, e) => {
      $benefits.push($(e).text());
    })
  
    const $relatedBooks = [];
    $('.wp_rp_content').find('li').each((i, e) => {
      const relatedBook = {
        'name': $(e).find('.wp_rp_title').text(),
        'link': $(e).find('.wp_rp_thumbnail').attr('href'),
        'image': $(e).find('.wp_rp_thumbnail img').attr('src')
      } ;
      $relatedBooks.push(relatedBook)
    })
    
    const ebook = {
      name: $name,
      title: $title,
      image: $image,
      linkDownload: $linkDownload,
      detail: $detail,
      description: $descriptions,
      benefit: $benefits,
      relatedBook: $relatedBooks,
    }
  
    res.status(200).json(ebook);
  }
  catch(ex) {
      res.status(404).json('Not found');
  }
  
})

// Get book by categoryname
app.get('/:category/:id', async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;
  const url = `http://www.allitebooks.org/${category}/page/${id}`;
  try {
    const data = await axios.get(url);
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
  
    res.status(200).json(ebooks);  
  }
  catch (ex) {
    res.status(404).json('Not found');
  }
  
})

app.listen(3000, err => {
  if (err) {
    throw err;
  }
  console.log('App is listening on port 3000...')
})



