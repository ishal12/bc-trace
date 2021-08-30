const router = require('express').Router();
let Feed = require('../models/feed.model');

router.route('/:id/:address').post((req, res) => {
  Feed.find({
    id: req.params.id,
    actor: req.params.address
  })
    .then((feeds) => res.json(feeds))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const id = req.body.address;
  const foodType = req.body.name;
  const amount = req.body.amount;
  const actor = req.body.actor;

  const newFood = new Feed({
    id,
    foodType,
    amount,
    actor,
  });

  newFood
    .save()
    .then(() => res.json('Pangan telah ditambahkan!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;