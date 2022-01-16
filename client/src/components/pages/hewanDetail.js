import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext';
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../assets/css/pagination.css'
import TablePangan from './hewanDetail/tablePangan';
import TableTransfer from './hewanDetail/tableTransfer';
import TableKesehatan from './hewanDetail/tableKesehatan';
import TableBeratBadan from './hewanDetail/tableBeratBadan';
import AlertBox from '../layout/alertBox';

function BeratBadan(props) {
  const { contract, setContract } = useContext(ContractContext)
  const [tambahBB, setTambahBB] = useState({
    weight: '',
    heartGrith: '',
    length: '',
    id: props.idParams,
  })

  const handleTambahBB = (e) => {
    switch (e.target.name) {
      case 'weight':
        setTambahBB((values) => ({ ...values, weight: e.target.value }))
        break;
      case 'heartGrith':
        setTambahBB((values) => ({ ...values, heartGrith: e.target.value }))
        break;
      case 'length':
        setTambahBB((values) => ({ ...values, length: e.target.value }))
        break;

      default:
        break;
    }
  }

  const addWeightRecord = (_lsId, _weight, _length, _hearthGrith) => {
    contract.contracts.methods.registerWRecord(_lsId, _weight, _length, _hearthGrith, moment.unix(new Date())._i)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .patch(`http://localhost:3001/livestocks/weightRecord/${_lsId}`, {
            weight: _weight,
            length: _length,
            heartGrith: _hearthGrith,
          })
          .then((res) => {
            console.log(res.data)
            props.setAlertBox({
              variant: 'success',
              head: 'Berhasil menambahkan riwayat berat badan hewan',
              body: `Riwayat berat badan sapi dengan id ${_lsId}, berhasil ditambahkan.`,
              show: true,
            })
          })
          .catch((err) => {
            props.setAlertBox({
              variant: 'danger',
              head: 'Error',
              body: '' + err,
              show: true,
            })
          })
        console.log(receipt)
      })
  }

  return (
    <>
      <Modal.Body>
        <Form>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Berat
            </Form.Label>
            <Col sm={6}>
              <Form.Control type="number" name="weight" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Berat" value={tambahBB.weight} />
            </Col>
            <Form.Label className="text-left" column sm={2}>
              kg
            </Form.Label>
          </Form.Group>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Lingkar Dada
            </Form.Label>
            <Col sm={6}>
              <Form.Control type="number" name="heartGrith" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Lingkar Dada" value={tambahBB.heartGrith} />
            </Col>
            <Form.Label className="text-left" column sm={2}>
              cm
            </Form.Label>
          </Form.Group>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Panjang
            </Form.Label>
            <Col sm={6}>
              <Form.Control type="number" name="length" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Panjang" value={tambahBB.length} />
            </Col>
            <Form.Label className="text-left" column sm={2}>
              cm
            </Form.Label>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); addWeightRecord(tambahBB.id, tambahBB.weight, tambahBB.length, tambahBB.heartGrith) }} >
          Simpan
        </Button>
      </Modal.Footer>
    </>
  )
}

function Kesehatan(props) {
  const { contract, setContract } = useContext(ContractContext)
  const [kesehatan, setKesehatan] = useState({
    description: 'Sehat',
    action: '',
    sick: false,
    id: props.idParams,
  })

  const [switchSick, setSwitchSick] = useState({
    label: 'Sehat',
    sick: false,
    disabled: 'true',
  });

  const handleSwitchSick = (e) => {
    e.persist()

    if (e.target.checked) {
      setSwitchSick({
        label: 'Sakit',
        sick: true,
        disabled: false,
      })
      setKesehatan((values) => ({ ...values, sick: true, description: '' }))
    } else {
      setSwitchSick({
        label: 'Sehat',
        sick: false,
        disabled: true,
      })
      setKesehatan((values) => ({ ...values, sick: false, description: 'Sehat' }))
    }
  }

  const handleKesehatan = (e) => {
    switch (e.target.name) {
      case 'action':
        setKesehatan((values) => ({ ...values, action: e.target.value }));
        break;
      case 'description':
        setKesehatan((values) => ({ ...values, description: e.target.value }));
        break;
      default:
        break;
    }
  }

  const addHealthRecord = (_lsId, _description, _action, _sick) => {
    contract.contracts.methods.registerHRecord(_lsId, _description, _action, moment.unix(new Date())._i, _sick)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        console.log(receipt)
        props.setAlertBox({
          variant: 'success',
          head: 'Berhasil menambahkan riwayat kesehatan.',
          body: `Riwayat kesehatan sapi dengan id ${_lsId}, berhasil ditambahkan.\nStatus: ${(_sick ? 'Sakit' : 'Sehat')}\nKeterangan: ${_description}\nAksi: ${_action}`,
          show: true,
        })
      })
  }

  return (
    <>
      {
        console.log('kesehatan', kesehatan)
      }
      <Modal.Body>
        <Form>

          <Form.Group as={Row} controlId="formKesehatan">
            <Form.Label className="text-right" column sm={3}>
              Sakit
            </Form.Label>
            <Col sm={8}>
              <Form.Check
                type="switch"
                id="custom-switch"
                bsCustomPrefix="form-control border-0"
                checked={switchSick.sick}
                onClick={(e) => handleSwitchSick(e)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formKesehatan">
            <Form.Label className="text-right" column sm={3}>
              Nama Penyakit
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name="description" onChange={(e) => { handleKesehatan(e) }} placeholder="Nama Penyakit" disabled={switchSick.disabled} value={kesehatan.description} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formKesehatan">
            <Form.Label className="text-right" column sm={3}>
              Aksi
            </Form.Label>
            <Col sm={8}>
              <Form.Control as="textarea" name="action" onChange={(e) => { handleKesehatan(e) }} rows={3} placeholder="Deskripsikan yang dilakukan" required />
            </Col>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); addHealthRecord(kesehatan.id, kesehatan.description, kesehatan.action, kesehatan.sick) }} >
          Simpan
        </Button>
      </Modal.Footer>
    </>
  )
}

