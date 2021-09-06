const router = require('express').Router();
let Livestock = require("../models/livestock.model");
let Slaughter = require("../models/slaughter.model");

router.route('/add/').post((req, res) => {
    const addressRPH = req.body.addressTo;
    const beefId = req.body.id;
    const _livestock = req.body._livestock;
    const age = req.body.age;
    const status = 'diproses';

    const newBeef = new Slaughter({
        addressRPH,
        beefId,
        _livestock,
        age,
        status
    });

    newBeef
        .save()
        .then(() => res.json('Hewan Ternak telah dikirim ke RPH'))
        .catch((err) => {
            res.status(400).json('Error: ' + err)
        })
})

module.exports = router;