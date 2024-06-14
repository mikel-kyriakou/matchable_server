const {ValidationError} = require('../shared/shared_data')
const service = require('./searchService')

async function searchFacilities(req, res){
    try {
        const query = req.body.query;

        if(!query){
            throw new ValidationError('Query is required to do search. Body: ' + req.body);
        }

        const result = await service.searchForFacilities(query);

        res.status(200).json({result: result})

    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }

    }
}

// async function searchFacilitiesWithFilters(req, res){
//     try {
//         const query = req.body.query
//         const 
//     } catch (error) {
        
//     }
// }

async function getAllSportFacilities(req, res){
    try {
        const sport = req.params.sport;
        const page = req.params.page;

        const facilities = await service.getSportFacilities(sport, page);

        for(let facility of facilities){
            facility.rating = facility.rating.toPrecision(2);
        }

        res.status(200).json({facilities: facilities})
        
    } catch (error) {
    }
}

async function getFacilityInfo(req, res){
    try {
        const facility_id = req.params.id;

        const facility = await service.getFacility(facility_id);

        res.status(200).json({facility: facility})
        
    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

async function getAvailableFacilities(req, res){
    try {
        const sport = req.params.sport;
        const date = req.params.date;
        const from = req.params.from;
        const to = req.params.to;

        console.log('sport: ', sport)

        const facilities = await service.findAvailableFacilities(sport, date, from, to);

        res.status(200).json({facilities: facilities});

    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

async function getAvailabilityFacility(req, res){
    try {
        const facility_id = req.params.id;
        const sport = req.params.sport;
        const type = req.params.sport_type;
        const date = req.params.date;

        const available_hours = await service.findAvailabilityForFacility(facility_id, sport, type, date);

        res.status(200).json({availability: available_hours})
    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

async function getRecommended(req, res){
    try {
        const facilities = await service.getRecommendedFacilities();

        res.status(200).json({facilities: facilities})
    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = {
    searchFacilities,
    getAllSportFacilities,
    getFacilityInfo,
    getAvailableFacilities,
    getAvailabilityFacility,
    getRecommended
}