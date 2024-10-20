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
    host: "127.0.0.1",
    user: "root",
    password: "1212312121",
    port : 3306,
    database: "car_rental"
});
con.connect(function(err){
    if (err) throw err;
});

app.get('/api/car', function (req, res) {
    con.query("SELECT * FROM car", function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any car');
        console.log(result);
        res.send(result);
    });
});

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

app.delete('/api/car/:id', function (req, res) {
    const id = parseInt(req.params.id);
    con.query("SELECT COUNT(id) AS `count(id)` FROM car", function (err, result) {
        if (err) throw err;
        const count = result[0]["count(id)"];
        if (count > 0) {
            con.query(`DELETE FROM car WHERE id = ${id}`, function (err, deleteResult) {
                if (err) throw err;
                con.query(`UPDATE car SET id = id - 1 WHERE id > ${id}`, function (err, updateResult) {
                    if (err) throw err;
                    con.query(`UPDATE shop SET rent_car = rent_car - 1 WHERE rent_car > ${id}`, function (err, updateResult) {
                        if (err) throw err;
                        con.query("SELECT * FROM car", function (err,result,fields) {
                            if (err) throw res.status(400).send('Not found any car');
                            console.log(result);
                            res.send(result);
                        });
                    });
                });
            });
        } else {
            res.status(404).send('Not found any car');
        }
    });
});

app.post('/api/customer', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    con.query("SELECT COUNT(id) AS `count(id)` FROM customer", function (err, result) {
        if (err) throw err;
        const count = parseInt(result[0]["count(id)"]);
        if (count > 0) {
            con.query(`insert into customer values('${count+1}', '${username}' ,'${password}', '${email}')`, function (err, result) {
            if (err) throw res.status(400).send("Error cannot add customer");
            con.query(`select * from customer where id='${count+1}'`, function (err,result,fields) {
                if (err) throw res.status(400).send('Not found any customer');
                console.log(result);
                res.send(result);
            });
            });
        }
        else {
            con.query(`insert into customer values('1', '${username}' ,'${password}', '${email}')`, function (err, result) {
                if (err) throw res.status(400).send("Error cannot add customer");
                con.query("select * from customer where id=1", function (err,result,fields) {
                    if (err) throw res.status(400).send('Not found any customer');
                    console.log(result);
                    res.send(result);
                });
                });
        }
    });
});

app.post('/api/rentcar', function (req, res) {
    const id_customer = req.body.id_customer;
    const rent_car = req.body.rent_car;
    const date_start = req.body.date_start;
    const date_end = req.body.date_end;
    const return_location = req.body.return_location;
    const rent_late = req.body.rent_late;
    const income = req.body.income;
    con.query(`INSERT INTO shop VALUES('${id_customer}', '${rent_car}', '${date_start}', '${date_end}', '${return_location}', ${rent_late}, ${income})`, function (err,result,fields) {
        if (err) throw err;
        res.send("Successfully");
    });
    
    
});

app.get('/api/rentcar', function (req, res) {
    con.query("SELECT * FROM shop", function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any shop');
        console.log(result);
        res.send(result);
    });
});

const port = 5000;
app.listen(port, function () {
    console.log("Listening on port", port);
});