const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const cache = require('memory-cache')
require('dotenv').config()
const RequestHandlers = require('./RequestHandlers')

cache.put('nextId', 1)
cache.put('locations', [])

app.use(cors())
app.use( bodyParser.json())

app.get('/allLocations', (req, res) => {
    const locations = cache.get('locations')
    res.send(locations)
})

app.post('/addLocation', async (req, res) => {
    let result = await RequestHandlers.addLocation(req.body)
    if(result && result.success) {
        res.send(result.newLocation)
    } else {
        res.status(500).send('The location could not be added')
    }
})

app.post('/editLocation', async (req, res) => {
    let result = await RequestHandlers.editLocation(req.body)
    if(result && result.success) {
        res.send(result.editedLocation)
    } else {
        res.status(500).send('The location could not be edited')
    }
})

app.delete('/deleteLocation', async(req, res) => {
    let result = RequestHandlers.deleteLocation(req.query.id)
    if(result && result.success) {
        res.send({
            success: true
        })
    } else {
        res.status(500).send('The location could not be deleted')
    }
})

app.listen(process.env.SERVER_PORT || 5000, () => {
    console.log('Server started !!!')
})