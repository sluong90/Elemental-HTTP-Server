const http = require('http');
const fs = require ('fs');
const querystring = require('querystring');



const server = http.createServer((req,res) => {
    console.log('connected!');
    console.log('method', req.method);
    console.log('url', req.url);
    console.log('header', req.headers);

//GET METHOD

if(req.method === 'GET'){
    if(req.url === '/'){
        req.url = '/index.html';
    }
    fs.readFile(`./public/${req.url}`, 'utf8', (err,data) => {
        if(err){
            fs.readFile('.public/404.html', 'utf8', (err, data) => {
                if(err){
                    res.writeHead(500, 'Server Error!');
                    res.write('Server Error!');
                    return res.end();
                }
                res.writeHead(404, 'Page Not Found');
                res.write(data);
                return res.end();
            });
        }else{
            res.writeHead(200, 'OK');
            res.write(data);
            return res.end();
        }
    })
}

  
//POST METHOD  

    if (req.method === 'POST'){
        let body = [];
        req.on ('data', chunk => {
            // console.log('CHUNK', chunk)
            body.push(chunk);
            // console.log('BODY', body)
        })
        .on('end', chunk => {
            body = Buffer.concat(body).toString();
            // console.log(body);
    
            let parsedBody = querystring.parse(body);
            console.log('PARSED', parsedBody);
    
            const bodyContent = `<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <title>The Elements - ${parsedBody.elementName}</title>
              <link rel="stylesheet" href="/css/styles.css">
            </head>
            
            <body>
              <h1>${parsedBody.elementName}</h1>
              <h2>${parsedBody.elementSymbol}</h2>
              <h3>Atomic number ${parsedBody.elementAtomicNumber}</h3>
              <p>${parsedBody.elementName} is an element with chemical symbol ${parsedBody.elementSymbol} and atomic number ${parsedBody.elementAtomicNumber}.</p>
              <p><a href="/">back</a></p>
            </body>
            </html>`;
    
            fs.writeFile(`./public/${parsedBody.elementName}.html`, bodyContent, err => {
                if(err){
                    res.writeHead(500);
                    res.write('{status: Not working}');
                    res.end();
                }else{
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(`{ "success : true }`);
                    res.end();
                }
            })
        })
    }

            
    
        
    }); //end
    

   



server.listen(8080, () => {
    console.log('yayyyyyy')
})