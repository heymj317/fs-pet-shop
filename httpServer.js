import http from 'http';
import { readFile, writeFile } from 'fs/promises';

const server = http.createServer((req, res) => {
    let body = "";
    const url = new URL("localhost:8080" + req.url);
    const path = url["pathname"];
    const pattern = /^\/pets\/(.*)$/;;
    //console.log(url);
    const match = req.url.match(pattern);

    switch (true) {
        case (req.url === "/pets" && req.method === "GET"):
            readFile('pets.json', 'utf-8').then(str => {
                res.end(str);
            }).catch((err) => {
                res.writeHead(404);
                res.end("Not Found")
            });
            break;
        case (match && req.method === "GET"):
            let petIndex = parseInt(match[1]);
            readFile('pets.json', 'utf-8').then(str => {
                const data = JSON.parse(str);
                if (data.length <= petIndex || petIndex < 0) {//CHECK IF INDEX IS IN RANGE
                    res.writeHead(404);
                    res.end("Not Found")
                } else {
                    res.end(JSON.stringify(data[petIndex])); //GET RECORD AT INDEX
                };
            }).catch((err) => {
                console.error(err);
                res.writeHead(404);
                res.end("Not Found")
            });
            break;
        default:
            res.writeHead(404);
            res.end("Not Found")
    };
});

server.listen(8080, () => {
    console.log("Listening on port 8080")
});