function Transfer(props) {
  const { contract, setContract } = useContext(ContractContext)

  const [transfer, setTransfer] = useState({
    addressFrom: contract.accounts[0],
    addressTo: '',
    id: props.idParams
  })

  const handleTransfer = (e) => {
    setTransfer((values) => ({
      ...values,
      addressTo: e.target.value
    }))
  }

  const transferLivestock = (_id, _from, _to) => {
    contract.contracts.methods.transfer(_id, _from, _to)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .patch(`http://localhost:3001/livestocks/transfer/${_id}`, {
            addressTo: _to,
          })
          .then((res) => {
            console.log(res.data)
            props.setAlertBox({
              variant: 'success',
              head: 'Berhasil mengirimkan hewan ternak',
              body: `Pengiriman hewan ternak dengan id ${_id} \ndari pemilik ${_from} \nke pemilik ${_to}\ntelah berhasil dikirim.`,
              show: true,
            })
          })
          .catch((err) => {
            props.setAlertBox({
              variant: 'danger',
              head: 'Error',
              body: '' + err,
              show: true,
            })
          })
        console.log(receipt)
      })
      .on('error', (error) => {
        props.setAlertBox({
          variant: 'danger',
          head: 'Error ' + error.code,
          body: `Alamat pengiriman salah`,
          show: true,
        })
      })
  }

  return (
    <>
      {console.log('transfer', transfer)}
      <Modal.Body>
        <Form>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Alamat Dari
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" readOnly name="addressFrom" placeholder="Alamat dari" value={transfer.addressFrom} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Alamat Ke
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name="addressTo" onChange={(e) => handleTransfer(e)} placeholder="Alamat Ke" value={transfer.addressTo} />
            </Col>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); transferLivestock(transfer.id, transfer.addressFrom, transfer.addressTo) }} >
          Simpan
        </Button>
      </Modal.Footer>
    </>
  )
}

