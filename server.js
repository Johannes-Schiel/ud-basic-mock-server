const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const FAKER = require('faker');

// Port of this server
const PORT = 3000;
// creates a new server
const server = jsonServer.create();
// definies all possible routes depending on the data entpoints.
const router = jsonServer.router('./db.json');
// parse the database to an object so this file can easly accsess the data when needed
const DATABASE = JSON.parse(fs.readFileSync('./db.json'));

// sets defaults routes and config settings
server.use(jsonServer.defaults());
// sets the parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// here you can add custom routes, for example when you need data from differend sources
// you can write it here easly 
server.use(jsonServer.rewriter({
    '/me/:id*': '/users/:id'
}));

// Settings for the fake jwt auth middleware
const SECRET_KEY = '123456789';
const expiresIn = '1h'; // <- when a user has to login again, for testing you can change this here to 1 min or 1 sec

/**
 * Create a token from a payload
 */
const createToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

/**
 * Verify the token
 */
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

/**
 * Check if the user exists in database
 */
const isAuthenticated = ({ email, password }) => {
    return DATABASE.users.findIndex(user => user.email === email && user.password === password) !== -1
};

// Custom route for user auth middleware
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (isAuthenticated({ email, password }) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({ status, message })
        return
    }
    const access_token = createToken({ email, password })
    const user = DATABASE.users.find(user => user.email === email);
    console.log(user);
    user.access_token = access_token;
    res.status(200).json(user);
});

// middleware server for each api route, wich checks if the user has
// send a correct auth token.
server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Bad authorization header'
        res.status(status).json({ status, message })
        return
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1])
        next()
    } catch (err) {
        const status = 401
        const message = 'Error: access_token is not valid'
        res.status(status).json({ status, message })
    }
});

/**
 * Function to delete Contract in User
 */
server.use('/contracts/*', (req, res, next) => {
    DATABASE.users.forEach(user => {
        if (Array.isArray(user.contracts)) {
            const index = user.contracts.findIndex(elm => elm.id === req.params['0'])
            if (index !== -1) {
                user.contracts.splice(index, 1);
            }
        }
    });
    next();
});

/**
 * Route to submit error feedback from the App
 */
server.post('/error', (req, res) => {
    const { error } = req.body;
    fs.writeFile('./requests/error.json', JSON.stringify(error), (err) => {
        if (err) console.log(err);
    });
    const validError = validateError(error);
    if (!validError) {
        res.status(200).json({ message: 'Fehler wurde gemeldet.' });
    } else {
        res.status(406).json(validError);
    }
});

/**
 * Function to validate the Error Objekt from the Frontend
 */
function validateError(error) {
    let res = undefined;
    if (!error.device) res = { device: 'There is no device' };
    if (!error.os) res = { device: 'There is no os' };
    if (!error.code) res = { device: 'There is no code' };
    return res;
}

// creates a random delay between 0 and 5000 ms
server.use((req, res, next) => {
    setTimeout(() => {
        next();
    }, FAKER.random.number({ min: 0, max: 5000 }));
});

// respons random with an error
server.use((req, res, next) => {
    if (FAKER.random.number({ min: 0, max: 10 }) >= 2) {
        res.status(400).json({ message: 'Something is wrong' });
    } else {
        next()
    }
});

// add's all routes to the server so the server knows
// what it can do
server.use(router);

// start the server on Port 3000
server.listen(PORT, () => {
    console.log(`Run Auth API Server on http://localhost:${PORT}`)
});



