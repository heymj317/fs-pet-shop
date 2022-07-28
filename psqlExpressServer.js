// //SET UP DEPENDENCIES

import bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { readPetsFile } from "./shared.js";
import { writePetsFile } from "./shared.js";
import pg from "pg";
//import sql from "./shared.js";


const app = express();
const PORT = 4000
const pool = new pg.Pool({
    // user: 'dbuser',
    // host: 'database.server.com',
    database: 'petshop',
    // password: 'secretpassword',
    // port: 3211,
});


//MIDDLEWARE MODULES
app.use(express.json());
app.use(morgan('tiny'));

//How do we read http hea

//HANDLE REQUESTS WITH ROUTES

//POST---CREATE NEW PET
app.post('/pets', (req, res, next) => {
    const newPet = req.body;
    if (!(newPet['name'] || newPet['kind'] || newPet['age']) || !parseInt(newPet['age'])) {
        console.log("ERROR ERROR BAD REQUEST")
        next({ status: 400, statusMessage: "Bad Request" })
    } else {
        const { name, kind, age } = req.body;
        pool.query("INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *;",
            [name, kind, age]).then(data => {
                res.send(data.rows[0]);
            }).catch(err => {
                console.error(err);
                next({ status: 504, statusMessage: "Something went wrong :(" });
            })
    };
});

//GET
app.get('/pets/:id', (req, res, next) => {
    pool.query(`SELECT * FROM pets WHERE id = $1;`, [req.params.id]).then((data) => {
        console.log(data.rows) //resulsts are in data.rows
        const result = data.rows;
        if (result.length > 0) {
            //res.status(204).send(result);
            res.status(200).send(result)
        } else {
            next({ status: 404, statusMessage: "ID not in range" })
        }
    }).catch(err => {
        console.error(err);
        next({ status: 504, statusMessage: "Something went wrong :(" });
    });

    // readPetsFile().then(data => {
    //     const result = data[req.params.id];
    //     if (result) {
    //         res.send(result);
    //     } else {
    //         next({ status: 404, statusMessage: "ID not in range" })
    //     }
    // }).catch(err => {
    //     next(err);
    // });
});

//PATCH
app.patch('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    const idNum = Number(req.params.id);
    //VALID ID CHECK
    if (!parseInt(id)) {
        next({ status: 404, statusMessage: "ID not a number" })
    };

    const { name, age, kind } = req.body;
    //VALID AGE CHECK
    if (!parseInt(age)) {
        next({ status: 404, statusMessage: "Age not a number" });
    }
    pool.query(`
        UPDATE pets
        SET name = COALESCE($2, name),
            age = COALESCE($3, age),
            kind = COALESCE($4, kind)
        WHERE id = $1
        RETURNING *;`,
        [id, name, age, kind]).then(data => {
            if (data.rows.length === 0) {
                next({ status: 404, statusMessage: "ID not in range" });
            } else {
                res.send(data.rows[0]);
            }
        }).catch(err => {
            console.error(err);
            next({ status: 504, statusMessage: "Something went wrong :(" });
        });
});

//DELETE
app.delete('/pets/:id', (req, res, next) => {
    pool.query("DELETE FROM pets WHERE id = $1 RETURNING *;", [req.params.id]).then(data => {
        console.log(data.rows[0]);
        if (data.rows.length > 0) {
            res.send(data.rows[0]);
        } else {
            next({ status: 404, statusMessage: "ID not in range" })
        }
    }).catch(err => {
        console.error(err);
        next({ status: 504, statusMessage: "Something went wrong :(" });
    });
});


//GET
app.get('/pets', (req, res, next) => {
    pool.query(`SELECT * FROM pets;`).then((data) => {
        const result = data.rows;
        if (result.length > 0) {
            res.send(result);
        } else {
            next({ status: 404, statusMessage: "Pets not found" })
        }
    }).catch(err => {
        console.error(err);
        next({ status: 504, statusMessage: "Something went wrong :(" });
    });

    // readPetsFile().then(data => {
    //     const result = data[req.params.id];
    //     if (result) {
    //         res.send(result);
    //     } else {
    //         next({ status: 404, statusMessage: "ID not in range" })
    //     }
    // }).catch(err => {
    //     next(err);
    // });
});



//LISTEN ON A PORT
app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`);
});




//ERROR HANDLERS
app.use((req, res, next) => {
    console.log('This is my catchall handler');
    next({ status: 404, statusMessage: 'NOT FOUND' });
});

app.use((err, req, res, next) => {
    console.log('This is my custom error handler');
    //console.error("error start: " + err);
    if (!err.status) {
        err.status = 500
    };
    if (!err.statusMessage) {
        err.statusMessage = "Something when wrong :(";
    }
    res.status(err.status)
    res.send(err.statusMessage);
    //res.render('error', { error: err })
});