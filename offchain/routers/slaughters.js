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

router.route('/:address').get((req, res) => {
    const offset = Number(req.query.offset);
    const perPage = Number(req.query.perPage);

    Slaughter.find({ addressRPH: req.params.address }).skip(offset).limit(perPage)
        .populate('_livestock')
        .then((slaughter) => res.json(slaughter))
        .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/ante').patch((req, res) => {
    const beefId = req.body.beefId;
    const id = req.body.id;
    const jenisAlasan = req.body.jenisAlasan;
    const alasan = req.body.alasan;
    const approval = req.body.approval;
    console.log(approval)
    Slaughter.findOne({ _id: id })
        .then((slaughter) => {
            slaughter.txAnte = req.body.txAnte;

            if (approval) {
                slaughter.status = 'antemortem';
            } else {
                slaughter.status = jenisAlasan;
            }

            slaughter
                .save()
                .then(() => {
                    if (approval) {
                        res.json(`BeefId ${beefId} telah melewati pengecekan Antemortem.`);
                    } else {
                        res.json(`BeefId ${beefId} tidak dapat melewati pengecekan Antemortem dikarenakan ${alasan}.`);
                    }
                })
                .catch((err) => res.status(400).json('Error: ' + err));
        })
})

router.route('/post').patch((req, res) => {
    const beefId = req.body.beefId;
    const id = req.body.id;
    const jenisAlasan = req.body.jenisAlasan;
    const alasan = req.body.alasan;
    const approval = req.body.approval;
    console.log(approval)
    Slaughter.findOne({ _id: id })
        .then((slaughter) => {
            Livestock.findOne({ _id: slaughter._livestock })
                .then((livestock) => {
                    livestock.alive = false

                    livestock
                        .save()
                        .then(() => res.json(`Livestock dengan id ${livestock.id} sudah disembelih.`))
                        .catch((err) => res.status(400).json('Error: ' + err));
                })

            slaughter.txPost = req.body.txPost;

            if (approval) {
                slaughter.status = 'postmortem';
            } else {
                slaughter.status = jenisAlasan;
            }

            slaughter
                .save()
                .then(() => {
                    if (approval) {
                        res.json(`BeefId ${beefId} telah melewati pengecekan Postmortem.`);
                    } else {
                        res.json(`BeefId ${beefId} tidak dapat melewati pengecekan Postmortem dikarenakan ${alasan}.`);
                    }
                })
                .catch((err) => res.status(400).json('Error: ' + err));
        })
})

module.exports = router;