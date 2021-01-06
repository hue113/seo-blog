const shortId = require('shortid')

const User = require('../models/user')

exports.signup = (req, res) => {     
    console.log('signup called')    
    // const { name, email, password } = req.body
    // res.json({
    //     user: { name, email, password }
    // })

    User.findOne({ email: req.body.email}).exec((error, user) => {
        console.log('User.findOne called')
        if(user) res.status(400).json({ error: 'Email is taken' })
        
        const { name, email, password } = req.body
        console.log('req.body', name, email, password)
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({ name, email, password, profile, username })
        console.log('newUser', newUser)
        newUser.save( (error, success) => {
            if(error) { 
                console.log('test error')
                return res.status(400).json({ error: 'test error' })
            }

            return res.json({ user: success })
            // res.json({ message: 'Sign up success! Please sign in'})
        })
    })
}