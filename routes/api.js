const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Log the API keys to ensure they are loaded correctly
console.log('OpenRouter API Key:', process.env.OPENROUTER_API_KEY);
console.log('YouTube API Key:', process.env.YOUTUBE_API_KEY);

// Endpoint to fetch career predictions
router.post('/career-predictions', async (req, res) => {
    const { name, education, skills, interests } = req.body;

    const prompt = `Based on the following details, provide a detailed career suggestion for ${name} with the following structure:
    - Career Title:
    - Job Description:
    - Required Skills:
    - Potential Industries:
    - Career Growth Opportunities:
    - Education: ${education}
    - Skills: ${skills.join(', ')}
    - Interests: ${interests.join(', ')}`;

    try {
        console.log('Making request to OpenRouter API...');
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch career prediction.');
        }

        const data = await response.json();
        console.log('Career prediction data:', data);
        res.json({ prediction: data.choices[0].message.content });
    } catch (error) {
        console.error('Error fetching career prediction:', error);
        res.status(500).json({ error: 'Failed to fetch career prediction' });
    }
});

// Endpoint to fetch YouTube videos
router.get('/youtube-videos', async (req, res) => {
    const { query } = req.query;

    try {
        console.log('Making request to YouTube API...');
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${process.env.YOUTUBE_API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch YouTube videos.');
        }

        const data = await response.json();
        console.log('YouTube videos data:', data);
        res.json(data.items);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube videos' });
    }
});

// Endpoint to fetch course recommendations
router.post('/course-recommendations', async (req, res) => {
    const { skills, interests } = req.body;

    const prompt = `Based on the following skills and interests, recommend some courses:
    - Skills: ${skills.join(', ')}
    - Interests: ${interests.join(', ')}`;

    try {
        console.log('Making request to OpenRouter API for course recommendations...');
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch course recommendations.');
        }

        const data = await response.json();
        console.log('Course recommendations data:', data);
        res.json({ recommendations: data.choices[0].message.content });
    } catch (error) {
        console.error('Error fetching course recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch course recommendations' });
    }
});

module.exports = router;
