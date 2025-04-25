const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Your NewsAPI key from https://newsapi.org/ (Set it in a .env file)
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Serve static files (CSS or client-side JS) from the "public" folder if needed
app.use(express.static('public'));

// Root route with a form for user input
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>News Fetcher</title>
    </head>
    <body>
      <h1>Fetch Latest News</h1>
      <form action="/news" method="get">
        <label for="query">Keyword:</label>
        <input type="text" id="query" name="query" required>
        <br>
        <label for="country">Country (optional, e.g., us, in):</label>
        <input type="text" id="country" name="country">
        <br>
        <label for="category">Category (optional, e.g., business, sports):</label>
        <input type="text" id="category" name="category">
        <br><br>
        <button type="submit">Get News</button>
      </form>
    </body>
    </html>
  `);
});

// Fetch news based on user input
app.get('/news', async (req, res) => {
  const { query, country, category } = req.query;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        q: query,
        country: country || undefined,
        category: category || undefined,
        apiKey: NEWS_API_KEY,
        pageSize: 5, // Limit to 5 articles
      },
    });

    const articles = response.data.articles;

    if (articles.length > 0) {
      let htmlOutput = `<h1>Top 5 News Articles</h1><ul>`;
      articles.forEach((article) => {
        htmlOutput += `
          <li>
            <h2>${article.title}</h2>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </li>
          <hr>
        `;
      });
      htmlOutput += '</ul><a href="/">Back to search</a>';
      res.send(htmlOutput);
    } else {
      res.send('<h1>No articles found.</h1><a href="/">Back to search</a>');
    }
  } catch (error) {
    console.error(error);
    res.send('<h1>Error fetching news. Please try again later.</h1><a href="/">Back to search</a>');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
