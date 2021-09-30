const router = require('express').Router();
let User = require('../models/user.model');

router.route('/process/').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  User.find({ status: { $in: ['2'] } }).skip(offset).limit(perPage)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/home/').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  User.find({ role: { $in: ['0', '1'] } }).skip(offset).limit(perPage)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:address').get((req, res) => {
  const _address = req.params.address;
  User.findOne({ address: _address })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const address = req.body.address;
  const name = req.body.name;
  const role = Number(req.body.role);
  const status = Number(2);
  const txHash = req.body.txHash;

  // res.json(address + ' a ' + name + ' b ' + role)

  const newUser = new User({
    address,
    name,
    role,
    status,
    txHash,
  });

  newUser
    .save()
    .then(() => res.json('User telah ditambahkan!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/activate/:address').patch((req, res) => {
  User.findOne({ address: req.params.address }).then((user) => {
    user.status = Number(1);
    user.txHash = req.body.txHash;

    user
      .save()
      .then(() => res.json('User telah ditambahkan di jaringan blockchain!'))
      .catch((err) => res.status(400).json('Error: ' + err))
  })
});

module.exports = router;