const Listing = require('../models/Listings');

// create listing
exports.createListing = async (req,res) => {
    try{
        const{name, description, participants} = req.body;
        const listing = new Listing({name, description, participants});
        await listing.save();
        res.status(200).json({status: 'success', message: 'Listing created'});
    } catch(err){
        res.status(500).json({status: 'failure', message: err.message});
    }
};

// get all listing
exports.getAllListings = async(req,res) => {
    try{
        const listining = await Listing.find().sort({dateOfCreation: -1});
        res.status(200).json({listings});
    } catch(err){
        res.status(500).json({status: 'failure', message: err.message});
    }
};

// edit listing
exports.editListings = async (req,res) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing) return res.status(404).json({status: 'failure', message:'Listing not found'});

        const{name, description, participants} = req.body;
        if(name) listing.name = name;
        if(description) listing.description = description;
        if(participants){
            participants.forEach(p=>{
                if(!listing.participants.includes(p)) listing.participants.push(p);
            });
        }
        await listing.save();
        res.status(200).json({status:'success', message:'Listing updated',Listing});
    } catch(err){
        res.status(500).json({status: 'failure', message:err.message});
    }
};

// delete listing
exports.deleteListings = async(req,res) => {
try{
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if(!listing) return res.status(404).json({status:'failure', message:'Listing not found'});
    res.status(200).json({status:'success', message:'Listong deleted'});
} catch(err){
    res.status(500).json({status:'failure', message: err.message});
}
};

