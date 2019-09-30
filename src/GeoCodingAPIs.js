const GeoCodingAPIs = {
    getLocationDetails: async (position) => {
        const axios = require('axios')
        const apiKey = process.env.GOOGLE_API_KEY
        let googleResp = await axios.get(`${process.env.GOOGLE_MAP_BASE_URL}?latlng=${position.lat},${position.lng}&key=${apiKey}`)
        if(googleResp.status === 200 && googleResp.data.status === 'OK') {
            let addresses = googleResp.data.results    
            let address = addresses[0].formatted_address
            let name = 'Name not available'
            if(addresses[0].address_components.length > 0) {
                name = addresses[0].address_components[0].long_name
            }
            
            return {
                success: true,
                name,
                address
            }
        }

        return {
            success: false
        }
    }
} 

module.exports = GeoCodingAPIs