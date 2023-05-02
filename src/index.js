const express = require('express');
const route = require('./routes/route.js');
require('dotenv').config()
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL.toString(),{ useNewUrlParser: true })
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);  


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Oops, something went wrong.");
  });


app.listen(process.env.PORT , function () {
    console.log('Express app running on port ' + (process.env.PORT ))  
}); 






