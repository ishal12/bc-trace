const router = require('express').Router();
const { parse } = require('dotenv');
var Web3 = require('web3');
const SlaughterManager = require('../../client/src/contracts/SlaughterManager.json');
let Feed = require('../models/feed.model');

router.get('/livestock/:id', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();
    const ow = await contract.methods.livestockOwner(id).call();
    const rs = await contract.methods.livestockRace(id).call();
    const user = await contract.methods.users(ow).call()
    res.json({ ls, race: rs, owner: user });
  } catch (e) {
    res.json(e);
  }
})

router.get('/cowshed/:address', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  const address = req.params.address;
  try {
    const cowshed = await contract.methods.livestockCounts(address).call();
    res.json(cowshed);
  } catch (e) {
    res.json(e);
  }
})

router.get('/wRecord/:id', async (req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var record = [];
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();
    const count = ls.wrCount;
    var offsetFor = ls.wrCount - (1 + offset);
    var perPageFor = offsetFor - (perPage - 1);

    if (perPageFor < 0) {
      perPageFor = 0;
    }

    for (var i = offsetFor; i >= perPageFor; i--) {
      const weightR = await contract.methods.wRecords(id, i).call();
      const actor = await contract.methods.users(weightR.actor).call();
      record.push({ weightR, actor });
    }
    res.json({ record, count });
  } catch (e) {
    res.json(e);
  }
})

router.get('/hRecord/:id', async (req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var hr = [];
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();
    const count = ls.hrCount;
    var offsetFor = ls.hrCount - (1 + offset);
    var perPageFor = offsetFor - (perPage - 1);

    if (perPageFor < 0) {
      perPageFor = 0;
    }

    for (var i = offsetFor; i >= perPageFor; i--) {
      const healthR = await contract.methods.hRecords(id, i).call();
      const actor = await contract.methods.users(healthR.actor).call();
      hr.push({ healthR, actor });
    }
    res.json({ hr, count });
  } catch (e) {
    res.json(e);
  }
})

router.get('/hRecords/:id', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var hr = [];
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();
    var offsetFor = ls.hrCount - (1 + 0);
    var perPageFor = offsetFor - (perPage - 1);

    if (perPageFor < 0) {
      perPageFor = 0;
    }

    for (var i = offsetFor; i >= 0; i--) {
      const healthR = await contract.methods.hRecords(id, i).call();
      const actor = await contract.methods.users(healthR.actor).call();
      hr.push({ healthR, actor });
    }
    res.json(hr);
  } catch (e) {
    res.json(e);
  }
})

router.get('/state/:id', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var state = [];
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();

    for (var i = 0; i < ls.stateCount; i++) {
      const stateData = await contract.methods.livestockStates(id, i).call();
      state.push(stateData);
    }
    res.json(state);
  } catch (e) {
    res.json(e);
  }
})

router.get('/transfer/:id', async (req, res) => {
  const offset = Number(req.query.offset);
  const perPage = Number(req.query.perPage);

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var transfer = [];
  const id = parseInt(req.params.id - 1);
  try {
    const ls = await contract.methods.livestocks(id).call();
    const count = ls.transferCount;
    var offsetFor = ls.transferCount - (1 + offset);
    var perPageFor = offsetFor - (perPage - 1);

    if (perPageFor < 0) {
      perPageFor = 0;
    }

    for (var i = offsetFor; i >= perPageFor; i--) {
      const transferData = await contract.methods.livestockTransfers(id, i).call();
      const owner = await contract.methods.users(transferData).call();
      (owner.timeCreated != '0') ? transfer.push({ owner, key: i }) : console.log('Tidak masuk');

    }
    res.json({ transfer, count });
  } catch (e) {
    res.json(e);
  }
})

router.get('/slaughter/:beefId', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  var transfer = [];
  const beefId = parseInt(req.params.beefId - 1);
  try {
    const beef = await contract.methods.beefs(beefId).call();
    res.json(beef);
  } catch (e) {
    res.json(e);
  }
})

router.get('/user/:id', async (req, res) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const deployedNetwork = SlaughterManager.networks[5777];
  var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
  try {
    const shed = await contract.methods.beefs(req.params.id).call();
    res.json(shed);
  } catch (e) {
    res.json(e);
  }
})

module.exports = router;