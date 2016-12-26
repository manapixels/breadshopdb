var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('breadlist', ['breadlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());

app.get('/breadlist', function(req, res) {
    console.log("I received a GET request");
    
    db.breadlist.find(function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
    
});

app.post('/breadlist', function(req, res) {
    console.log(req.body);
    db.breadlist.insert(req.body, function(err, docs) {
        res.json(docs);
    });
});

app.delete('/breadlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    db.breadlist.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
        res.json(docs);
    });
});

app.get('/breadlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    db.breadlist.findOne({_id: mongojs.ObjectId(id)}, function(err, docs) {
        res.json(docs);
    });
});

app.put('/breadlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.breadlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
                                update: {$set: {id: req.body.id, name: req.body.name, description: req.body.description, price: req.body.price, stock: req.body.stock}},
                                new: true}, function (err, docs) {
        res.json(docs);
    });
});



app.listen(3000);
console.log("Server running");