
//SET UP DEPENDENCIES

import express from 'express';
import { readPetsFile } from "./shared.js";
import { writePetsFile } from "./shared.js";

const app = express();
const PORT = 3030

//MIDDLEWARE MODULES
app.use(express.json());



//HANDLE REQUESTS WITH ROUTES
app.get('/pets', (req, res, next) => {
    readPetsFile().then(data => {
        res.send(JSON.stringify(data));
    }).catch(err => {
        console.error(err);
        next(err);
    });
});


app.get('/pets/:id', (req, res, next) => {
    readPetsFile().then(data => {
        const result = data[req.params.id];
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
    const newPet = req.body;
    readPetsFile()
        .then(data => {
            //const newPets = data.concat(newPet);
            data.push(newPet);
            console.log('newPets: ', data);
            writePetsFile(data);
            res.send(JSON.stringify(req.body));
        }).catch(err => {
            console.error(err);
            next(err);
        });
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

export { app };