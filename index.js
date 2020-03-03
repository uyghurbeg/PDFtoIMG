const express = require('express')
const app = express()
const formidable = require('formidable')
const bodyParser = require('body-parser')
const fs = require('fs-extra')

app.get('/', (req, res) => {
    res.sendFile(__dirname+ 'index.html');
})

app.post('/upload', (req, res) => {
    
})

app.listen(3000, (err) => {
    console.log('Server is on')
})