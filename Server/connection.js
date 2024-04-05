const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.URI;

const connectToDb = async() => {
    try {
        await mongoose.connect(url)
        console.log('successfully connected to mongo!')
    } catch (error) {
        console.error(`problem while connecting to the database, ${error.message}`)
    }
}

module.exports = connectToDb;