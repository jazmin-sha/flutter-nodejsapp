require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require("morgan")
const port = process.env.PORT || 3001;
const app = express();
const session = require('express-session');
const mongoStore = require('connect-mongo').default;
const router = require('./routes/userRouter');
const routers = require('./routes/adminRoute')
const dburl = process.env.DB_URL || "mongodb://localhost:27017/LiveTracking"
const helmet = require('helmet')
//connection
const mongoose = require('mongoose');
mongoose.connect(dburl, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log('Fail to Connect..!');
    } else {
        console.log('Connection Success....!');
    }
})
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use('/user', session({
    name: process.env.USER_COOKIE_NAME,
    secret: process.env.USER_COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: mongoStore.create({
        mongoUrl: dburl,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use('/admin', session({
    name: process.env.ADMIN_COOKIE_NAME,
    secret: process.env.ADMIN_COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: mongoStore.create({
        mongoUrl: dburl,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//routes
app.use('/user', router);
app.use('/admin', routers)
app.listen(port, (err) => {
    if (err) throw err
    console.log(`Running ON ${process.env.NODE_ENV} MODE on http://localhost:${port}`);
})
