//SET UP DEPENDENCIES

import bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { readPetsFile } from "./shared.js";
import { writePetsFile } from "./shared.js";

const app = express();
const PORT = 4000

//MIDDLEWARE MODULES
app.use(bodyParser.json());
app.use(morgan('tiny'));



//HANDLE REQUESTS WITH ROUTES

//POST---CREATE NEW PET
app.post('/pets', (req, res, next) => {
    const newPet = req.body;
    if (!(newPet['name'] || newPet['kind'] || newPet['age']) || !parseInt(newPet['age'])) {
        console.log("ERROR ERROR BAD REQUEST")
        next({ status: 400, statusMessage: "Bad Request" })
    }
    readPetsFile()
        .then(data => {
            //const newPets = data.concat(newPet);
            data.push(newPet);
            writePetsFile(data);
            res.send(JSON.stringify(req.body));
        }).catch(err => {
            console.error(err);
        });
});

//GET
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

//PATCH
app.patch('/pets/:id', (req, res) => {
    const updatePet = req.body;

    readPetsFile()
        .then(data => {
            //const newPets = data.concat(newPet);
            const result = data[req.params.id];
            if (updatePet["name"]) {
                result["name"] = updatePet["name"];
                console.log(result["name"]);
                data[req.params.id] = result;
            }
            if (parseInt(updatePet['age'])) {
                console.log(typeof (updatePet['age']));
                result["age"] = updatePet["age"];
                console.log(result["age"]);
                data[req.params.id] = result;
            }
            if (updatePet["kind"]) {
                result["kind"] = updatePet["kind"];
                console.log(result["kind"]);
                data[req.params.id] = result;
            }
            writePetsFile(data);
            res.send(JSON.stringify(result));
        }).catch(err => {
            console.error(err);
            next(err);
        });
})

//DELETE
app.delete('/pets/:id', (req, res, next) => {
    readPetsFile().then(data => {
        const result = data[req.params.id];
        if (result) {
            data.splice(req.params.id, 1);
            writePetsFile(data);
            res.send(JSON.stringify(result));
        } else {
            next({ status: 404, statusMessage: "Not Found" })
        }
    }).catch(err => {
        next(err);
    });
});

//GET
app.get('/pets', (req, res, next) => {
    readPetsFile().then(data => {
        res.send(JSON.stringify(data));
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
});