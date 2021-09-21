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
          .then((res) => console.log(res.data))
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
            <Col sm={8}>
              <Form.Control type="number" name="weight" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Berat" value={tambahBB.weight} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Lingkar Dada
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="number" name="heartGrith" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Lingkar Dada" value={tambahBB.heartGrith} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formBeratBadan">
            <Form.Label className="text-right" column sm={3}>
              Panjang
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="number" name="length" min={0} onChange={(e) => handleTambahBB(e)} placeholder="Panjang" value={tambahBB.length} />
            </Col>
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
      setKesehatan((values) => ({ ...values, sick: true }))
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
          .then((res) => console.log(res.data))
        console.log(receipt)
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

  const handleFeed = (e) => {
    switch (e.target.name) {
      case 'feedType':
        setFeed((values) => ({ ...values, feedType: e.target.value }));
        break;
      case 'feedAmount':
        setFeed((values) => ({ ...values, feedAmount: e.target.value }));
        break;
      default:
        break;
    }
  }

  const addFeedRecord = (_id, _lsId, _feedType, _feedAmount) => {
    axios
      .post(`http://localhost:3001/livestocks/feedRecord/add/${_lsId}`, {
        id: _lsId,
        _livestock: _id,
        feedType: _feedType,
        amount: _feedAmount,
        actor: contract.accounts[0],
      })
      .then((res) => console.log(res.data))
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
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); addFeedRecord(feed._id, feed.id, feed.feedType, feed.feedAmount) }} >
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
      {(props.show.modal === 'beratBadan') ? <BeratBadan idParams={props.idParams} handleClose={props.handleClose} /> : ''}
      {(props.show.modal === 'kesehatan') ? <Kesehatan idParams={props.idParams} handleClose={props.handleClose} /> : ''}
      {(props.show.modal === 'transfer') ? <Transfer idParams={props.idParams} handleClose={props.handleClose} /> : ''}
      {(props.show.modal === 'pangan') ? <Pangan idParams={props.idParams} _idLs={props._idLs} handleClose={props.handleClose} /> : ''}
    </Modal >
  )
}

export default function HewanDetail() {
  const { contract, setContract } = useContext(ContractContext)
  const { id } = useParams()
  const [objectId, setObjectId] = useState({
    _id: ''
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
    'Butcher'
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
  const [wRecord, setWRecord] = useState([{
    weightR: {
      actor: '',
      lsId: '',
      weight: '',
      heartGrith: '',
      length: '',
      timeRecord: '',
    },
    actor: {
      userAddress: '',
      name: '',
      role: '',
    }
  }])
  const [hRecord, setHRecord] = useState([{
    healthR: {
      actor: '',
      lsId: '',
      description: '0x0',
      action: '0x0',
      timeRecord: '',
    },
    actor: {
      userAddress: '',
      name: '',
      role: '',
    }
  }])
  const [transfer, setTransfer] = useState([{
    owner: {
      userAddress: '',
      name: '',
      role: '',
    },
    key: ''
  }])
  const [feed, setFeed] = useState([{
    feedType: '',
    amount: '',
    actor: '',
    createdAt: ''
  }])

  const [owner, setOwner] = useState()

  const [pagination, setPagination] = useState({
    offset: 0,
    perPage: 2,
    pageCount: 100 / 2,
    currentPage: 1
  })

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    const offset = (selectedPage * pagination.perPage) - pagination.perPage;

    setPagination({
      ...pagination,
      currentPage: selectedPage,
      offset: offset
    }, () => {
      // getHewan();
    });
  }

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

  const getWRecord = () => {
    axios
      .get(`http://localhost:3001/blockchains/wRecord/${id}`)
      .then((res) => setWRecord(res.data))
  }

  const getHRecord = () => {
    axios
      .get(`http://localhost:3001/blockchains/hRecord/${id}`)
      .then((res) => setHRecord(res.data))
  }

  const getTransfer = () => {
    axios
      .get(`http://localhost:3001/blockchains/transfer/${id}`)
      .then((res) => setTransfer(res.data))
  }

  const getFeed = () => {
    axios
      .get(`http://localhost:3001/livestocks/feedRecord/${id}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setFeed(res.data))
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
    getWRecord()
    getHRecord()
    getTransfer()
    getFeed()
    getObjectId()
  }, [])

  return (
    <>
      <ModalComp show={show} idParams={id} _idLs={objectId._id} handleClose={handleClose}></ModalComp>
      <Row className="Justify-content-md-center" className="mb-5 pt-5">
        <Col xl={1}></Col>
        <Col xl={8}>
          <>
            <h1>
              {(livestock.ls.earTag) ? web3.utils.hexToUtf8(livestock.ls.earTag) : ''}
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tamggal</th>
                <th>Berat</th>
                <th>Lingkar Dada</th>
                <th>Panjang</th>
                <th>Penulis</th>
              </tr>
            </thead>
            <tbody>
              {(wRecord.length != 0) ? wRecord.map((item) => {
                return (
                  <tr>
                    <td>{convertMomentDate(item.weightR.timeRecord)}</td>
                    <td>{item.weightR.weight}</td>
                    <td>{item.weightR.heartGrith}</td>
                    <td>{item.weightR.length}</td>
                    <td>{item.actor.name}</td>
                  </tr>
                )
              }) : <tr><td colSpan={5}>Tidak ada Record</td></tr>}
            </tbody>
          </Table>
          <Pagination className="">
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Kesehatan
          </h3>
          <Button className="d-inline float-right mb-3" value="kesehatan" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
                <th>Sehat</th>
                <th>Penulis</th>
              </tr>
            </thead>
            <tbody>
              {(hRecord.length != 0) ? hRecord.map((item) => {
                return (
                  <tr>
                    <td>{convertMomentDate(item.healthR.timeRecord)}</td>
                    <td>{web3.utils.hexToUtf8(item.healthR.description)}</td>
                    <td>{web3.utils.hexToUtf8(item.healthR.action)}</td>
                    <td>{(item.healthR.sick) ? 'Sakit' : 'Sehat'}</td>
                    <td>{item.actor.name}</td>
                  </tr>
                )
              }) : <tr><td colSpan={5}><center>Tidak ada Record</center></td></tr>}
            </tbody>
          </Table>
          <Pagination className="">
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Transfer
          </h3>
          <Button className="d-inline float-right mb-3" value="transfer" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Transfer Ke</th>
                <th>Nama</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {(transfer.length != 0) ? transfer.map((item) => {
                return (
                  <tr>
                    <td>{item.key}</td>
                    <td>{item.owner.userAddress}</td>
                    <td>{item.owner.name}</td>
                    <td>{stateType[item.owner.role]}</td>
                  </tr>
                )
              }) : <tr><td colSpan={4}><center>Tidak ada Record</center></td></tr>}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pagination.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <h3 className="d-inline">
            Riwayat Pangan
          </h3>
          <Button className="d-inline float-right mb-3" value="pangan" disabled={(livestock.owner.userAddress === contract.accounts[0]) ? false : true} onClick={(e) => handleShow(e)}>Tambah</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Pangan</th>
                <th>Sebesar</th>
                <th>Pemberi</th>
              </tr>
            </thead>
            <tbody>
              {(feed.length != 0) ? feed.map((item) => {
                return (
                  <tr>
                    <td>{item.createdAt}</td>
                    <td>{item.feedType}</td>
                    <td>{item.amount}</td>
                    <td>{item.actor}</td>
                  </tr>
                )
              }) : <tr><td colSpan={4}><center>Tidak ada Record</center></td></tr>}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pagination.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </Col>
      </Row>
    </>
  )
}
