const express = require('express');
const cors = require('cors');
const routes = require('./routes/playerRoutes');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'DELETE', 'GET'],
    credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use('/allaihoop', routes);

app.listen(PORT, () => console.log("Server listens on port 3001."));
















