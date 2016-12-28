var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('breadlist', ['breadlist']);
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var fs = require('fs');
var path = require('path');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

app.use(favicon(__dirname + '/images/favicon.png'));
app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());

app.get('/breadlist', function(req, res) {
    
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

//app.post('/uploads', function(req, res) {
//    console.log(req.data.base64);
//});

app.post('/uploads/:id', multipartyMiddleware, function(req, res) {
    
    
    var absolutePath = path.normalize(__dirname + "/uploads/" + path.basename(req.files.file.path));
    var relativePath = "/uploads/" + path.basename(req.files.file.path);
    
    // copy image from temp directory to /uploads folder
    fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(absolutePath));
    
    // save to database
    var breadid = req.params.id;
    db.breadlist.findAndModify({query: {_id: mongojs.ObjectId(breadid)},
                                update: {$set: {imagePath: relativePath}},
                                new: true}, function (err, docs) {
        res.send([req.files.file.originalFilename, relativePath]);
    });

});

app.listen(3000);
console.log("Server running");
    