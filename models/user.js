const mongoose = require('mongoose')
const crypto = require('crypto')

// mongoose.Schema takes 2 objects as arguments
const userSchema = new mongoose.Schema({        
    username: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: true
    },
    hashed_password: {      // we don't save plain password into db; only save hashed version of it
        type: String,
        required: true,
    },
    salt: String,           // define how strong the password will be hashed
    about: {
        type: String
    },
    role: {
        type: Number,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {    
        // we generate token, save in db. 
        // When user click to reset -> we email that token to user
        // User click on that link -> redirect to their react app & their react app will send token back to our server
        // Then we will check if the token is the same as the one in db
        data: String,
        default: ''
    }

}, { timeStamp: true})


// dont' use arrow fn here
userSchema.virtual('password')          
    .set(function(password) {  
        console.log('set called')         
        this._password = password       // create a temporary variable called password
        console.log('this._password: ', this._password)
        this.salt = this.makeSalt()     // generate salt
        this.hashed_password = this.encryptPassword(password)   // encryptPassword
    })                  
    .get(function() {
        console.log('get called')
        return this._password
    })

userSchema.methods = {
    authenticate: function(plainText) {
        console.log('method authenticate called')
        return this.encryptPassword(plainText) === this.hashed_password
    }, 

    encryptPassword: function(password) {
        if(!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (error) {
            return ''
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = mongoose.model('User', userSchema)