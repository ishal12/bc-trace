const router = require('express').Router();
let Livestock = require("../models/livestock.model");
let Feed = require("../models/feed.model")
let User = require("../models/user.model")

router.route('/:address').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Livestock.find({ address: req.params.address }).skip(offset).limit(perPage)
    .then((livestocks) => {
      Livestock.countDocuments({ address: req.params.address })
        .then((count) => res.json({ livestocks, count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/testing').get((req, res) => {
  Livestock.countDocuments({})
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/select/:address').get((req, res) => {
  Livestock.find({ address: req.params.address, alive: { $in: [true] } })
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err))
});

router.route('/ls/:id').get((req, res) => {
  Livestock.findOne({ id: req.params.id })
    .then((livestocks) => res.json(livestocks))
    .catch((err) => res.status(400).json('Error: ' + err))
});

router.route('/weightRecord/:id').patch((req, res) => {
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
  const id = req.params.id
  const feedType = req.body.feedType
  const amount = req.body.amount
  const measurement = req.body.measurement
  const actor = req.body.actor
  const _livestock = req.body._livestock

  const newFeed = new Feed({
    id,
    _livestock,
    feedType,
    amount,
    measurement,
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
  Feed.findOne({ id: req.params.id })
    .populate('_livestock')
    .then((feed) => res.json(feed))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/feedRecord/:id').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Feed.find({ id: req.params.id }).skip(offset).limit(perPage)
    .populate('_livestock')
    .then((feed) => {
      Feed.countDocuments({ id: req.params.id })
        .then((count) => res.json({ feed, count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/transfer/:id').patch((req, res) => {
  Livestock.findOne({ id: req.params.id })
    .then((livestocks) => {
      User.findOne({ address: livestocks.address })
        .then((user) => {
          user.totalLivestock--;

          user.save()
        })

      livestocks.address = req.body.addressTo;

      User.findOne({ address: req.body.addressTo })
        .then((user) => {
          user.totalLivestock++;

          user.save()
        })

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
    .then(() => {
      User.findOne({ address: address })
        .then((user) => {
          user.totalLivestock++;

          user.save()
        })
      res.json('Hewan Ternak telah ditambahkan!')
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Livestock.find().skip(offset).limit(perPage)
    .then((livestocks) => {
      Livestock.countDocuments({})
        .then((count) => res.json({ livestocks, count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
})

module.exports = router;