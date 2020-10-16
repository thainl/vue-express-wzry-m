const express = require('express');
const { resolve } = require('path');
const app = express();

app.set('secret', '54jabh0we9u2s'); // token密钥

app.use(require('cors')());
app.use(express.json());
app.use('/', express.static(resolve(__dirname, 'public')));

require('./plugins/db')(app);
require('./routes/admin')(app);


app.listen(2887, ()=> {
    console.log('http://localhost:2887');
})