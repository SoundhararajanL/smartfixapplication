const express = require("express");
const router = express.Router();
const Persons = require("./PersonsSchema");

// router.get("/", (req, res) => {
//   res.json("Router is working");
// });

// //postpersons
// router.post("/", async (req, res) => {
//   try {
//     const postPerson = await new Persons({
//       Name: req.body.Name,
//       Age: req.body.Age,
//     });
//     const savePersons = await postPerson.save();
//     res.status(200).json(savePersons);
//     // res.status(200);
//   } catch (err) {
//     res.json({ err: err });
//   }
// });

// //getpersons
// router.get("/", async (req, res) => {
//   try {
//     const getAll = await Persons.find();
//     res.status(200).json(getAll);
//   } catch (err) {
//     res.json({ err: err });
//   }
// });

// //getbyid
// router.get("/:id", async (req, res) => {
//   try {
//     const getById = await Persons.findById(req.params.id);
//     res.status(200).json(getById);
//   } catch (err) {
//     res.json({ err: err });
//   }
// });

//updatepersons
// router.put("/:id", async (req, res) => {
//   try {
//     const updPersons = await Persons.updateOne(
//       { _id: req.params.id },
//       { $set: { Name: req.body.Name, Age: req.body.Age } }
//     );
//     res.status(200).json(updPersons);
//   } catch (err) {
//     res.json({ err: err });
//   }
// });

//deletepersons
router.delete("/:id", async (req, res) => {
  try {
    const delPersons = await Persons.remove({ _id: req.params.id });
    res.status(200).json(delPersons);
  } catch (err) {
    res.json({ err: err });
  }
});

module.exports = router;
