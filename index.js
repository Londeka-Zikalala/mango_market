import express from 'express';
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser';
import db from './db.js';
import mangoShopper from './mango-shopper.js';
import mangoShopperRoutes from './routes/mango-shoper-routes.js';

const mangodb = mangoShopper(db)
const mangoRoutes = mangoShopperRoutes(mangodb)
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
//route handlers

app.get('/', mangoRoutes.showIndex);
app.post('/recommend', mangoRoutes.recommededDealsRoute);
app.get('/all', mangoRoutes.allShopsRoute);
app.post('/create', mangoRoutes.createDealRoute);
app.get('/create', mangoRoutes.createDealRoute);
app.get('/shop-deals/:shopId', mangoRoutes.dealsForShopRoute);

//local host 
const PORT = process.env.PORT || 3000
// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`MangoApp started on port ${PORT}`)
});