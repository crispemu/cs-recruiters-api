const mongoose = require('mongoose');

const processSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    position: { type: String, required: false },
    description: { type: String, required: false },
    experience: { type: String, required: false },
    skills: { type: String, required: false },
    startdate: { type: String, required: false },
    enddate: { type: String, required: false },
    department: { type: String, required: false },
    result: { type: String, required: false },
    owner: { type: String, required: false },
    profile: { type: String, required: false },
    status: {type: String, required: false },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: false },
});

module.exports = mongoose.model('Process', processSchema);