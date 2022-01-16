import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'
import { ContractContext } from '../../../context/contractContext';
import AlertBox from '../../layout/alertBox';

export default function ProsesDaging(props) {
  const { contract, setContract } = useContext(ContractContext)

  const [alertBox, setAlertBox] = useState({
    show: false,
    variant: 'danger',
    head: '',
    body: '',
  })

  const [beefCounts, setBeefcounts] = useState(0)

  const [addressTo, setAddressTo] = useState('');

  const [selectHewan, setSelectHewan] = useState()
  const [viewHewan, setViewHewan] = useState({
    _id: '',
    weight: 0,
    length: 0,
    heartGrith: 0,
    dob: 0,
    gender: 0,
    race: 0,
    id: 0,
    sick: false,
    description: '',
    action: '',
    feedType: 'hijauan',
    feedAmount: 0,
  })

  const getBeefCounts = async () => {
    const beefCount = await contract.contracts.methods.beefCount().call()
    setBeefcounts(beefCount)
  }

  const handleAddressTo = (e) => {
    e.persist()

    setAddressTo(e.target.value)
  }

  const registerBeef = (_id, _lsId, _to, _age) => {
    contract.contracts.methods.registerBeef(_lsId, _to)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .post(`http://localhost:3001/slaughters/add/`, {
            addressTo: _to,
            id: parseInt(beefCounts) + 1,
            _livestock: _id,
            age: moment().diff(moment.unix(_age / 1000000), 'days'),
          })
          .then((res) => {
            console.log(res.data)
            setAlertBox({
              variant: 'success',
              head: 'Berhasil membuat proposal pemotongan sapi.',
              body: `Berhasil pembuatan prposal pemotongan sapi dengan id ${_lsId}, \nyang ditujukan untuk RPH dengan address ${_to}.`,
              show: true,
            })
          })
          .catch((err) => {
            setAlertBox({
              variant: 'danger',
              head: 'Error',
              body: '' + err,
              show: true,
            })
          })
        console.log(receipt)
      })
  }

  const getHewanDetail = (id) => {
    console.log(id)
    axios
      .get(`http://localhost:3001/livestocks/ls/${id}`)
      .then((res) => setViewHewan({
        weight: res.data.weight,
        length: res.data.length,
        heartGrith: res.data.heartGrith,
        id: res.data.id,
        gender: res.data.gender,
        race: res.data.race,
        dob: res.data.birth,
        _id: res.data._id
      }))
  }

  const getHewanSelect = () => {
    axios
      .get(`http://localhost:3001/livestocks/select/${contract.accounts}`)
      .then((res) => setSelectHewan(res.data))
  }

  const convertMoment = (dob) => {
    return moment().diff(moment.unix(dob / 1000000), 'days') + ' Hari'
  }

  useEffect(() => {
    if (contract.accounts[0]) {

      getHewanSelect()
      getBeefCounts()
    }
  }, [contract.contracts])
  return (
    <>
      <Form className="mt-5">
        <Form.Group as={Row} controlId="formDaging">
          <Form.Label column sm="4" className="text-right">
            id Hewan ternak
          </Form.Label>
          <Col sm="4">
            <Form.Control
              as="select"
              placeholder="hewan ternak"
              name="idHewan"
              onChange={(e) => getHewanDetail(e.target.value)}
              // onChange={handleBeratBadan}
              value={viewHewan.id}
            >
              <option hidden>Pilih Hewan</option>
              {props.selectHewan ?
                selectHewan.map((item) => {
                  return (<option value={item.id}>{item.name} - {item.earTag}</option>)
                }) : ''
              }
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDaging">
          <Form.Label className="text-right" column sm={4}>
            Berat
          </Form.Label>
          <Col sm={1}>
            <Form.Control className="text-right" plaintext readOnly placeholder="Berat" value={viewHewan.weight} />
          </Col>
          <Form.Label className="text-left" column sm={1}>
            kg
          </Form.Label>

          <Form.Label className="text-right" column sm={2}>
            Umur
          </Form.Label>
          <Col sm={2}>
            <Form.Control plaintext readOnly placeholder="Umur" value={convertMoment(viewHewan.dob)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDaging">
          <Form.Label className="text-right" column sm={4}>
            Lingkar Dada
          </Form.Label>
          <Col sm={1}>
            <Form.Control className="text-right" plaintext readOnly placeholder="Lingkar Dada" value={viewHewan.heartGrith} />
          </Col>
          <Form.Label className="text-left" column sm={1}>
            cm
          </Form.Label>

          <Form.Label className="text-right" column sm={2}>
            Kelamin
          </Form.Label>
          <Col sm={2}>
            <Form.Control plaintext readOnly placeholder="Kelamin" value={viewHewan.gender ? 'Jantan' : 'Betina'} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDaging">
          <Form.Label className="text-right" column sm={4}>
            Panjang
          </Form.Label>
          <Col sm={1}>
            <Form.Control className="text-right" plaintext readOnly placeholder="Panjang" value={viewHewan.length} />
          </Col>
          <Form.Label className="text-left" column sm={1}>
            cm
          </Form.Label>

          <Form.Label className="text-right" column sm={2}>
            Jenis Ras
          </Form.Label>
          <Col sm={2}>
            <Form.Control plaintext readOnly placeholder="Ras" value={props.ras.item[viewHewan.race].label} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDaging">
          <Form.Label className="text-right" column sm={4}>
            Address Pengirim
          </Form.Label>
          <Col sm={4}>
            <Form.Control type="text" readOnly placeholder="Address Pengirim" value={contract.accounts[0]} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDaging">
          <Form.Label className="text-right" column sm={4}>
            Address RPH
          </Form.Label>
          <Col sm={4}>
            <Form.Control type="text" placeholder="Address RPH" onChange={(e) => handleAddressTo(e)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 7, offset: 2 }}>
            <Button className="float-right" type="submit" onClick={(e) => { e.preventDefault(); registerBeef(viewHewan._id, viewHewan.id, addressTo, viewHewan.dob) }}>Kirim</Button>
          </Col>
        </Form.Group>
      </Form>
      <AlertBox body={alertBox.body} head={alertBox.head} variant={alertBox.variant} show={alertBox.show} />
    </>
  )
}