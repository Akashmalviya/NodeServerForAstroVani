const express = require('express')
const formidable = require('formidable')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const User = require('../models/user')
const event = require('../models/event')
const url = "mongodb://localhost:27017/event"
const Sevent = require('../models/specialEvent')
const Blogs = require('../models/blog')
const bodyparsar = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: '4b71dccf',
    apiSecret: 'CYVgFXHCeZjW1Hxm'
}, { debug: true });

mongoose.connect(url, (err) => {
    if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    } else {
        console.log('connect to mongodb');

    }

})
router.use(bodyparsar.urlencoded({ extended: true }));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'key')
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}
router.post('/getEnq', (req, res) => {
    const from = '';
    const to = '917000124052';
    data = JSON.stringify(req.body)

    nexmo.message.sendSms(from, to, data);
    res.send({ massage: 'send' })
})

router.post('/addBlog', upload.single('image'), (req, res) => {
    var stringify = JSON.stringify(req.body)
    var blogData = JSON.parse(stringify);
    console.log(blogData);
    console.log("hello");
    res.send({
        massage: "hello"
    })
    var img = fs.readFileSync(req.file.path);
    var encode = img.toString('base64')
    var url = 'http://localhost:5000/';
    var path = url.concat(req.file.path)
    var finalImg = {

        path: url + req.file.path,

    }



    Blogs.create({
        title: blogData.title,
        publishdate: blogData.publishdate,
        excert: blogData.excert,
        author: blogData.author,
        image: path
    }, function(error, data) {
        if (error) {
            console.log("There was a problem adding this game to the database");
        } else {
            console.log("Game added to database");
            console.log(data);
        }

    });




})
router.get("/list", function(req, res) {

    Blogs.find({}, null, { sort: { publishdate: -1 } },
        function(error, data) {
            if (error) {
                console.log("There was a problem retrieving all of the data from the database.");
                console.log(error);
            } else {
                var url = 'http://localhost:5000/';
                data.image = url.concat(data.image)
                res.json(data)
            }
        });

});
router.get('/list/:id', function(req, res) {
    Blogs.findById(req.params.id, function(err, doc) {

        res.send(doc);
    })



})


router.delete('/delete/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Blogs.findByIdAndRemove(id).then((docs) => {
        res.status(200).send({
            docs
        })
    }).catch((e) => {
        res.status(400)
    });
});



router.get('/', (req, res) => {
    res.send("from api route")
})
router.post('/register', (req, res) => {
    let userData = req.body
    User.findOne({ email: userData.email }, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        } else {
            if (user) {
                res.status(401).send({ massage: "this email is used try another" })

            } else {
                let user = new User(userData)
                user.save((err, regisetetdUser) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    } else {
                        let payLoad = { subject: user._id }
                        let token = jwt.sign(payLoad, 'key')
                        res.status(200).send({ token })
                    }
                })

            }
        }
    })

})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({ email: userData.email }, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        } else {
            if (!user) {
                res.status(404).send('invalid email')

            } else {

                if (!bcrypt.compareSync(userData.password, user.password)) {
                    res.status(401).send('worng passsword')
                } else {
                    let payLoad = { subject: user._id }
                    let token = jwt.sign(payLoad, 'key')
                    res.status(200).send({ token })
                }

            }

        }
    })
})







module.exports = router