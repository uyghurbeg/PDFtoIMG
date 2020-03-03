const express = require('express')
const app = express()
const { IncomingForm } = require('formidable');
const bodyParser = require('body-parser')
const fs = require('fs-extra')
var PDFImage = require("pdf-image").PDFImage;

app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/index.html');
})

app.get('/upload', (req, res) => {
    res.sendFile(__dirname+ '/index.html');
})

app.post('/upload', (req, res) => {
    const form = new IncomingForm();
 
    form.parse(req);
     
    form.on('file', (filename, file) => {
        fs.copyFile(file.path, '/Users/mac/Downloads/PDFtoIMG/tmp')
    });
})

app.listen(3000, (err) => {
    console.log('Server is on')
})