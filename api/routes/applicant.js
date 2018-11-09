const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const rutRegex = require('rut-regex')

const fileUpload = require('express-fileupload')

router.use(fileUpload())
const Applicant = require("../models/applicant");

router.get("/", (req, res, next) => {
  Applicant.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        applicant: docs.map(doc => {
          return {
            rut: doc.rut,
            name: doc.name,
            lastname: doc.lastname,
            _id: doc._id,
            email: doc.email,
            phone: doc.phone,
            skills: doc.skills,
            reference: doc.reference,
            refer: doc.refer,
            cvlink: doc.cvlink,
            country: doc.country,
            request: {
              type: "GET",
              url: "http://localhost:3000/applicant/" + doc._id
            }
          }

        })

      };

      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body.name + " - " + req.body.lastname + " - " + req.body.rut);
  const applicant = new Applicant({
    _id: new mongoose.Types.ObjectId(),
    rut: req.body.rut,
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    skills: req.body.skills,
    reference: req.body.reference,
    refer: req.body.refer,
    cvlink: req.body.cvlink,
    country: req.body.country
  });

  if ((req.body.rut != null && req.body.rut != "") && !rutRegex({exact: true, dot: false}).test(req.body.rut))
  {
    return res.status(404).json({
      message: "Incorrect RUT format"
    });
  }
  var url = ''
  applicant
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Applicant created successfully",
        createdApplicant: {
          rut: result.rut,
          name: result.name,
          lastname: result.lastname,
          _id: result._id,
          email: result.email,
          phone: result.phone,
          skills: result.skills,
          reference: result.reference,
          refer: result.refer,
          cvlink: result.cvlink,
          country: result.country,
          request: {
            type: "GET",
            url: "http://localhost:3000/applicant/" + result.rut
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/byrut/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  console.log("Rut: " + id);
  Applicant.find( { rut: id })
  .select('rut name lastname email phone skills reference refer cvlink country _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          applicant: doc,
          request: {
            type: 'GET',
            description: 'To get All applicant',
            url: 'http:/localhost:3000/applicant/'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  Applicant.findById(id)
  .select('rut name lastname email phone skills reference refer cvlink country _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          applicant: doc,
          request: {
            type: 'GET',
            description: 'To get All applicant',
            url: 'http:/localhost:3000/applicant/'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Applicant.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Applicant updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/applicant/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  Applicant.updateOne (
      { _id : id },
      { $set : 
        { 
          rut: req.body.rut, 
          name: req.body.name, 
          lastname: req.body.lastname, 
          email: req.body.email, 
          phone: req.body.phone, 
          skills: req.body.skills, 
          reference: req.body.reference, 
          refer: req.body.refer,
          cvlink: req.body.cvlink,
          country: req.body.country
        }
      }
  ).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Applicant updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/applicant/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  Applicant.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Applicant deleted.",
        request: {
          type: "POST",
          description: "To create new Appliant",
          url: "http://localhost:3000/Appliant/:ApplicantId",
          body: {
            rut: 'String',
            name: 'String',
            lastname: 'String',
            email: 'String',
            phone: 'String',
            skills: 'String',
            reference: 'String',
            refer: 'String',
            cvlink: 'String',
            country: 'String'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/upload",(req,res) => {
    let EDFile = req.files.file
    EDFile.mv(".\\\cviadtow01\\webpub\\cs-recruiters-api\\uploadfiles\\${EDFile.name}",err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
});
module.exports = router;