function Pangan(props) {
  const { contract, setContract } = useContext(ContractContext)

  const [feed, setFeed] = useState({
    feedAmount: '',
    feedType: 'hijauan',
    feedMeasurement: 'kg',
    id: props.idParams,
    _id: props._idLs
  })

  const [feedType, setFeedType] = useState({
    item: [
      { enum: 'hijauan', label: 'Hijauan' },
      { enum: 'konsentrat', label: 'Konsenstrat' },
      { enum: 'tambahan', label: 'Tambahan' },
      { enum: 'vitamin', label: 'Vitamin' },
      { enum: 'obat', label: 'Obat' },
    ]
  })

  const [feedMeasurement, setFeedMeasurement] = useState({
    item: [
      { enum: 'ml', label: 'ml' },
      { enum: 'l', label: 'l' },
      { enum: 'g', label: 'g' },
      { enum: 'kg', label: 'kg' },
    ]
  })

  const handleFeed = (e) => {
    switch (e.target.name) {
      case 'feedType':
        setFeed((values) => ({ ...values, feedType: e.target.value }));
        break;
      case 'feedAmount':
        setFeed((values) => ({ ...values, feedAmount: e.target.value }));
        break;
      case 'feedMeasurement':
        setFeed((values) => ({ ...values, feedMeasurement: e.target.value }));
        break;
      default:
        break;
    }
  }

  const addFeedRecord = (_id, _lsId, _feedType, _feedAmount, _feedMeasurement) => {
    axios
      .post(`http://localhost:3001/livestocks/feedRecord/add/${_lsId}`, {
        id: _lsId,
        _livestock: _id,
        feedType: _feedType,
        amount: _feedAmount,
        measurement: _feedMeasurement,
        actor: contract.accounts[0],
      })
      .then((res) => {
        console.log(res.data)
        props.setAlertBox({
          variant: 'success',
          head: 'Berhasil menambahkan riwayat pangan',
          body: `Riwayat pangan untuk sapi dengan id ${_lsId}, berhasil ditambahkan.`,
          show: true,
        })
      })
      .catch((err) => {
        props.setAlertBox({
          variant: 'danger',
          head: 'Error',
          body: '' + err,
          show: true,
        })
      })
  }

  return (
    <>
      {console.log('feed', feed)}
      <Modal.Body>
        <Form>

          <Form.Group as={Row} controlId="formPangan">
            <Form.Label column sm="4" className="text-right">
              Jenis Pangan
            </Form.Label>
            <Col sm="4">
              <Form.Control
                as="select"
                placeholder="hewan ternak"
                name="feedType"
                onChange={(e) => handleFeed(e)}
                value={feed.feedType}
              >
                {feedType.item ?
                  feedType.item.map((item) => {
                    return (<option value={item.enum}>{item.label}</option>)
                  }) : ''
                }
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPangan">
            <Form.Label className="text-right" column sm={4}>
              Jumlah Pangan
            </Form.Label>
            <Col sm={4}>
              <Form.Control type="number" name="feedAmount" min={0} onChange={(e) => handleFeed(e)} placeholder="jumlah" value={feed.feedAmount} />
            </Col>
            <Col sm={3}>
              <Form.Control
                as="select"
                placeholder="hewan ternak"
                name="feedMeasurement"
                onChange={(e) => handleFeed(e)}
                value={feed.feedMeasurement}
              >
                {feedMeasurement.item ?
                  feedMeasurement.item.map((item) => {
                    return (<option value={item.enum}>{item.label}</option>)
                  }) : ''
                }
              </Form.Control>
            </Col>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); addFeedRecord(feed._id, feed.id, feed.feedType, feed.feedAmount, feed.feedMeasurement) }} >
          Simpan
        </Button>
      </Modal.Footer>
    </>
  )
}

function ModalComp(props) {

  return (
    <Modal show={props.show.view} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.show.label}</Modal.Title>
      </Modal.Header>
      {(props.show.modal === 'beratBadan') ? <BeratBadan idParams={props.idParams} handleClose={props.handleClose} setAlertBox={props.setAlertBox} /> : ''}
      {(props.show.modal === 'kesehatan') ? <Kesehatan idParams={props.idParams} handleClose={props.handleClose} setAlertBox={props.setAlertBox} /> : ''}
      {(props.show.modal === 'transfer') ? <Transfer idParams={props.idParams} handleClose={props.handleClose} setAlertBox={props.setAlertBox} /> : ''}
      {(props.show.modal === 'pangan') ? <Pangan idParams={props.idParams} _idLs={props._idLs} handleClose={props.handleClose} setAlertBox={props.setAlertBox} /> : ''}
    </Modal >
  )
}

