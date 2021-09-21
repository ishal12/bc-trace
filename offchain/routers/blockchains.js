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

router.get('/wRecord/:id', async (req, res) => {
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
    const deployedNetwork = SlaughterManager.networks[5777];
    var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
    var data = [];
    const id = parseInt(req.params.id - 1);
    try {
        const ls = await contract.methods.livestocks(id).call();;

        for (var i = ls.wrCount - 1; i >= 0; i--) {
            const weightR = await contract.methods.wRecords(id, i).call();
            const actor = await contract.methods.users(weightR.actor).call();
            data.push({ weightR, actor });
        }
        res.json(data);
    } catch (e) {
        res.json(e);
    }
})

router.get('/hRecord/:id', async (req, res) => {
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
    const deployedNetwork = SlaughterManager.networks[5777];
    var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
    var hr = [];
    const id = parseInt(req.params.id - 1);
    try {
        const ls = await contract.methods.livestocks(id).call();
        for (var i = ls.hrCount - 1; i >= 0; i--) {
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
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
    const deployedNetwork = SlaughterManager.networks[5777];
    var contract = new web3.eth.Contract(SlaughterManager.abi, deployedNetwork.address);
    var transfer = [];
    const id = parseInt(req.params.id - 1);
    try {
        const ls = await contract.methods.livestocks(id).call();

        for (var i = ls.transferCount - 1; i >= 0; i--) {
            const transferData = await contract.methods.livestockTransfers(id, i).call();
            const owner = await contract.methods.users(transferData).call();
            (owner.timeCreated != '0') ? transfer.push({ owner, key: i }) : console.log('Tidak masuk');

        }
        res.json(transfer);
    } catch (e) {
        res.json(e);
    }
})

module.exports = router;