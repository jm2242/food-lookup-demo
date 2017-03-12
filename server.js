//@flow
import express from 'express'
import http from 'http'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import foodRoute from './routes/food'
import books from './routes/books'
import authors from './routes/authors'
import auth from './routes/auth'
import session from 'express-session'
import passport from 'passport'

const app = express();

if (process.env.NODE_ENV !== "production") {
    app.set('json spaces', 2);
}

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(session({
    secret: 'keyboard cat person being',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/food', foodRoute);
app.use('/api/books', books);
app.use('/api/authors', authors);
app.use('/auth', auth);

app.use((err, req: express.Request, res: express.Response, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.log(err);

    res.status(err.status || 500).json(err);
});

const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port);
server.on('error', (e: Error) => {
    console.log(`Error starting server: ${e.message}`)
});
server.on('listening', () => {
    console.log(`Atacama started on port ${port}`)
});
