
//SET UP DEPENDENCIES

import express from 'express';
import { readFile } from "fs/promises";
const app = express();
const PORT = 3030

//MIDDLEWARE MODULES
app.use(express.json());



//HANDLE REQUESTS WITH ROUTES
app.get('/pets', (req, res, next) => {
    readFile("../fs-pet-shop/pets.json", "utf-8").then(str => {
        const data = JSON.parse(str);
        res.send(data);
    }).catch(err => {
        next(err);
    });
});


app.get('/pets/:id', (req, res, next) => {
    readFile("../fs-pet-shop/pets.json", "utf-8").then(str => {
        const data = JSON.parse(str);
        const result = data[req.params.id];
        console.log(result);
        if (result) {
            res.send(result);
        } else {
            next({ status: 404, statusMessage: "ID not in range" })
        }
    }).catch(err => {
        next(err);
    });
});


app.get('/pets/:id/:name', (req, res) => {
    res.send(req.params);
});


app.post('/pets/post', (req, res) => {
    // console.log(req);
    res.send(req.body);
});

//LISTEN ON A PORT
app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`);
});




//ERROR HANDLERS
app.use((req, res, next) => {
    console.log('This is my catchall handler');
    next({ status: 504, statusMessage: 'Catchall - NOT FOUND. FIX YOURSELF' });
});

app.use((err, req, res, next) => {
    console.log('This is my custom error handler');
    res.status(err.status)
    res.send(err.statusMessage);
    //res.render('error', { error: err })
})