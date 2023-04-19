const express = require('express');
const route = require('./routes/route.js');
require('dotenv').config()
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://sharmaji232001:bhuvi844964@cluster0.a2txi.mongodb.net/miniProject",{ useNewUrlParser: true })
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);  


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});






