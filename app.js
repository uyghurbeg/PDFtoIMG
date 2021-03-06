const express = require('express')
const app = express()
const formidable = require('formidable')
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const path = require('path')
var PDFImage = require("pdf-image").PDFImage
const pdf = require('pdf-poppler');
const downloadsFolder = require('downloads-folder');


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

//get requests
app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/upload.html');
})

app.get('/files', (req, res) => {
    readDir()
    res.sendFile(__dirname + '/files.html');
})

app.get('/upload', (req, res) => {
    res.sendFile(__dirname+ '/upload.html');
})


//delete request
app.delete('/clear', () => {
    clearDir();
})

//post requests
app.post('/upload', (req, res) => {
    console.log('upload begin')
    var form = new formidable.IncomingForm()
    form.parse(req);
    form.on('file', (filename, file) => {
        generateThumb(file.path, res)
    });
})


app.post('/pdf', (req, res) => {
    var filepath = __dirname + '/tmp/' + req.body.filename + '.pdf';
    generateThumb(filepath, res);
})

function generateThumb(file, res) {
    console.log('Thumb function ready')
    var downloadFolder = downloadsFolder();
    var isWindows = process.platform === "win32";
    if (isWindows) {
        console.log('I am win')
        let opts = {
            format: 'jpeg',
            out_dir: downloadFolder,
            out_prefix: path.basename(file, path.extname(file)),
            page: 1
        }

        pdf.convert(file, opts)
            .then(() => {
                console.log('I started convert thumb')
                var thumbPath = opts.out_dir + "/" + opts.out_prefix + "-1.jpg";
                fs.access(thumbPath, fs.F_OK, (err) => {
                    console.log("first err :" + err)
                    if (err) {
                    console.log("second err :" + err)
                        thumbPath = opts.out_dir + "/" + opts.out_prefix + "-01.jpg";
                        res.sendFile(thumbPath)
                    } else res.sendFile(thumbPath)
                })
            })
            .catch(error => {
                console.log('thum failed')
                console.error(error);
            })
    } else {
        var pdfImage = new PDFImage(file);
        pdfImage.convertPage(0)
            .then((imagePath) => {
                var desFile = downloadFolder + '/' + path.basename(imagePath);
                fs.copy(imagePath, desFile)
                res.sendFile(imagePath);
            }, (err) => {
                res.send(err, 500);
        });
    }
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
