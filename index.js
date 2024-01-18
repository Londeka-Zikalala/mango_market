import express from 'express';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import db from './db.js';


const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handlebars engine

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//public static
app.use(express.static('public'));

//local host 
const PORT = process.env.PORT || 3000
// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`MangoApp started on port ${PORT}`)
});