const express = require("express");
const path = require("path");
const db = require("./Develop/db/db.json");
const PORT =3001;
const app = express();
const fs=require("fs");
const util = require('util')
const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)
app.use(express.static("Develop/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req,res)=> {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/api/notes', (req,res)=>{
    readFileAsync('./Develop/db/db.json').then(data =>{
        let saveNote = JSON.parse(data);

       
        res.json(saveNote);

    })
    
})


// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Prepare a response object to send back to the client
    let response;
  
    // Check if there is anything in the response body
    if (req.body && req.body.title) {
      response = {
        status: 'success',
        data: req.body,
      };
      res.status(201).json(response);
    } else {
      res.status(400).json('Request body must at least contain a title');
    }
  readFileAsync('./Develop/db/db.json').then(data => {
    // spread operator
    let allNotes = JSON.parse(data)
    return [...allNotes, req.body]
  }).then(data => {
    writeFileAsync("./Develop/db/db.json", JSON.stringify(data)).then(data => {
        res.json(data)
    });
  })

    // Log the response body to the console
    console.log(req.body);
  });
  

  

app.listen(PORT,()=>
console.info(`App listening at http:..localhost:${PORT}`)
);