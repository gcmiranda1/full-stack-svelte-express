const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const User = require('./models/User')
const authRoutes = require('./routes/auth')


const path = require('path')

// Auth import's
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const transactionRoutes = require('./routes/transactions')

const mongoose = require('mongoose')
const { port, mongoURI } = require('./config.js')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(() => console.log('[MongoDB] Database connected.'))
  .catch(() => console.log((err) => console.log(err)))

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'this is my secret key 2021',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use('/api/transactions', transactionRoutes)
app.use('/api/auth', authRoutes)


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'))
  app.get('*', (req, res) =>  {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'))
  });
}

app.listen(port, () => console.log('Express is listening on port ' + port)) 