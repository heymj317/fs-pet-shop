import { readFile, writeFile } from "fs/promises";

export const readPetsFile = () => readFile("pets.json", "utf-8").then(str => {
    const data = JSON.parse(str);
    return data;
}).catch(err => {
    return err;
});

export const writePetsFile = (jsonObj) => {
    const inputString = JSON.stringify(jsonObj);
    writeFile("pets.json", inputString, 'utf-8').catch(err => {
        return err;
    });
};


// import { readFile } from 'node:fs';

// readFile('/etc/passwd', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// writeFile('message.txt', data, (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//   });

//   import { appendFile } from 'node:fs';

// appendFile('message.txt', 'data to append', (err) => {
//   if (err) throw err;
//   console.log('The "data to append" was appended to file!');
// });

