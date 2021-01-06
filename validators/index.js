const { validationResult } = require('express-validator')

exports.runValidation = (req, res, next) => {       // next is callback fn
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg })
        // return res.status(422).json({ errors: errors.array() })
    }
    next()
}


// auth.js will check

// index.js will return validationResult