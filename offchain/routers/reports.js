const router = require('express').Router();
var Web3 = require('web3');
var Promise = require('promise')
const SlaughterManager = require('../../client/src/contracts/SlaughterManager.json');
let Livestock = require('../models/livestock.model');
let Slaughters = require('../models/slaughter.model');
let Transfer = require('../models/transfer.model');
var moment = require('moment');

router.route('/livestock/total/alive').get((req, res) => {
  Livestock.find({ alive: { $in: [true] } })
    .then((livestocks) => {
      Livestock.countDocuments({ alive: { $in: [true] } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/livestock/total/alive/today').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  Livestock.find({ alive: { $in: [true] }, createdAt: { $gte: startOfToday } })
    .then((livestocks) => {
      Livestock.countDocuments({ alive: { $in: [true] }, createdAt: { $gte: startOfToday } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/livestock/total/dead').get((req, res) => {
  Livestock.find({ alive: { $in: [false] } })
    .then((livestocks) => {
      Livestock.countDocuments({ alive: { $in: [false] } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/livestock/total/dead/today').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  Livestock.find({ alive: { $in: [false] }, createdAt: { $gte: startOfToday } })
    .then((livestocks) => {
      Livestock.countDocuments({ alive: { $in: [false] }, createdAt: { $gte: startOfToday } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/livestock/total').get((req, res) => {
  Livestock.find({})
    .then((livestocks) => {
      Livestock.countDocuments({})
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/livestock/total/today').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  Livestock.find({ createdAt: { $gte: startOfToday } })
    .then((livestocks) => {
      Livestock.countDocuments({ createdAt: { $gte: startOfToday } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/slaughter/total').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Slaughters.find({ status: { $in: ['diterima', 'postmortem', 'packing'] } }).skip(offset).limit(perPage)
    .populate('_livestock')
    .then((slaughters) => {
      Slaughters.countDocuments({ status: { $in: ['diterima', 'postmortem', 'packing'] } })
        .then((count) => res.json({ slaughters, count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/slaughter/total/today').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  Slaughters.find({ status: { $in: ['diterima', 'postmortem', 'packing'] }, createdAt: { $gte: startOfToday } })
    .then((slaughters) => {
      Slaughters.countDocuments({ status: { $in: ['diterima', 'postmortem', 'packing'] }, createdAt: { $gte: startOfToday } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/transfer/total').get((req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  Transfer.find({}).sort({ '_id': -1 }).skip(offset).limit(perPage)
    .populate('_livestock')
    .then((transfers) => {
      Transfer.countDocuments({})
        .then((count) => res.json({ transfers, count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/transfer/total/today').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  Transfer.find({ createdAt: { $gte: startOfToday } })
    .then((transfers) => {
      Transfer.countDocuments({ createdAt: { $gte: startOfToday } })
        .then((count) => res.json({ count }));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});


router.route('/dashboard').get((req, res) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var cowAlive = 0
  var cowAliveU = 0
  var cowDead = 0
  var cowDeadU = 0
  var cowTotal = 0
  var cowTotalU = 0
  var transfer = 0
  var transferU = 0
  var slaughter = 0
  var slaughterU = 0

  Livestock.countDocuments({ alive: { $in: [true] } })
    .then((alive) => {
      Livestock.countDocuments({ alive: { $in: [true] }, createdAt: { $gte: startOfToday } })
        .then((aliveU) => {
          Livestock.countDocuments({ alive: { $in: [false] } })
            .then((dead) => {
              Livestock.countDocuments({ alive: { $in: [false] }, createdAt: { $gte: startOfToday } })
                .then((deadU) => {
                  Livestock.countDocuments({})
                    .then((total) => {
                      Livestock.countDocuments({ createdAt: { $gte: startOfToday } })
                        .then((totalU) => {
                          Slaughters.countDocuments({ status: { $in: ['diterima', 'postmortem', 'packing'] } })
                            .then((slaughter) => {
                              Slaughters.countDocuments({ status: { $in: ['diterima', 'postmortem', 'packing'] }, createdAt: { $gte: startOfToday } })
                                .then((slaughterU) => {
                                  Transfer.countDocuments({})
                                    .then((transfer) => {
                                      Transfer.countDocuments({ createdAt: { $gte: startOfToday } })
                                        .then((transferU) => {
                                          res.json({
                                            alive,
                                            aliveU,
                                            dead,
                                            deadU,
                                            total,
                                            totalU,
                                            slaughter,
                                            slaughterU,
                                            transfer,
                                            transferU
                                          })
                                        })
                                        .catch((err) => res.status(400).json('Error: ' + err));
                                    })
                                    .catch((err) => res.status(400).json('Error: ' + err));
                                })
                                .catch((err) => res.status(400).json('Error: ' + err));
                            })
                            .catch((err) => res.status(400).json('Error: ' + err));
                        })
                        .catch((err) => res.status(400).json('Error: ' + err));
                    })
                    .catch((err) => res.status(400).json('Error: ' + err));
                })
                .catch((err) => res.status(400).json('Error: ' + err));
            })
            .catch((err) => res.status(400).json('Error: ' + err));
        })
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));

})



const convertMomentDate = (date) => {
  return moment.unix(date / 1000000).format("MMMM Do YYYY, h:mm a")
}


/** REPORT WEIGHT WITH LINE CHART
 *    Maybe can use blockchain as a report
 *    example, take last 10 data and make line chart
 */
router.get('/blockchain/wRecord/line/:id', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var weight = [];
  var date = [];
  const id = parseInt(req.params.id - 1);
  moment.locale('id');
  try {
    const ls = await contract.methods.livestocks(id).call();
    const count = ls.wrCount;
    var takeData = 0;
    var last = 5;
    var countOut = last;

    if (count < last) {
      takeData = 0;
      countOut = count
    } else if (count >= last) {
      takeData = count - last;
    }

    // take weight only form newest record
    for (var i = takeData; i <= (count - 1); i++) {
      const weightR = await contract.methods.wRecords(id, i).call();
      const data = weightR.weight;
      const x = weightR.timeRecord;
      weight.push(data);
      date.push(convertMomentDate(x));
    }
    res.json({ weight, date, countOut });
  } catch (e) {
    res.json(e);
  }
})

module.exports = router;
