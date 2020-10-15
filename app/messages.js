const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
const fs = require('fs');
const {nanoid} = require('nanoid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', (req, res) => {
    const fileName = './messages/messages.txt';
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.error(err);
        }
        res.send(JSON.parse(data));
    });
});

router.post('/', upload.single("image"), (req, res) => {
    const message = req.body;
    if (message.text === '') {
        res.status(400).send({"error": "Message must be present in the request"});
    } else {
        if (req.file) {
            message.image = req.file.filename;
        }
        message.datetime = new Date().toJSON();
        message.id = nanoid();
        const fileName = './messages/messages.txt';
        fs.readFile(fileName, (err, data) => {
            if (err) {
                console.error(err);
            }
            let newData = (JSON.parse(data));
            newData.push(message);
            fs.writeFileSync(fileName, JSON.stringify(newData));
        });
        res.send(console.log('success'));
    }
});

module.exports = router;