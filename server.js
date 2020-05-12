const express = require('express')
const bodyParsar = require('body-parser')
const cors = require('cors')
const serveIndex = require('serve-index');

const api = require('./routes/api')

const port = 5000

const app = express()

app.use(bodyParsar.json())
app.use(cors())

app.use('/api', api)
app.get('/', (req, res) => {
    res.send('hello from server')
})
app.use('/uploads',
    express.static('uploads'));
//app.use('/ftp', express.static('uploads'), serveIndex('uploads', { 'icons': true }));


app.listen(port, () => {
    console.log('server is running on port ' + port);

})