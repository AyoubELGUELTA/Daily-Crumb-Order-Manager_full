const express = require('express');

const app = express();

const cors = require('cors');

app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:3000', // L'URL de votre application React
    optionsSuccessStatus: 200 // Pour les anciens navigateurs
};
app.use(cors(corsOptions)); // On utilise le middleware avec nos options


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const clientRoutes = require('./api/routes/clients');
const userRoutes = require('./api/routes/users');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);

module.exports = app;
