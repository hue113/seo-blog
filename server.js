const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')    // express.json()
const mongoose = require('mongoose')
require('dotenv').config()

const blogRoutes = require('./routes/blog')     // bring routes
const authRoutes = require('./routes/auth')     // bring routes

// app
const app = express()

// db
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false,
    useUnifiedTopology: true
}).then( () => {
    console.log('DB connected')
})

// middlewares
app.use(morgan('dev'))
// app.use(express.json())         
app.use(bodyParser.json())
app.use(cookieParser())

// routes middleware
// app.use(blogRoutes)          //  '/'     
app.use('/api', blogRoutes)     // should set endpoint prefix 'api' -- good practise 
app.use('/api', authRoutes) 

// cors
if(process.env.NODE_ENV === 'development') {
    // So that client port 3000 can get api from server port 8000
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

// port
const port = process.env.PORT || 8000       // from env variable || if it doesn't exist --> 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

