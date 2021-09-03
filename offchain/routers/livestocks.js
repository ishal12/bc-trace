const router = require('express').Router();
let Livestock = require("../models/livestock.model");
let Feed = require("../models/feed.model")

router.route('/:address').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Livestock.find({ address: req.params.address }).skip(offset).limit(perPage)
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/select/:address').get((req, res) => {
  Livestock.find({ address: req.params.address })
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err))
});

router.route('/ls/:id').get((req, res) => {
  console.log(req.params.id)
  Livestock.findOne({ id: req.params.id })
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err))
});

router.route('/weightRecord/:id').patch((req, res) => {
  console.log(req.params.id)
  Livestock.findOne({ id: req.params.id })
    .then((livestocks) => {
      livestocks.weight = req.body.weight;
      livestocks.length = req.body.length;
      livestocks.heartGrith = req.body.heartGrith;

      livestocks
        .save()
        .then(() => res.json('Berat badan hewan telah diubah'))
        .catch((err) => res.status(400).json('Error: ' + err))
    })
});

router.route('/feedRecord/add/:id').post((req, res) => {
  console.log(req.params.id)
  // BELOM DIAPA APAIN
  // const _livestock = req.body._livestock
  const id = req.params.id
  const feedType = req.body.feedType
  const amount = req.body.amount
  const actor = req.body.actor
  const _livestock = req.body._livestock

  const newFeed = new Feed({
    id,
    _livestock,
    feedType,
    amount,
    actor,
  })
  console.log(newFeed)
  newFeed
    .save()
    .then(() => res.json('Pakan telah ditambahkan'))
    .catch((err) => {
      res.status(400).json('Error: ' + err)
    })
});

router.route('/feedRecord/view/:id').get((req, res) => {
  console.log(req.params.id)
  Feed.findOne({ id: req.params.id })
    .populate('_livestock')
    .then((feed) => res.json(feed))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/transfer/:id').patch((req, res) => {
  console.log(req.params.id)
  Livestock.findOne({ id: req.params.id })
    .then((livestocks) => {
      livestocks.address = req.body.addressTo;

      livestocks
        .save()
        .then(() => res.json('Kepemilikan berhasil dipindahkan'))
        .catch((err) => res.status(400).json('Error: ' + err))
    })
});

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const earTag = req.body.earTag;
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
    earTag,
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