import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Tabs, Tab, Pagination, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from '../../context/userContext'
import { ContractContext } from '../../context/contractContext'
import { LscountContext } from '../../context/lscountContext'
import web3 from 'web3'
import moment from 'moment'
import 'moment/locale/id'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../../assets/css/pagination.css'

export default function Home() {
  const { contract, setContract } = useContext(ContractContext)
  const { user, setUser } = useContext(UserContext)
  const { livestockCounts, setLivestockCounts } = useContext(LscountContext)

  const [beefCounts, setBeefcounts] = useState(0)

  const [livestocks, setLivestocks] = useState([])

  const [pagination, setPagination] = useState({
    offset: 0,
    perPage: 2,
    pageCount: 100 / 2,
    currentPage: 1
  })

  const [jabatan, setJabatan] = useState()
  const [ras, setRas] = useState({
    item: [
      { key: 0, nama: "bali", label: "Bali" },
      { key: 1, nama: "madura", label: "Madura" },
      { key: 2, nama: "brahman", label: "Brahman" },
      { key: 3, nama: "PO", label: "PO" },
      { key: 4, nama: "brahmanCross", label: "Brahman Cross" },
      { key: 5, nama: "ongole", label: "Ongole" },
      { key: 6, nama: "aceh", label: "Aceh" },
    ]
  })

  const [feed, setFeed] = useState({
    item: [
      { enum: 'hijauan', label: 'Hijauan' },
      { enum: 'konsentrat', label: 'Konsenstrat' },
      { enum: 'tambahan', label: 'Tambahan' },
      { enum: 'vitamin', label: 'Vitamin' },
      { enum: 'obat', label: 'Obat' },
    ]
  })

  const [race, setRace] = useState()

  const [key, setKey] = useState('hewanTernak');

  const [addressTo, setAddressTo] = useState('');

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [startDate, setStartDate] = useState(new Date());

  const [tambahHewan, setTambahHewan] = useState({
    name: '',
    earTag: '',
    fatherId: 0,
    motherId: 0,
    dob: moment.unix(new Date())._i,
    gender: 0,
    race: 0,
    weight: 0,
    length: 0,
    heartGrith: 0,
  })

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

  const [switchSick, setSwitchSick] = useState({
    label: 'Sehat',
    sick: false,
    disabled: 'true',
  });

  useEffect(() => {
    console.log(viewHewan)
  }, [tambahHewan, viewHewan, switchSick, addressTo])

  const handleTambahHewan = (e) => {
    switch (e.target.name) {
      case 'name':
        setTambahHewan((values) => ({ ...values, name: e.target.value }));
        break;
      case 'earTag':
        setTambahHewan((values) => ({ ...values, earTag: e.target.value }));
        break;
      case 'fatherId':
        setTambahHewan((values) => ({ ...values, fatherId: e.target.value }));
        break;
      case 'motherId':
        setTambahHewan((values) => ({ ...values, motherId: e.target.value }));
        break;
      case 'race':
        setTambahHewan((values) => ({ ...values, race: e.target.value }));
        break;
      case 'gender':
        setTambahHewan((values) => ({ ...values, gender: e.target.value }));
        break;
      case 'weight':
        setTambahHewan((values) => ({ ...values, weight: e.target.value }));
        break;
      case 'length':
        setTambahHewan((values) => ({ ...values, length: e.target.value }));
        break;
      case 'heartGrith':
        setTambahHewan((values) => ({ ...values, heartGrith: e.target.value }));
        break;
      default:
        break;
    }
  }

  const handleWeightRecord = (e) => {
    switch (e.target.name) {
      case 'weightb':
        setViewHewan((values) => ({ ...values, weight: e.target.value }));
        break;
      case 'lengthb':
        setViewHewan((values) => ({ ...values, length: e.target.value }));
        break;
      case 'heartGrithb':
        setViewHewan((values) => ({ ...values, heartGrith: e.target.value }));
        break;
      default:
        break;
    }
  }

  const handleHealthRecord = (e) => {
    switch (e.target.name) {
      case 'action':
        setViewHewan((values) => ({ ...values, action: e.target.value }));
        break;
      case 'description':
        setViewHewan((values) => ({ ...values, description: e.target.value }));
        break;
      default:
        break;
    }
  }

  const handleFeed = (e) => {
    switch (e.target.name) {
      case 'feedType':
        setViewHewan((values) => ({ ...values, feedType: e.target.value }));
        break;
      case 'feedAmount':
        setViewHewan((values) => ({ ...values, feedAmount: e.target.value }));
        break;
      default:
        break;
    }
  }

  const handleSwitchSick = (e) => {
    e.persist()

    if (e.target.checked) {
      setSwitchSick({
        label: 'Sakit',
        sick: true,
        disabled: false,
      })
      setViewHewan((values) => ({ ...values, sick: true }))
    } else {
      setSwitchSick({
        label: 'Sehat',
        sick: false,
        disabled: true,
      })
      setViewHewan((values) => ({ ...values, sick: false, description: '' }))
    }
  }

  const handleAddressTo = (e) => {
    e.persist()

    setAddressTo(e.target.value)
  }

  const handleViewHewan = (param, tab) => (e) => {
    e.persist()

    setKey(tab)

    setViewHewan({
      _id: param._id,
      weight: param.weight,
      length: param.length,
      heartGrith: param.heartGrith,
      id: param.id,
      gender: param.gender,
      race: param.race,
      dob: param.birth,
      description: 'Sehat',
      feedType: 'hijauan',
    })
  }

  const convertMoment = (dob) => {
    return moment().diff(moment.unix(dob / 1000000), 'days') + ' Hari'
  }

  const addLivestock = (_name, _eartag, _father, _mother, _dob, _gender, _race, _weight, _length, _hearthGrith) => {
    console.log(parseInt(livestockCounts) + 1)

    contract.contracts.methods.registerLivestock(_father, _mother, _dob, _eartag, _gender, _race, _weight, _length, _hearthGrith, moment.unix(new Date())._i)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .post('http://localhost:3001/livestocks/add', {
            id: parseInt(livestockCounts) + 1,
            name: _name,
            earTag: _eartag,
            weight: _weight,
            length: _length,
            heartGrith: _hearthGrith,
            race: _race,
            gender: _gender,
            birth: _dob,
            address: contract.accounts[0],
          })
          .then((res) => console.log(res.data))
        // window.location.reload();
      })
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

  const addHealthRecord = (_lsId, _description, _action, _sick) => {
    contract.contracts.methods.registerHRecord(_lsId, _description, _action, moment.unix(new Date())._i, _sick)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        console.log(receipt)
      })
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
          .then((res) => console.log(res.data))
        console.log(receipt)
      })
  }

  const getBeefCounts = async () => {
    const beefCount = await contract.contracts.methods.beefCount().call()
    setBeefcounts(beefCount)
  }

  useEffect(() => {
    if (contract.accounts[0]) {
      if (contract.user.role == 0) {
        setJabatan("Peternak")
      } else if (contract.user.role == 1) {
        setJabatan("Stocker")
      } else if (contract.user.role == 2) {
        setJabatan("RPH")
      } else {
        setJabatan("Error")
      }

      getHewan()
      getHewanSelect()
      getBeefCounts()
    }
  }, [contract.accounts, pagination.currentPage])

  const getHewan = () => {

    axios
      .get(`http://localhost:3001/livestocks/${contract.accounts}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setLivestocks(res.data))
  }

  const getHewanSelect = () => {
    axios
      .get(`http://localhost:3001/livestocks/select/${contract.accounts}`)
      .then((res) => setSelectHewan(res.data))
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

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    const offset = (selectedPage * pagination.perPage) - pagination.perPage;

    setPagination({
      ...pagination,
      currentPage: selectedPage,
      offset: offset
    }, () => {
      getHewan();
    });
  }

  return (
    <>
      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Hewan Ternak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm="3" className="text-right">
                Nama
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="name" onChange={(e) => handleTambahHewan(e)} placeholder="Masukkan nama sapi" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEartag">
              <Form.Label column sm="3" className="text-right">
                Eartag
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="earTag" onChange={(e) => handleTambahHewan(e)} placeholder="Masukkan nomor telinga" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formFatherId">
              <Form.Label column sm="3" className="text-right">
                Id Bapak
              </Form.Label>
              <Col sm="8">
                <Form.Control type="number" name="fatherId" onChange={(e) => handleTambahHewan(e)} placeholder="Masukkan nomor id bapak" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formMotherId">
              <Form.Label column sm="3" className="text-right">
                Id Induk
              </Form.Label>
              <Col sm="8">
                <Form.Control type="number" name="motherId" onChange={(e) => handleTambahHewan(e)} placeholder="Masukkan nomor id induk" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formRace">
              <Form.Label column sm="3" className="text-right">
                Jenis Ras
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  placeholder="ras sapi"
                  name="race"
                  onChange={(e) => handleTambahHewan(e)}
                >
                  {ras.item.map(function (ras) {
                    return (
                      <option key={ras.key} value={ras.key}>
                        {ras.label}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formGender">
              <Form.Label column sm="3" className="text-right">
                Kelamin
              </Form.Label>
              <Col sm="8">
                {['radio'].map((type) => (
                  <div key={`inline-${type}`} onChange={(e) => handleTambahHewan(e)} value={tambahHewan.gender} className="mb-3">
                    <Form.Check
                      inline
                      value={0}
                      checked={tambahHewan.gender == 0}
                      label="Betina"
                      name="gender"
                      type={type}
                      id={`inline-${type}-1`}
                    />
                    <Form.Check
                      inline
                      value={1}
                      checked={tambahHewan.gender == 1}
                      label="Jantan"
                      name="gender"
                      type={type}
                      id={`inline-${type}-2`}
                    />
                  </div>
                ))}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formDOB">
              <Form.Label column sm="3" className="text-right">
                Tanggal Lahir
              </Form.Label>
              <Col sm="8">
                <DatePicker name="dob" selected={startDate} onChange={(date) => { setStartDate(date); setTambahHewan((values) => ({ ...values, dob: moment.unix(date)._i })) }} />
              </Col>
            </Form.Group>
          </Form>
          <Form.Group as={Row} className="mb-3" controlId="formWeight">
            <Form.Label column sm="3" className="text-right">
              Berat
            </Form.Label>
            <Col sm="2">
              <Form.Control type="number" name="weight" onChange={(e) => handleTambahHewan(e)} min={0} placeholder="Berat" />
            </Col>
            <Form.Label column sm="2">
              kg
            </Form.Label>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHeight">
            <Form.Label column sm="3" className="text-right">
              Lingkar dada
            </Form.Label>
            <Col sm="2">
              <Form.Control type="number" min={0} name="heartGrith" onChange={(e) => handleTambahHewan(e)} placeholder="Tinggi" />
            </Col>
            <Form.Label column sm="3">
              cm
            </Form.Label>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formLength">
            <Form.Label column sm="3" className="text-right">
              Panjang
            </Form.Label>
            <Col sm="2">
              <Form.Control type="number" min={0} name="length" onChange={(e) => handleTambahHewan(e)} placeholder="Lebar" />
            </Col>
            <Form.Label column sm="2">
              cm
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={(event) => { event.preventDefault(); addLivestock(tambahHewan.name, tambahHewan.earTag, tambahHewan.fatherId, tambahHewan.motherId, tambahHewan.dob, tambahHewan.gender, tambahHewan.race, tambahHewan.weight, tambahHewan.length, tambahHewan.heartGrith) }}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="Justify-content-md-center" className="mb-5 pt-5">
        <Col xl={1}></Col>
        <Col xl={8}>
          <>
            <h1>
              {user.name}
            </h1>
            <h6 className="d-inline"># {user.userAddress}</h6>
            <h6 className="d-inline pl-3"># {jabatan}</h6>
          </>
        </Col>
        <Col xl={2}>
          <h5 className="float-right">
          </h5>
        </Col>
      </Row>
      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="hewanTernak" title="Hewan Ternak">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Jenis ras</th>
                    <th>Berat</th>
                    <th>Lingkar Dada</th>
                    <th>Panjang</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(livestocks.length != 0) ?
                    livestocks.map((item) => {
                      return (<tr>
                        <td>{item.name}</td>
                        <td>{ras.item[item.race].label}</td>
                        <td>{item.weight}</td>
                        <td>{item.heartGrith}</td>
                        <td>{item.length}</td>
                        <td>{item.alive ? 'Hidup' : 'Mati'}</td>
                        <td className="text-center">
                          <Button as="input" className="mr-3" onClick={handleViewHewan(item, 'transfer')} type="button" value="Transfer" />
                          <Button as="input" className="mr-3" onClick={handleViewHewan(item, 'beratBadan')} type="button" value="BB" />
                          <Button as="input" className="mr-3" onClick={handleViewHewan(item, 'kesehatan')} type="button" value="Kesehatan" />
                          <Button as="input" className="mr-3" onClick={handleViewHewan(item, 'pangan')} type="button" value="Pangan" />
                          <Link to={location => `/hewan/detail/${item.id}`} >
                            <Button as="input" className="mr-3" type="button" value="Lihat" />
                          </Link>
                          <Button as="input" variant="danger" className="mr-3" type="button" value="Mati?" disabled={item.status ? false : true} />
                        </td>
                      </tr>)

                    }) : <tr><td colSpan={7}><center>Tidak ada Record</center></td></tr>

                  }
                </tbody>
              </Table>
              <Button as="input" variant="success" className="mr- float-right" onClick={handleShow} type="button" value="Tambah" />

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

            </Tab>

            {/* TRANSFER */}
            <Tab eventKey="transfer" title="Transfer">
              <Form className="mt-5">
                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label column sm="4" className="text-right">
                    id Hewan ternak
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      as="select"
                      placeholder="hewan ternak"
                      name="idHewan"
                      onChange={(e) => getHewanDetail(e.target.value)}
                      value={viewHewan.id}
                    >
                      <option hidden>Pilih Hewan</option>
                      {selectHewan ?
                        selectHewan.map((item) => {
                          return (<option value={item.id}>{item.name} - {item.earTag}</option>)
                        }) : ''
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" value={viewHewan.weight} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Umur" value={convertMoment(viewHewan.dob)} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Lingkar Dada" value={viewHewan.heartGrith} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Kelamin" value={viewHewan.gender ? 'Jantan' : 'Betina'} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Panjang" value={viewHewan.length} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Ras" value={ras.item[viewHewan.race].label} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label className="text-right" column sm={4}>
                    Address Pengirim
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" name="from" readOnly placeholder="Address Pengirim" value={contract.accounts} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formTransfer">
                  <Form.Label className="text-right" column sm={4}>
                    Address Penerima
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" name="to" placeholder="Address Penerima" onChange={(e) => handleAddressTo(e)} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" onClick={(e) => { e.preventDefault(); transferLivestock(viewHewan.id, contract.accounts[0], addressTo) }} type="submit">Kirim</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab>

            {/* PROSES DAGING */}
            <Tab eventKey="prosesDaging" title="Proses Daging">
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
                      {selectHewan ?
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
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" value={viewHewan.weight} />
                  </Col>

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
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Lingkar Dada" value={viewHewan.heartGrith} />
                  </Col>

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
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Panjang" value={viewHewan.length} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Ras" value={ras.item[viewHewan.race].label} />
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
            </Tab>

            {/* BERAT BADAN */}
            <Tab eventKey="beratBadan" title="Berat Badan">
              <Form className="mt-5">

                <Form.Group as={Row} controlId="formBeratBadan">
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
                      {selectHewan ?
                        selectHewan.map((item) => {
                          return (<option value={item.id}>{item.name} - {item.earTag}</option>)
                        }) : ''
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formBeratBadan">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control type="number" name="weightb" onChange={(e) => handleWeightRecord(e)} placeholder="Berat" value={viewHewan.weight} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Umur" value={convertMoment(viewHewan.dob)} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formBeratBadan">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control type="number" name="heartGrithb" onChange={(e) => handleWeightRecord(e)} placeholder="Lingkar Dada" value={viewHewan.heartGrith} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Kelamin" value={viewHewan.gender ? 'Jantan' : 'Betina'} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formBeratBadan">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control type="number" name="lengthb" onChange={(e) => handleWeightRecord(e)} placeholder="Panjang" value={viewHewan.length} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Ras" value={ras.item[viewHewan.race].label} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" type="submit" onClick={(e) => { e.preventDefault(); addWeightRecord(viewHewan.id, viewHewan.weight, viewHewan.length, viewHewan.heartGrith) }}>Kirim</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab>

            {/* KESEHATAN */}
            <Tab eventKey="kesehatan" title="Kesehatan">
              <Form className="mt-5">
                <Form.Group as={Row} controlId="formKesehatan">
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
                      {selectHewan ?
                        selectHewan.map((item) => {
                          return (<option value={item.id}>{item.name} - {item.earTag}</option>)
                        }) : ''
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formKesehatan">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" value={viewHewan.weight} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Umur" value={convertMoment(viewHewan.dob)} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formKesehatan">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Lingkar dada" value={viewHewan.heartGrith} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Kelamin" value={viewHewan.gender ? 'Jantan' : 'Betina'} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formKesehatan">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Panjang" value={viewHewan.length} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Ras" value={ras.item[viewHewan.race].label} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formKesehatan">
                  <Form.Label className="text-right" column sm={4}>
                    Nama Penyakit
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" name="description" onChange={(e) => { handleHealthRecord(e) }} placeholder="Nama Penyakit" disabled={switchSick.disabled} value={viewHewan.description} />
                  </Col>

                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={switchSick.label}
                    checked={switchSick.sick}
                    onClick={(e) => handleSwitchSick(e)}
                  />
                </Form.Group>

                <Form.Group as={Row} controlId="formKesehatan">
                  <Form.Label className="text-right" column sm={4}>
                    Aksi
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control as="textarea" name="action" onChange={(e) => { handleHealthRecord(e) }} rows={3} placeholder="Deskripsikan yang dilakukan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" onClick={(e) => { e.preventDefault(); addHealthRecord(viewHewan.id, viewHewan.description, viewHewan.action, viewHewan.sick) }} type="submit">Kirim</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab>

            {/* PANGAN */}
            <Tab eventKey="pangan" title="Pangan">
              <Form className="mt-5">
                <Form.Group as={Row} controlId="formPangan">
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
                      {selectHewan ?
                        selectHewan.map((item) => {
                          return (<option value={item.id}>{item.name} - {item.earTag}</option>)
                        }) : ''
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formPangan">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="weight" placeholder="Berat" value={viewHewan.weight} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="dob" placeholder="Umur" value={convertMoment(viewHewan.dob)} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formPangan">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="heartGrith" placeholder="Berat" value={viewHewan.heartGrith} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="gender" placeholder="Kelamin" value={viewHewan.gender ? 'Jantan' : 'Betina'} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formPangan">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="length" placeholder="Panjang" value={viewHewan.length} />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly name="race" placeholder="Ras" value={ras.item[viewHewan.race].label} />
                  </Col>
                </Form.Group>

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
                      // onChange={handleBeratBadan}
                      value={viewHewan.feedType}
                    >
                      {feed.item ?
                        feed.item.map((item) => {
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
                  <Col sm={2}>
                    <Form.Control type="number" name="feedAmount" onChange={(e) => handleFeed(e)} placeholder="" value={viewHewan.feedAmount} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" type="submit" onClick={(e) => { e.preventDefault(); addFeedRecord(viewHewan._id, viewHewan.id, viewHewan.feedType, viewHewan.feedAmount) }}>Kirim</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  )
}
