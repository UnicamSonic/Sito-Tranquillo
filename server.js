var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Carico i modelli del database
var modelloProdotto = require('./server/models/prodotto');
var modelloUtente = require('./server/models/utente');

var dbUrl = require('./server/config/db.js');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Istruisco il server su quale cartella usare come radice
var wwwRoot = __dirname + '/app/';
app.use(express.static(wwwRoot));

// Creo una variabile per poter usare il db fuori dalla callback
var db;
// Se nell'ambiente c'è un URI specifico per mongo uso quello,
// altrimenti quello preso dal js in config
var MONGODB_URI = process.env.MONGODB_URI || dbUrl.urlRemoto;


//mongoose.Promise = Promise;

// Mi connetto al DB prima di iniziare a far girare l'app
mongoose.connect(MONGODB_URI, { useMongoClient: true }, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Salvo la variabile esterna db per usi fuori dalla callback
    db = database;
    console.log("Connessione al database riuscita");

    // importo le api per gli upload
    var routeUpload = require('./server/routes/routeUpload');
    routeUpload(app);
    // importo le api per le operazioni nel db
    var routeProdotti = require('./server/routes/routeProdotti');
    routeProdotti(app, db);
    var routeUtenti = require('./server/routes/routeUtenti');
    routeUtenti(app, db);
    //app.use(app.router);
    app.use(function(req, res) {
        res.sendFile(__dirname + '/app/index.html');
    });

    // Inizializzo il server
    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log('Server in ascolto sulla porta', port);
    });
});