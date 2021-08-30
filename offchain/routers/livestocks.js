const router = require('express').Router();
let Livestock = require("../models/livestock.model");

router.route('/:address').get((req, res) => {
  console.log(req.query.paginate);
  const paginate = Number(req.query.paginate);
  Livestock.find({ address: req.params.address }).skip(paginate).limit(2)
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const weight = Number(req.body.weight);
  const length = Number(req.body.length);
  const heartGrith = Number(req.body.heartGrith);
  const gender = req.body.gender;
  const birth = Number(req.body.birth);
  const race = Number(req.body.race);
  const alive = true;
  const address = req.body.address;

  // res.json(address + ' a ' + name + ' b ' + role)

  const newLS = new Livestock({
    id,
    name,
    weight,
    length,
    heartGrith,
    gender,
    birth,
    race,
    alive,
    address,
  });

  newLS
    .save()
    .then(() => res.json('Hewan Ternak telah ditambahkan!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;