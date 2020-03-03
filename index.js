const express = require('express')
const app = express()
const { IncomingForm } = require('formidable');
const bodyParser = require('body-parser')
const fs = require('fs-extra')
var PDFImage = require("pdf-image").PDFImage;

app.use(bodyParser.urlencoded({ extended: false }));


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
        var pdfImage = new PDFImage(file.path);
        pdfImage.convertPage(0).then(function (imagePath) {
        res.sendFile(imagePath)
        });
    });
})

app.get('/pdf', (req, res) => {
   res.sendFile(__dirname + "/pdf.html")
})

app.post('/pdf', (req, res) => {
    var pdfImage = new PDFImage(__dirname + "/tmp/" + req.body.filename + ".pdf");
    pdfImage.convertPage(0).then(function (imagePath) {
    res.sendFile(imagePath)
    });
})

app.listen(3000, (err) => {
    console.log('Server is on')
})