const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body);

    /* The same below. Its called destructuring in JS
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    */

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error) {
            console.log(error);
        } 

        if(result.length > 0) {
            return res.render('register', {
                message: 'That email has is already in use'
            })
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'The passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        db.query('INSERT INTO users SET ? ', {name: name, email: email, password: hashedPassword }, (error,result) => {
            if(error) {
                console.log(error);
            } else {
                console.log(result)
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })


    });
}