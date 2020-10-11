const express = require('express');
const { resolve } = require('path');
const app = express();

app.use(require('cors')());
app.use(express.json());
app.use('/', express.static(resolve(__dirname, 'public')));

require('./routes/admin')(app);
require('./plugins/db')(app);

app.listen(2887, ()=> {
    console.log('http://localhost:2887');
})