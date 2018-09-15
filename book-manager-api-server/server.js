'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

app.use(cors());
//app.use(morgan('tiny'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/bookmanager', { useNewUrlParser: true })
    .then(() => console.log('connected to database'))
    .catch((error) => console.log(err.message));

const bookSchema = mongoose.Schema({
    name: String,
    id: String,
    author: String,
    year: String
})

const userSchema = mongoose.Schema({
    username: String,
    fname: String,
    lname: String,
    email: String,
    password: String

})

const User = mongoose.model('User', userSchema);

const Book = mongoose.model('Book', bookSchema);

app.get('/books', (req, res) => {
    Book.find({}, (error, data) => {
        if (error) {
            return res.status(400).json(error)
        }

        res.json(data);

    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    Book.findById(id, (error, data) => {
        if (error) {
            return res.status(400).json(error)
        }

        res.json(data);

    })
})

app.post('/books', (req, res) => {
    const data = req.body;
    const book = new Book(data);
    book.save((error, data) => {
        if (error) {
            return res.status(400).json(error)
        }

        res.json(data);
    })
})

app.put('/books/:id', (req, res) => {
    const id = req.params.id;

    const data = req.body;
    Book.findOneAndUpdate({ '_id': id }, data, { new: true }, (error, data) => {
        if (error) {
            return res.status(400).json(error)
        }

        res.json(data);
    })
})

app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Book.findOneAndRemove({ '_id': id }, (error, data) => {
        if (error) {
            return res.status(400).json(error)
        }

        res.json(data);
    })
})

// user login api

app.post('/signup', (req, res) => {
    const data = req.body;
    const username = req.body.username;
    const users = new User(data);

    User.findOne({ username })
        .then((doc) => {
           
            if (!doc) {
                return users.save()
            }
            throw ("same user")
        })
        .then(() => {
            console.log("signup data saved")
        })
        .catch(error => {
            console.log(error)
        })


    res.status(200).json({ message: "signup form" })



    // User.findOne({ username }, (error, doc) => {
    //     if (error) {
    //         return res.status(400).json(error)
    //     }

    //     if (!doc) {
    //         users.save((error, result) => {
    //             if (error) {
    //                 return res.status(400).json({ message: "not save" })
    //             }

    //             res.json({ message: "success" })
    //         });
    //         // return;
    //     } else {
    //         res.status(400).json({ message: "already exist" })
    //     }
    // })

})


app.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({ username }, (error, doc) => {
        if (error) {
            return res.status(400).json(error)
        }

        if (!doc) {
            return res.status(400).json({ message: 'User Not Found' });
        }

        if (doc.password !== password) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        res.json({ userId: doc._id });

    })
})


app.listen(3000, () => {
    console.log('Server Started At 3000')
})