const express = require('express');
const router = express.Router();
const TvSeries = require('../models/TvSeries');
const TvSeriesDetails = require('../models/TvseriesDetails');


// @desc    Get all tv series
// @route   GET /tvseries
// @access  Public
router.get('/', async (req, res) => {

    //for search
    const { search } = req.query
    const query = { $regex: search, $options: "i" }

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 8; // Default limit to 10 documents per page if not specified

    try {
        if (search) {
            const totalDocuments = await TvSeries.find({ 'name': query }).countDocuments()
            const totalPages = Math.ceil(totalDocuments / limit);
            const tvSeries = await TvSeries.find({ 'name': query }).skip((page - 1) * limit)
                .limit(limit);
            return res.status(200).json({ tvSeries, totalPages, totalDocuments, currentPage: page });
        }
        const totalDocuments = await TvSeries.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        const tvSeries = await TvSeries.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            tvSeries,
            totalPages,
            totalDocuments,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching TV series from database.' });
    }
});


// @desc    Get tv series details by ID
// @route   GET /tvseries/details/:id
// @access  Public
router.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const tvSeries = await TvSeriesDetails.findOne({ 'details.id': id });

        if (!tvSeries) {
            return res.status(404).json({ message: 'TV series not found' });
        }

        res.json(tvSeries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch TV series details' });
    }
});


module.exports = router;