export default function HewanDetail() {
  const { contract, setContract } = useContext(ContractContext)
  const { id } = useParams()
  const [objectId, setObjectId] = useState({
    _id: '',
    name: '',
  })

  const [alertBox, setAlertBox] = useState({
    show: false,
    variant: 'danger',
    head: '',
    body: '',
  })

  const [show, setShow] = useState({
    view: false,
    label: '',
    modal: '',
  });
  const handleClose = () => setShow({
    view: false,
    label: '',
    modal: '',
  });
  const handleShow = (e) => {
    switch (e.target.value) {
      case 'beratBadan':
        setShow({ view: true, label: 'Tambah Berat Badan', modal: 'beratBadan' })
        break;
      case 'kesehatan':
        setShow({ view: true, label: 'Tambah Pengecekan Kesehatan', modal: 'kesehatan' })
        break;
      case 'transfer':
        setShow({ view: true, label: 'Transfer Kepemilikan Hewan', modal: 'transfer' })
        break;
      case 'pangan':
        setShow({ view: true, label: 'Tambah Pangan', modal: 'pangan' })
        break;
      default:
        break;
    }
  };

  const [livestock, setLivestock] = useState({
    ls: {
      lsId: '',
      fatherId: '',
      motherId: '',
      birthDay: '',
      earTag: '',
      gender: false,
      wrCount: '',
      hrCount: '',
      transferCount: '',
      stateCount: '',
      status: '',
    },
    owner: '',
    race: ''
  });

  const [state, setState] = useState(0)
  const [stateType, setStateType] = useState([
    'Farmer',
    'Stocker',
    'Butcher',
    'Beef'
  ])
  const [raceType, setRaceType] = useState([
    'Bali',
    'Madura',
    'Brahman',
    'PO',
    'Brahman Cross',
    'Ongole',
    'Aceh',
  ])

  const [owner, setOwner] = useState()

  const [pagination, setPagination] = useState({
    offset: 0,
    perPage: 2,
    pageCount: 100 / 2,
    currentPage: 1
  })

  const convertMoment = (dob) => {
    return moment().diff(moment.unix(dob / 1000000), 'days') + ' Hari'
  }

  const convertMomentDate = (date) => {
    return moment.unix(date / 1000000).format("MMMM Do YYYY, h:mm a")
  }

  const getLivestock = () => {
    axios
      .get(`http://localhost:3001/blockchains/livestock/${id}`)
      .then((res) => setLivestock({
        ls: {
          lsId: res.data.ls.lsId,
          fatherId: res.data.ls.fatherId,
          motherId: res.data.ls.motherId,
          birthDay: res.data.ls.birthDay,
          earTag: res.data.ls.earTag,
          gender: res.data.ls.gender,
          wrCount: res.data.ls.wrCount,
          hrCount: res.data.ls.hrCount,
          transferCount: res.data.ls.transferCount,
          stateCount: res.data.ls.stateCount,
          status: res.data.ls.status,
        },
        owner: res.data.owner,
        race: res.data.race,
      }))

    axios
      .get(`http://localhost:3001/blockchains/state/${id}`)
      .then((res) => setState(res.data))
  }

  const getObjectId = () => {
    axios
      .get(`http://localhost:3001/livestocks/ls/${id}`)
      .then((res) => setObjectId(res.data))
  }

  useEffect(() => {
    if (contract.accounts[0]) {

    }
  }, [contract])

  useEffect(() => {
    getLivestock()
    getObjectId()
  }, [])

  return (
    <>
      <ModalComp show={show} idParams={id} _idLs={objectId._id} handleClose={handleClose} setAlertBox={setAlertBox} />
      <Row className="Justify-content-md-center" className="mb-5 pt-5">
        <Col xl={1}></Col>
        <Col xl={8}>
          <>
            <h1>
              {objectId.name}
            </h1>
            <h6 className="d-inline text-muted"># {livestock.ls.lsId}</h6>
            <h6 className="d-inline text-muted pl-3"># {(livestock.ls.earTag) ? web3.utils.hexToUtf8(livestock.ls.earTag) : ''}</h6>
            <h6 className="d-inline text-muted pl-3"># {convertMoment(livestock.ls.birthDay)}</h6>
            <h6 className="d-inline text-muted pl-3"># {(livestock.ls.gender) ? 'Jantan' : 'Betina'}</h6>
            <h6 className="d-inline text-muted pl-3"># {raceType[livestock.race]}</h6>
            <h6 className="d-inline text-muted pl-3"># {(livestock.ls.status) ? 'Hidup' : 'Mati'}</h6>
            <h6 className="d-inline text-muted pl-3"># {stateType[state[livestock.ls.stateCount - 1]]}</h6>
          </>
        </Col>
        <Col xl={2}>
          <h4 as={Row} className="text-right">
            {livestock.owner.name}
          </h4>
          <h6 as={Row} className="text-right text-muted">
            Owner
          </h6>
        </Col>
      </Row>
      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Berat Badan
          </h3>
          <Button className="d-inline float-right mb-3" value="beratBadan" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <TableBeratBadan id={id} convertMomentDate={convertMomentDate} />
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Kesehatan
          </h3>
          <Button className="d-inline float-right mb-3" value="kesehatan" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <TableKesehatan id={id} convertMomentDate={convertMomentDate} />
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Transfer
          </h3>
          <Button className="d-inline float-right mb-3" value="transfer" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <TableTransfer id={id} stateType={stateType} />
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Pangan
          </h3>
          <Button className="d-inline float-right mb-3" value="pangan" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <TablePangan id={id} />
        </Col>
      </Row>
      <AlertBox body={alertBox.body} head={alertBox.head} variant={alertBox.variant} show={alertBox.show} />
    </>
  )
}
