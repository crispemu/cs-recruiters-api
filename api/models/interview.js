const mongoose = require('mongoose');

const interviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: String, required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'Process', required: true },
    psychological: { type: String, required: false },
    technicalqualification: { type: Number, required: false },
    logicalqualification: { type: Number, required: false },
    comment: { type: String, required: false },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Inverview', interviewSchema);