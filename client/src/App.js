import React, { useState, useContext, useEffect } from 'react'

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import Header from './components/layout/header';
import Signin from './components/pages/signin';
import KandangH from './components/pages/kandangH';
import HewanDetail from './components/pages/hewanDetail';
import Admin from './components/pages/admin';
import Home from './components/pages/home';
import RPH from './components/pages/rph';
import SlaughterManager from './contracts/SlaughterManager.json';
import getWeb3 from './getWeb3';
import Web3 from 'web3';
import { ContractContext } from './context/contractContext';
import { UserContext } from './context/userContext';
import { LscountContext } from './context/lscountContext';
import { LivestocksContext } from './context/livestocks'



function App() {
  const [contract, setContract] = useState({
    web3: '',
    accounts: '',
    contracts: [],
    admin: '',
    isAdmin: false,
    done: false,
    livestock: {
      livestocks: [],
      race: [],
      weight: [],
      length: [],
      heartGrith: [],
      owner: [],
    },
    user: [],
    livestockCount: 0,
  })

  var a = contract;

  const [user, setUser] = useState([])

  const [livestockCounts, setLivestockCounts] = useState(0)

  const [cowsheds, setCowsheds] = useState([])

  const [livestocks, setLivestocks] = useState({
    livestocks: [],
    race: [],
    weight: [],
    length: [],
    heartGrith: [],
    owner: [],
  })

  const [weights, setWeights] = useState([])

  const [healths, setHealths] = useState([])

  const [test, setTest] = useState()

  // async function daftar(address, nama, role) {
  //   this.contracts.methods.registerUser(address, nama, role).send({from: this.accounts}).once('receipt');
  // }

  // daftarUser(address, nama, role){
  //   contracts.methods.registerUser(address, nama, role).send({from: accounts}).once('receipt', (receipt));
  // }



  const blockchain = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SlaughterManager.networks[networkId];
      const instance = new web3.eth.Contract(
        SlaughterManager.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const adminAcc = await instance.methods.admin().call();

      const checkAdmin = await instance.methods.isAdmin(accounts[0]).call();

      const auth = await instance.methods.users(accounts[0]).call();
      const usr = [];
      usr.push(auth);
      setUser(auth);
      // setContract({
      //   user: [auth],
      // });

      const globalLS = await instance.methods.globalLSCount().call();
      setLivestockCounts(globalLS);
      // setContract((values) => ({
      //   ...values,
      //   livestockCount: globalLS,
      // }));

      setContract({
        web3,
        accounts,
        contracts: instance,
        admin: adminAcc,
        isAdmin: checkAdmin,
        done: true,
        user: auth,
        livestockCount: globalLS,
      });


      // let ls = await instance.methods.livestocks(1).call()
      // console.log(ls)

      // for (var i = 0; i < globalLS; i++) {
      //   const livestock = await instance.methods.livestocks(i).call();
      //   setLivestocks((values) => ([...values, livestock]))
      //   // console.log("livestocks: ", livestocks)
      // }

      // for (var i = 0; i < globalLS; i++) {
      //   const livestockRace = await instance.methods.livestockRace(i).call();
      //   setLivestockRace((values) => [...values, livestockRace])
      //   // console.log("livestocks: ", livestocks)
      // }

      // var rama = [];
      // foreach(iterasi){
      //   const rama[iterasi] = Promise({
      //     function()
      //   })
      // }
      // Promise.all(rama)

      // let promises = [];

      // foreach(globalLS){
      //   const promises[globalLS] = promise({

      //   })
      // }
      // let sapi = [];

      const ls = []
      const rs = []
      const wg = []
      const lg = []
      const hg = []
      const ow = []


      var prom = [];
      const nomor = [0, 1, 2];
      nomor.forEach(n => {
        prom.push(new Promise(resolve => instance.methods.livestockRace(n).call()))
      })

      Promise.all(prom).then((value) => {
        ls.push(value)
      })
      console.log(ls)

      for (var i = 0; i < globalLS; i++) {
        const livestockRace = await instance.methods.livestockRace(i).call();
        rs.push(livestockRace);
        const livestock = await instance.methods.livestocks(i).call();
        ls.push(livestock);
        const lastWR = await instance.methods.getLastWR(i + 1).call();
        wg.push(lastWR._weight);
        lg.push(lastWR._length);
        hg.push(lastWR._heartGrith);
        const lsOwner = await instance.methods.livestockOwner(i).call();
        ow.push(lsOwner);

        // sapi.push({
        //   race: livestockRace,
        //   livestocks: livestock,
        //   weight: lastWR._weight,
        //   length: lastWR._length,
        //   heartGrith: lastWR._heartGrith,
        //   owner: lsOwner,
        // });



        // setLivestocks((values) => ({
        //   ...values,
        //   livestocks: [...values.livestocks, livestock],
        //   race: [...values.race, livestockRace],
        //   weight: [...values.weight, lastWR._weight],
        //   length: [...values.length, lastWR._length],
        //   heartGrith: [...values.heartGrith, lastWR._heartGrith],
        //   owner: [...values.owner, lsOwner],
        // }))
        // console.log("livestocks: ", livestocks)
      }

      a.admin = adminAcc;
      a.isAdmin = checkAdmin;
      a.livestockCount = globalLS;
      a.contract = instance;
      a.accounts = accounts[0];

      a.user = a.user.concat(usr);

      a.livestock.livestocks = a.livestock.livestocks.concat(ls);
      // a.livestock.race.concat(rs);
      // a.livestock.weight.concat(wg);
      // a.livestock.length.concat(lg);
      // a.livestock.heartGrith.concat(hg);
      // a.livestock.owner.concat(ow);

      // ...a,
      // livestock: {
      //   livestocks: [...values.livestocks, ls],
      //   race: [...values.race, rs],
      //   weight: [...values.weight, wg],
      //   length: [...values.length, lg],
      //   heartGrith: [...values.heartGrith, hg],
      //   owner: [...values.owner, ow],
      // }

      // setContract((values) => ({
      //   ...values,
      //   livestock: {
      //     livestocks: [...values.livestocks, ls],
      //     race: [...values.race, rs],
      //     weight: [...values.weight, wg],
      //     length: [...values.length, lg],
      //     heartGrith: [...values.heartGrith, hg],
      //     owner: [...values.owner, ow],
      //   }
      // }));

      console.log({
        x: a
      });

    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }

  useEffect(() => {
    blockchain();
    console.log({ a: contract })
  }, [])

  return (
    <div className="App">
      <Router>
        <ContractContext.Provider value={{ contract, setContract }}>
          <LscountContext.Provider value={{ livestockCounts, setLivestockCounts }}>
            <LivestocksContext.Provider value={{ livestocks, setLivestocks }}>
              <UserContext.Provider value={{ user, setUser }}>
                <Header /><br />
                {console.log(contract)}
                <Switch>
                  <Route exact path="/" component={Signin} />
                  <Route exact path="/kandang" component={KandangH} />
                  <Route exact path="/detail" component={HewanDetail} />
                  {
                    user.role == '0' || user.role == '1' ?
                      <Route exact path="/home" component={Home} /> : ''
                  }
                  {
                    user.role == '2' ?
                      <Route exact path="/rph" component={RPH} /> : ''
                  }
                  {
                    contract.isAdmin ?
                      <Route exact path="/admin" component={Admin} /> : ''
                  }
                </Switch>
              </UserContext.Provider>
            </LivestocksContext.Provider>
          </LscountContext.Provider>
        </ContractContext.Provider>
      </Router >
    </div >
  );
}

export default App;