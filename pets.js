
import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';


const subcommand = process.argv[2];

switch (subcommand) {
    //CREATE
    case 'create':
        const petAge = process.argv[3];
        const petKind = process.argv[4];
        const petName = process.argv[5];
        if (petName) {
            const newPet = { age: petAge, kind: petKind, name: petName };
            console.log('new pet: ', newPet);
            process.exit();
        };
        console.error('Usage: node pets.js create AGE KIND NAME');
        process.exit(-1);
        break;
    //READ
    case 'read':
        const readIndex = process.argv[3];
        const pattern = /[0-9]/;
        readFile('pets.json', 'utf-8').then(str => {
            console.log("reading file!");
            const data = JSON.parse(str);
            if (pattern.test(readIndex)) {//CHECK IF SUBCOMMAND IS A NUMBER
                if (data.length <= readIndex || readIndex < 0) {//CHECK IF INDEX IS IN RANGE
                    console.log('Usage: node pets.js read INDEX');
                    process.exit(-1);
                };
                console.log(data[readIndex]); //GET RECORD AT INDEX
                process.exit();
            }
            console.log(data);
            process.exit(-1);
        }).catch((err) => console.error(err));


        break;

    case 'update':
        let updateIndex = process.argv[3]
        let updateAge = parseInt(process.argv[4]);
        let updateKind = process.argv[5];
        let updateName = process.argv[6];
        let updatePattern = /[0-9]/;
        // fs.readFile("pets.json", "utf-8", (err, str) => {
        //     console.log("first read!!");
        //     let data = JSON.parse(str);
        //     console.log(data);
        //     process.exit(-1);
        // });


        if (updateName) {
            readFile('./pets copy.json', 'utf-8').then(str => {
                const updateData = JSON.parse(str);
                if (updatePattern.test(updateIndex)) {//CHECK IF SUBCOMMAND IS A NUMBER
                    if (updateData.length <= updateIndex || updateIndex < 0) {//CHECK IF INDEX IS IN RANGE
                        console.log('Usage: node pets.js update INDEX AGE KIND NAME');
                        process.exit(-1);
                    };
                    updateData[updateIndex]['age'] = updateAge;
                    updateData[updateIndex]['kind'] = updateKind;
                    updateData[updateIndex]['name'] = updateName;
                    let jsonFile = JSON.stringify(updateData);
                    writeFile("pets.json", jsonFile, 'utf-8').then(() => {
                        console.log(updateData[updateIndex]);
                        process.exit();
                    });

                };

            }).catch((err) => console.error(err));

        } else {
            console.error('Usage: node pets.js update INDEX AGE KIND NAME');
            process.exit(-1);
        };
        break;

    case 'destroy':
        console.log();
        break;

    default: {
        console.error('Usage: node pets.js [read | create | update | destroy]');
        process.exit(-1);
    }
};


const getFile = () => {
    readFile('pets.json', 'utf-8').then((str) => {
        console.log("reading file!");
        const data = JSON.parse(str);
        if (pattern.test(readIndex)) {//CHECK IF SUBCOMMAND IS A NUMBER
            if (data.length <= readIndex || readIndex < 0) {//CHECK IF INDEX IS IN RANGE
                console.log('Usage: node pets.js read INDEX');
                process.exit(-1);
            };
            console.log(data[readIndex]); //GET RECORD AT INDEX
            process.exit();
        }
        return data
    }).catch((err) => console.error(err));
};

