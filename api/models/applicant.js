const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rut: { type: String, required: false, unique: false },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
        email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: { type: String, required: true },
    skills: { type: String, required: true },
    reference: {type: String, required: true },
    refer: { type: String, required: false },
    cvlink: { type: String, required: false },
    country: { type: String, required: false }
});

module.exports = mongoose.model('Applicant', applicantSchema);