require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', async (req, res) => {
    try {
        const { query, type } = req.query;
        let endpoint = '';
        let params = {
            apiKey: API_KEY,
            language: 'en'
        };

        if (type === 'keyword') {
            endpoint = '/everything';
            params.q = query;
        } else if (type === 'category') {
            endpoint = '/top-headlines';
            params.category = query;
        }

        const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
        res.render('results', {
            articles: response.data.articles,
            searchQuery: query,
            searchType: type,
            error: null
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.render('results', {
            articles: [],
            searchQuery: req.query.query,
            searchType: req.query.type,
            error: 'Failed to fetch news articles. Please try again later.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});