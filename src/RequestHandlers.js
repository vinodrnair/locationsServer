const cache = require('memory-cache')
const GeoCodingAPIs = require('./GeoCodingAPIs')

const RequestHandlers = {
    getId: async ()=> {
        let id = await cache.get('nextId')
        let nextId = id + 1;
        cache.put('nextId', nextId)
        return id
    },

    addLocation: async (position) => {
        let locationDetails = await GeoCodingAPIs.getLocationDetails(position)
        if(locationDetails.success) {
            let id = await RequestHandlers.getId()
            const newLocation = {
                id,
                name: locationDetails.name,
                address: locationDetails.address,
                position
            }

            let locations = await cache.get('locations')
            locations.push(newLocation)
            cache.put('locations', locations)

            return {
                success: true,
                newLocation
            };
        }
    },

    editLocation: async (data) => {
        const {id, position} = data
        let locationDetails = await GeoCodingAPIs.getLocationDetails(position)
        if(locationDetails.success) {
            let locations = cache.get('locations')
            let i 
            for(i=0; i<locations.length; i++) {
                if(locations[i].id === id) {
                    locations[i].name = locationDetails.name
                    locations[i].address = locationDetails.address
                    locations[i].position = position
                    break;
                }
            }

            if(i < locations.length) {
                cache.put('locations', locations)
                return {
                    success: true,
                    editedLocation: locations[i]
                }
            }
        }
    },

    deleteLocation: (id) => {
        let locations = cache.get('locations')
        let index = locations.findIndex(loc => loc.id === id)
        locations.splice(index, 1)
        cache.put('locations', locations)

        return {
            success: true
        }
    }
}

module.exports = RequestHandlers