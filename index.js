const express = require('express')
const app = express()
const formidable = require('formidable')
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const path = require('path')
var PDFImage = require("pdf-image").PDFImage

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
    var form = new formidable.IncomingForm()
    form.parse(req);
    form.on('file', (filename, file) => {
        var newPath = __dirname + '/tmp/' + file.name;
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
    pdfImage.convertPage(0)
        .then((imagePath) => {
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
    })
}

app.listen(3000, (err) => {
    console.log('Server is on')
})