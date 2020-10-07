const router = require('express').Router();
const Users = require('../users/users-model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

router.post('/register', async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try{
        const saved = await Users.add(user);
        res.status(201).json(saved);
    } catch(err){
        console.log(user);
        console.log(err);
        res.status(500).json(err);
    }
})

router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        const user = await Users.findBy({username}).first();
        if(user && bcrypt.compareSync(password, user.password)){
            const token = generateToken(user);
            req.session.user = user;
            res.status(200).json({message: `Welcome ${username}`, token})
        } else {
            res.status(401).json({message: 'You shall not pass'})
        }
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('you can check out any time you like, but you can never...')
            } else {
                res.send('Goodbye')
            }
        })
    } else {
        res.end();
    }
})

function generateToken(user) 
{
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    };

    const secret = secrets.jwtSecret;

    const options  = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, secret, options)
}

module.exports = router;