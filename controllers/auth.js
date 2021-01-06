const shortId = require('shortid')

const User = require('../models/user')

exports.signup = (req, res) => {        
    User.findOne({ email: req.body.email}).exec((error, user) => {
        if(user) res.status(400).json({ error: 'Email is taken' })
        
        const { name, email, password } = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({ name, email, password, profile, username })
        newUser.save( (error, success) => {
            if(error) res.status(400).json({ error: error })

            return res.json({ user: success })

            // res.json({ message: 'Sign up success! Please sign in'})
        })
    })
}