// Allows us to build a file:
const fs = require('fs');
// Allows us to build an http server:
const http = require('http');

const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////
// FILE Building

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR!');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written.');
//             });
//         });
//     });
// });
// console.log('Will read file!');



/////////////////////////////
// SERVER Building

// Note: Can do synchronous version of readFile here because we are in the top level code and this will only run once
// in the beginning when we load up the application. (Cannot do this in the http.createServer() b/c it is called each time there is a request causing code blocking.)
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    // Response that we are sending back from the server: 
    const { query, pathname } = url.parse(req.url, true);

    // Overveiw Page
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html'});

        // Need to join otherwise product cards are in array format
        const cardsHTML = dataObj.map(prod => replaceTemplate(tempCard, prod)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        res.end(output);

    // Product Page
    } else if (pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    // API
    } else if (pathname === '/api'){
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);

    // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found.</h1>');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('Listening to requests on Port 3000');
})