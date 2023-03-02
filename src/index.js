const express = require('express');
const app = express();
var cors = require('cors')
const routes = require('./routes');


app.use(cors());

app.use(express.json());

app.use(routes);


app.listen(3000, () => {
    console.log('Server starter at http://localhost:3000/');
});