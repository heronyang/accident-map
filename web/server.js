const csv = require('csv-parser');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');

// Loads environment variables
dotenv.config();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const gmap_api_key = process.env.GMAP_API_KEY;
const traffic_accident_csv = process.env.TRAFFIC_ACCIDENT_CSV;

// In-memory data
var death_accident = [];
var injury_accident = [];

// Setting up the server.
var app = express();
app.set('view engine', 'ejs');

// Sets files under static/ as static files.
app.use(express.static('static'));

// Serves homepage with index.html.
app.get('/', (req, res) => {
    res.render('index', { gmap_api_key: gmap_api_key })
});

// Gets accident list of different types of accident.
app.get('/accidents', (req, res) => {
    console.log('Got accident location request', req.query);
    res.setHeader('Content-Type', 'application/json');
    switch(req.query.accident_type) {
        case 'injury':
            res.end(JSON.stringify(injury_accident));
            break;
        case 'death':
            res.end(JSON.stringify(death_accident));
            break;
        case 'all':
            res.end(JSON.stringify(injury_accident.concat(death_accident)));
            break;
        default:
            res.send('Unsupported accident type');
            return;
    }
    console.log('Accident location respond');
});

function start_server() {
    app.listen(port);
    console.log('Running server on port ' + port);
}

function load_data_into_memory(callback) {
    console.log('Start loading data into memory.')
    fs.createReadStream(traffic_accident_csv)  
        .pipe(csv())
        .on('data', (row) => {
            accident = [row.lat, row.lng, row.time];
            for (var i = 0; i < row.injury; i++) {
                injury_accident.push(accident);
            }
            for (var i = 0; i < row.death; i++) {
                death_accident.push(accident);
            }
        })
        .on('end', () => {
            console.log('Data is loaded into memory.');
            console.log('Death count', death_accident.length);
            console.log('Injury count', injury_accident.length);
            callback();
        });
}

// Entry point for starting the server.
function main() {
    load_data_into_memory(start_server);
}
main();
