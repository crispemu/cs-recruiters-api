const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Process = require("../models/process");
const Interview = require("../models/interview");
const Applicant = require("../models/applicant");

router.get("/", (req, res, next) => {
  Process.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        process: docs.map(doc => {
          return {
            position: doc.position,
            description: doc.description,
            experience: doc.experience,
            skills: doc.skills,
            _id: doc._id,
            startdate: doc.startdate,
            enddate: doc.enddate,
            department: doc.department,
            result: doc.result,
            owner: doc.owner,
            profile: doc.profile,
            status: doc.status,
            applicant: doc.applicant,
            request: {
              type: "GET",
              url: "http://localhost:3000/process/" + doc._id
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
  console.log(req.body.position + " - " + req.body.experience + " - " + req.body.owner);
  var myDateString = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const process = new Process({
    _id: new mongoose.Types.ObjectId(),
    position: req.body.position,
    description: req.body.description,
    experience: req.body.experience,
    skills: req.body.skills,
    startdate: myDateString,
    enddate: "",
    department: req.body.department,
    result: req.body.result,
    owner: req.body.owner,
    profile: req.body.profile,
    status: req.body.status,
    applicant: req.body.applicant
  });

  process
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Process created successfully",
        createdProcess: {
          position: result.position,
          description: result.description,
          experience: result.experience,
          skills: result.skills,
          _id: result._id,
          startdate: result.startdate,
          enddate: result.enddate,
          department: result.department,
          result: result.result,
          owner: result.owner,
          profile: result.profile,
          status: result.status,
          applicant: result.applicant,
          request: {
            type: "GET",
            url: "http://localhost:3000/process/" + result._id
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

router.patch("/:processId", (req, res, next) => {
  const id = req.params.processId;
  const updateOps = {};
  var myEndDateString = "";
  for (const ops of req.body) {
    if(ops.propName != "startdate"){
      updateOps[ops.propName] = ops.value;
    }
    if(ops.propName == "status" && ops.value == "Closed"){
      myEndDateString = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      updateOps["enddate"] = myEndDateString;
    }
  }
  Process.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Process updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/process/" + id
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

router.put("/:processId", (req, res, next) => {
  const id = req.params.processId;
   var myEndDateString = "";
  if(req.body.status == "Closed"){
    myEndDateString = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }
  Process.updateOne (
      { _id : id },
      { $set : 
        { 
          position: req.body.position,
          experience: req.body.experience,
          description: req.body.description,
          skills: req.body.skills,
          startdate: req.body.startdate,
          enddate: myEndDateString,
          department: req.body.department,
          result: req.body.result,
          owner: req.body.owner,
          profile: req.body.profile,
          status: req.body.status,
          applicant: req.body.applicant
        }
      }
  ).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Process updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/process/" + id
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

router.delete("/:processId", (req, res, next) => {
  const id = req.params.processId;
  Process.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Process deleted.",
        request: {
          type: "POST",
          description: "To create new Appliant",
          url: "http://localhost:3000/Appliant/:ProcessId",
          body: {
            position: 'String',
            description: 'String',
            experience: 'String',
            skills: 'String',
            startdate: 'String',
            enddate: 'String',
            department: 'String',
            result: 'String',
            owner: 'String',
            profile: 'String',
            status: 'String',
            applicant: 'Applicant'
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

router.get('/:processId', (req, res, next) => {
  const id = req.params.processId;
  console.log("Id" + id);
  Process.findById(id)
  .select('position description experience skills startdate enddate department result owner profile status _id applicant')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          process: doc,
          request: {
            type: 'GET',
            description: 'To get Process and applicants',
            url: 'http:/localhost:3000/process'
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

module.exports = router;
