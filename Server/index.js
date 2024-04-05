const connectToDb = require('./connection');
const http = require('http');
const app = require('./app');
require('dotenv').config();
const PORT = process.env.PORT;

connectToDb();

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}...`)
})
