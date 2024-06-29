const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { Pool } = require('pg');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios')

const app = express();
const upload = multer({ dest: 'uploads/' });
const pool = new Pool({ connectionString: 'postgres://postgres:1234@localhost:5432/postgres' });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    try {
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);
            await pool.query('INSERT INTO documents (content) VALUES ($1)', [data.text]);
        } else if (file.mimetype.startsWith('image/')) {
            const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
            await pool.query('INSERT INTO documents (content) VALUES ($1)', [text]);
        }
        res.send('File uploaded and processed');
    } catch (error) {
        res.status(500).send('Error processing file');
    }
});

app.post('/query', async (req, res) => {
    const { question } = req.body;
    try {
        const result = await pool.query('SELECT content FROM documents');
        const context = result.rows.map(row => row.content).join(' ');
        const response = await axios.post('http://127.0.0.1:5000/answer', { context, question }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(question)
        res.send(response.data);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error processing query');
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
