const express = require('express');
const bodyParser = require('body-parser');
const { application } = require('express');
const { v4: uuidv4} = require('uuid');
var mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});
app.use(express.json());

var con = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12737374",
    password: "AbSIGRAnfS",
    port : 3306,
    database: "sql12737374"
});
con.connect(function(err){
    if (err) throw err;
});

// Get all products
app.get('/api/car', function (req, res) {
    con.query("SELECT * FROM car", function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any car');
        console.log(result);
        res.send(result);
    });
});

// Get a specific product by ID
app.get('/api/car/:id', function (req, res) {
    const id = req.params.id;
    con.query("SELECT * FROM car where id="+id, function (err,result,fields){
        if (err) throw err;
        let product=result;
        if(product.length>0){
            res.send(product);
        }
        else{
            res.status(400).send('Not found any car for'+id);
        }
    });
});

const port = 5000;
app.listen(port, function () {
    console.log("Listening on port", port);
});