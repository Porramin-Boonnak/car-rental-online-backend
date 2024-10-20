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
    con.query(`DELETE FROM car WHERE id = ${id}`, function (err, deleteResult) {
        if (err) throw err;
                con.query("SELECT * FROM car", function (err,result,fields) {
                    if (err) throw res.status(400).send('Not found any car');
                    console.log(result);
                    res.send(result);
                });
            });
});

app.post('/api/customer', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    con.query(`insert into customer (username,password,email) values('${username}' ,'${password}', '${email}')`, function (err, result) {
    if (err) throw res.status(400).send("Error cannot add customer");  
    con.query("SELECT * FROM customer", function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any car');
        console.log(result);
        res.send(result);
    });
    });
});

app.post('/api/rentcar', function (req, res) {
    const id_customer = req.body.id_customer;
    const rent_car = req.body.rent_car;
    const date_start = req.body.date_start;
    const date_end = req.body.date_end;
    const return_location = req.body.return_location;
    const rent_late = req.body.rent_late;
    const status = req.body.status;
    const income = req.body.income;
    con.query(`INSERT INTO shop (id_customer,rent_car,date_start,date_end,return_location,rent_late,status,income) VALUES('${id_customer}', '${rent_car}', '${date_start}', '${date_end}', '${return_location}', ${rent_late}, '${status}',${income})`, function (err,result,fields) {
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

app.put('/api/rentcar/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const status = req.body.status
    const rent_late = req.body.rent_late
    const returnlocation = req.body.returnlocation
    const car = req.body.car
    con.query(`UPDATE shop SET status = '${status}',rent_late=${rent_late}  WHERE id = ${id}`, function (err,result,fields) {
        if (err) throw res.status(400).send('Not found');
        con.query(`UPDATE car SET location = '${returnlocation}' WHERE id = ${car}`, function (err,result,fields) {
            if (err) throw res.status(400).send('Not found any shop');
            con.query("SELECT * FROM shop", function (err,result,fields) {
                if (err) throw res.status(400).send('Not found any shop');
                res.send(result);
            });
        });
    });
});

app.post('/api/car', function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const seat = req.body.seat;
    const detail = req.body.detail;
    const type = req.body.type;
    const location = req.body.location;
    const img = req.body.img;
    con.query(`INSERT INTO car (name,price,seat,detail,type,location,img) VALUES('${name}', ${price}, ${seat}, '${detail}', '${type}', '${location}', '${img}')`, function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any shop');
        console.log(result);
        res.send(result);
    });
});

app.put('/api/car/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const price = req.body.price;
    const seat = req.body.seat;
    const detail = req.body.detail;
    const type = req.body.type;
    const location = req.body.location;
    const img = req.body.img;
    con.query(`UPDATE car SET name = '${name}',price=${price},seat=${seat},detail='${detail}',type='${type}',location='${location}',img='${img}'  WHERE id = ${id}`, function (err,result,fields) {
        if (err) throw res.status(400).send('Not found');
        con.query("SELECT * FROM car", function (err,result,fields) {
            if (err) throw res.status(400).send('Not found any car');
            console.log(result);
            res.send(result);
        });
    });
});

app.post('/api/customerlogin', function (req, res) {
    const username = req.body.username
    const password = req.body.password
    con.query(`SELECT * FROM customer where username='${username}' `, function (err,result,fields) {
        if (result.length>0)
        {
            con.query(`SELECT * FROM customer where password='${password}' `, function (err,result,fields) {
                if (result.length>0) 
                {
                    res.send("Successfully")
                }
                else {
                    res.status(400).send('Not found any car')
                }
            });
        }
        else{
            res.status(400).send('Not found any car')
        } 
    });
});

const port = 5000;
app.listen(port, function () {
    console.log("Listening on port", port);
});