const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Interview = require("../models/interview");

router.get("/", (req, res, next) => {
  Interview.find()
  .populate('applicant process')
  .select('rut process applicant date  psychological technicalqualification logicalqualification comment status _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          interview: doc,
          request: {
            type: 'GET',
            description: 'To get All interview',
            url: 'http:/localhost:3000/interview'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No entry found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
/*router.get("/", (req, res, next) => {
  Interview.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        interview: docs.map(doc => {
          return {
            date: doc.date,
            process: doc.process,
            applicant: doc.applicant,
            psychological: doc.psychological,
            technicalqualification: doc.technicalqualification,
            _id: doc._id,
            logicalqualification: doc.logicalqualification,
            comment: doc.comment,
            status: doc.status,
            request: {
              type: "GET",
              url: "http://localhost:3000/interview/" + doc._id
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
});*/

router.post("/", (req, res, next) => {
  console.log(req.body.date, req.body.status);
  const interview = new Interview({
    _id: new mongoose.Types.ObjectId(),
    date: req.body.date,
    applicant: req.body.applicant,
    process: req.body.process,
    psychological: req.body.psychological,
    technicalqualification: req.body.technicalqualification,
    logicalqualification: req.body.logicalqualification,
    comment: req.body.comment,
    status: req.body.status
  });

  interview
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Interview created successfully",
        createdInterview: {
          date: result.date,
          rut: result.rut,
          process: result.process,
          rut: result.rut,
          psychological: result.psychological,
          technicalqualification: result.technicalqualification,
          _id: result._id,
          logicalqualification: result.logicalqualification,
          comment: result.comment,
          status: result.status,
          request: {
            type: "GET",
            url: "http://localhost:3000/interview/" + result._id
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

router.get("/:interviewId", (req, res, next) => {
  const id = req.params.interviewId;
  console.log("Id: " + id);
  Interview.findById(id)
  .populate('applicant process')
  .select('rut process date  psychological technicalqualification logicalqualification comment status _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          interview: doc,
          request: {
            type: 'GET',
            description: 'To get All interview',
            url: 'http:/localhost:3000/interview'
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

router.get("/byprocess/:processId", (req, res, next) => {
  const id = req.params.processId;
  console.log("Process: " + id);
  Interview.find( { process: id })
  .populate('applicant process')
  .select('rut process date  psychological technicalqualification logicalqualification comment status _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          interview: doc,
          request: {
            type: 'GET',
            description: 'To get interview by process',
            url: 'http:/localhost:3000/interview'
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

router.get("/byapplicant/:applicantId", (req, res, next) => {
  const id = req.params.applicantId;
  console.log("Appliant: " + id);
  Interview.find( { applicant: id })
  .populate('applicant process')
  .select('rut process date  psychological technicalqualification logicalqualification comment status _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          interview: doc,
          request: {
            type: 'GET',
            description: 'To get interview by process',
            url: 'http:/localhost:3000/interview'
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

router.patch("/:interviewId", (req, res, next) => {
  const id = req.params.interviewId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Interview.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Interview updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/interview/" + id
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

router.put("/:interviewId", (req, res, next) => {
  const id = req.params.interviewId;
  Interview.updateOne (
      { _id : id },
      { $set : 
        { 
            date: req.body.date,
            applicant: req.body.applicant,
            process: req.body.process,
            psychological: req.body.psychological,
            technicalqualification: req.body.technicalqualification,
            logicalqualification: req.body.logicalqualification,
            comment: req.body.comment,
            status: req.body.status
        }
      }
  ).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Interview updated.",
        request: {
          type: "GET",
          url: "http://localhost:3000/interview/" + id
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

router.delete("/:interviewId", (req, res, next) => {
  const id = req.params.interviewId;
  Interview.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Interview deleted.",
        request: {
          type: "POST",
          description: "To create new Interview",
          url: "http://localhost:3000/Appliant/:InterviewId",
          body: {
            startdate: 'String',
            enddate: 'String',
            rut: 'String',
            process: 'Process',
            psychological: 'String',
            technicalqualification: 'String',
            logicalqualification: 'String',
            comment: 'String',
            status: 'String'
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

module.exports = router;
