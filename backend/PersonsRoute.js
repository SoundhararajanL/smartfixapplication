const express = require('express');
const router = express.Router();
const Persons = require('./PersonsSchema');

router.post('/signup', async (req, res) => {
  try {
    const postPerson = new Persons({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const savePersons = await postPerson.save();

    res.status(200).json(savePersons);
  } catch (err) {
    res.status(500).json({ error: 'Error occurred while registering user!' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const person = await Persons.findOne({ username });

    if (!person) {
      res.status(400).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    const validPassword = await person.comparePassword(password);

    if (!validPassword) {
      res.status(400).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Error occurred while logging in!' });
  }
});

module.exports = router;
