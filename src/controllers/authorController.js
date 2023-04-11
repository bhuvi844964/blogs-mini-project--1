const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//------------------------regex---------------------------//

let nameRegex = /^[a-zA-Z]{1,20}$/

let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/

let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

//---------------------------------------------------------------//

//...1...Create Author APi.......................................//

//---------------------------------------------------------------//


module.exports.createAuthor = async function (req, res) {
    try {
        let data = req.body
        let { fname, lname, title, password, email } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide all the details 🛑" })
        }
        
        if (!fname || fname == "") {
            return res.status(400).send({ Status: false, message: "Please provide fname 🛑" })
        }
        fname=data.fname=fname.trim()
        if (!nameRegex.test(fname)) {
            return res.status(400).send({ Status: false, message: "Please enter valid fname 🛑" })
        }
        
        if (!lname || lname == "") {
            return res.status(400).send({ Status: false, message: "Please provide lname 🛑" })
        }
        lname=data.lname=lname.trim()
        if (!nameRegex.test(lname)) {
            return res.status(400).send({ Status: false, message: "Please enter valid lname 🛑" })
        }
        
        if (!title || title == "") {
            return res.status(400).send({ Status: false, message: "Please provide title 🛑" })
        }
        title=data.title=title.trim()
        if(title){
            if(!( ["Mr", "Mrs", "Miss"].includes(title))) {
              return res.status(400).send({ Status: false, message: "Please provide valid title 🛑" })
            }
        }

        if (!emailRegex.test(email)) {
            return res.status(400).send({ Status: false, message: "Please enter valid email 🛑" })
        }
        if (email) {
            let checkemail = await authorModel.findOne({ email: email })

            if (checkemail) {
                return res.status(400).send({ Status: false, message: "Please provide another email, this email has been used 🛑" })
            }
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send({ Status: false, message: "Please provide valid AlphaNumeric password having min character 8 🛑" })
        }
        const salt = await bcrypt.genSalt(saltRounds);

        const hashPassword = await bcrypt.hash(password, salt);

        let obj =  { fname, lname, title, password : hashPassword, email } 

        let savedData = await authorModel.create(obj)
        return res.status(201).send({ status : true, msg: savedData })
        
  }
  catch (error) {
    res.status(500).send({ status: false, error: error.message })
  }
}


//...............................................................//.................................................... //

module.exports.login = async function (req, res) {
  try {
    const { email, password } = req.body; 

    if (!email || email === '') {
      return res
        .status(400)
        .send({ status: false, message: 'Please provide email' });
    }

    if (!password || password === '') {
      return res
        .status(400)
        .send({ status: false, message: 'Please provide password to login' });
    }

    const author = await authorModel.findOne({ email });

    if (!author) {
      return res
        .status(401)
        .send({ status: false, message: 'Email is incorrect' });
    }

    const matchPassword = await bcrypt.compare(password, author.password);

    if (!matchPassword) {
      return res
        .status(401)
        .send({ status: false, message: 'Password is incorrect' });
    }

    const token = jwt.sign(
      { authorId: author._id },
      'This-is-a-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).send({
      status: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

