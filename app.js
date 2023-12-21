import express from 'express'
import mysql from 'mysql'
import session from 'express-session'
import bcrypt from 'bcrypt'


const app = express()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database',
})


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))


// Prepare to use session
app.use(session({
    secret: 'enrono',
    saveUninitialized: false,
    resave: true
}))

// Continue to check if the user is logged in
app.use((req, res, next) => {
    res.locals.isLogedIn = (req.session.userID !== undefined)
    next()
})

function loginRequired(req, res) {
    res.locals.isLogedIn || res.redirect('/login')
}

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/dashboard', (req, res) => {
    loginRequired(req, res)
    res.render('dashboard', { name: req.session.name })
})

app.get('/logout', (req, res) => {
    loginRequired(req, res)
    // Destroy the session and redirect to the home page
    req.session.destroy((err) => {
        res.redirect('/')
    })
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})