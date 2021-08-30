const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const address = req.body.address;
  const name = req.body.name;
  const role = Number(req.body.role);
  const status = Number(2);

  // res.json(address + ' a ' + name + ' b ' + role)

  const newUser = new User({
    address,
    name,
    role,
    status,
  });

  newUser
    .save()
    .then(() => res.json('User telah ditambahkan!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/activate/:address').patch((req, res) => {
  User.findOne({ address: req.params.address }).then((user) => {
    user.status = Number(1);

    user
      .save()
      .then(() => res.json('User telah ditambahkan di jaringan blockchain!'))
      .catch((err) => res.status(400).json('Error: ' + err))
  })
});

module.exports = router;