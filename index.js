const express = require('express')
const app = express()
const { IncomingForm } = require('formidable');
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const path = require('path')
const PDFImage = require("pdf-image").PDFImage;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

//get requests
app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/index.html');
})

app.get('/thumbs', (req, res) => {
    res.sendFile(__dirname + '/pdf.html');
})

app.get('/upload', (req, res) => {
    res.sendFile(__dirname+ '/pdf.html');
})

//delete request
app.delete('/clear', () => {
    clearDir();
})

//post requests
app.post('/upload', (req, res) => {
    const form = new IncomingForm();
    form.parse(req);
    form.on('file', (filename, file) => {
        var newPath = __dirname + '/tmp/' + file.name;
        console.log(newPath)
        fs.copy(file.path, newPath)
            .then(() => generateThumb(newPath, res));
    });
})

app.post('/pdf', (req, res) => {
    var filepath = __dirname + '/tmp/' + req.body.filename + '.pdf';
    generateThumb(filepath, res);
})

function generateThumb(filepath, res) {
    var pdfImage = new PDFImage(filepath);
    pdfImage.convertFile().then((imagePath) => {
        res.sendFile(imagePath);
    }, (err) => {
        res.send(err, 500);
    });
}

function clearDir() {
    var directory = __dirname + "/tmp"
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

app.listen(3000, (err) => {
    console.log('Server is on')
})