const Listing = require('../models/Listing');

// Create listing
exports.createListing = async (req, res) => {
  try {
    const { name, description, participants } = req.body;

    const listing = new Listing({ name, description, participants });
    await listing.save();

    res.status(201).json({
      status: 'success',
      message: 'Listing created',
      data: listing
    });
  } catch (err) {
    res.status(500).json({ status: 'failure', message: err.message });
  }
};

// Get all listings
exports.getAllListings = async (req, res) => {
    try {
      const listings = await Listing.find().sort({ dateOfCreation: -1 }); // use 'listings'
      res.status(200).json({
        status: 'success',
        results: listings.length,
        data: listings
      });
    } catch (err) {
      res.status(500).json({ status: 'failure', message: err.message });
    }
  };
  
  

// Edit listing
exports.editListings = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res
        .status(404)
        .json({ status: 'failure', message: 'Listing not found' });

    const { name, description, participants } = req.body;

    if (name) listing.name = name;
    if (description) listing.description = description;
    if (participants) {
      participants.forEach(p => {
        if (!listing.participants.includes(p)) listing.participants.push(p);
      });
    }

    await listing.save();

    res.status(200).json({
      status: 'success',
      message: 'Listing updated',
      data: listing
    });
  } catch (err) {
    res.status(500).json({ status: 'failure', message: err.message });
  }
};

// Delete listing
exports.deleteListings = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing)
      return res
        .status(404)
        .json({ status: 'failure', message: 'Listing not found' });

    res.status(200).json({
      status: 'success',
      message: 'Listing deleted'
    });
  } catch (err) {
    res.status(500).json({ status: 'failure', message: err.message });
  }
};