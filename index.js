/*const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');



app.use(express.static(__dirname + "/dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



//Handlebars setting
app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialssDir: __dirname + '/views/modules',
}));



//Landing page
app.get('/', (req, res) => {
    res.send("Hello!");
})*/