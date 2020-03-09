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
    res.sendFile(__dirname+ '/upload.html');
})

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname+ '/pdf.html');
})

app.get('/files', (req, res) => {
    readDir()
    res.sendFile(__dirname + '/files.html');
})

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
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
        var desFile = __dirname + '/tmp/' + path.basename(imagePath);
        fs.copy(imagePath, desFile)
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

function readDir() {
    var directory = __dirname + "/tmp"
    fs.readdir(directory, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        var html
        var htmlHead = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><table>'
        var htmlFoot = '</tr></table></body></html>'
        var htmlBody = ''
        files.forEach( (file) => {
            htmlBody += '<tr><td><a href="./' + file +'">'  + file + '</a></td></tr>'
        })

        html = htmlHead + htmlBody + htmlFoot;
        fs.writeFileSync('files.html', html, () => {
            console.log('hello')
        })
    })
}
        
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
  
    err.status = 404;
    next(err);
  });
  
  //error handlers
  
  //development error handler
  //will print stacktrace
  if (app.get("env") === "development") {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: err
      });
    });
  }
  
  //production error handler
  //no stacktraces leaked to user
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {}
    });
  });

  module.exports = app;