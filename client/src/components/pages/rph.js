import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Tabs, Tab, Pagination, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from '../../context/userContext'
import { ContractContext } from '../../context/contractContext'
import { LscountContext } from '../../context/lscountContext'
// import { LivestocksContext } from '../../context/livestocks'
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
  // const { livestocks, setLivestocks } = useContext(LivestocksContext)
  const [livestocks, setLivestocks] = useState()

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

  const [jenisAlasan, setJenisAlasan] = useState({
    item: [
      { key: 0, nama: "produktif", label: "Produktif" },
      { key: 1, nama: "bunting", label: "Bunting" },
      { key: 2, nama: "lainnya", label: "Lainnya" },
    ]
  })

  const [race, setRace] = useState()

  const [key, setKey] = useState('hewanTernak');

  const [addressTo, setAddressTo] = useState('');

  const [show, setShow] = useState({
    ante: false,
    post: false,
    lihat: false,
    label: '',
    view: false,
  });
  const handleClose = () => setShow({
    ante: false,
    post: false,
    lihat: false,
    label: '',
    view: false,
  });
  const handleShow = (e, data) => {
    switch (e.target.value) {
      case 'Ante':
        setShow((values) => ({ ...values, ante: true, view: true, label: 'Antemortem', }));
        setAntePost((values) => ({ ...values, label: 'Ante', check: true, description: '', beefId: data.beefId, _id: data._id }))
        setSwitchCheck((values) => ({ ...values, ante: { check: true, disabled: true }, post: { check: true, disabled: true } }))
        break;
      case 'Post':
        setShow((values) => ({ ...values, post: true, view: true, label: 'Postmortem' }));
        setAntePost((values) => ({ ...values, label: 'Post', check: true, description: '', beefId: data.beefId, _id: data._id }))
        setSwitchCheck((values) => ({ ...values, ante: { check: true, disabled: true }, post: { check: true, disabled: true } }))
        break;
      case 'Lihat':
        setShow((values) => ({ ...values, lihat: true, label: 'Detail Hewan' }));
        setViewHewan({
          _id: data._id,
          name: data._livestock.name,
          earTag: data._livestock.earTag,
          weight: data._livestock.weight,
          length: data._livestock.length,
          heartGrith: data._livestock.heartGrith,
          beefId: data.beefId,
          livestockId: data._livestock.id,
          gender: data._livestock.gender,
          race: data._livestock.race,
          dob: data.age,
          address: data._livestock.address,
          feedType: 'hijauan',
        })
        break
      default:
        break;
    }
  };

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
    name: '',
    earTag: '',
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
    address: '',
  })

  const [antePost, setAntePost] = useState({
    label: 'Ante',
    check: true,
    description: '',
    disabled: false,
    jenisAlasan: '',
    beefId: 0,
    _id: '',
  })
  const [switchCheck, setSwitchCheck] = useState({
    ante: {
      check: true,
      disabled: true,
    },
    post: {
      check: true,
      disabled: true,
    }
  });

  const handleSwitchCheck = (e, data) => {
    e.persist()
    switch (data) {
      case 'Ante':
        if (e.target.checked) {
          setSwitchCheck((values) => ({
            ...values,
            ante: {
              check: true,
              disabled: true
            },
          }))
          setAntePost((values) => ({ ...values, check: true, jenisAlasan: '', description: '' }))
        } else {
          setSwitchCheck((values) => ({
            ...values,
            ante: {
              check: false,
              disabled: false
            },
          }))
          setAntePost((values) => ({ ...values, check: false, jenisAlasan: '', description: '' }))
        }
        break;
      case 'Post':
        if (e.target.checked) {
          setSwitchCheck((values) => ({
            ...values,
            post: {
              check: true,
              disabled: true
            },
          }))
          setAntePost((values) => ({ ...values, check: true, jenisAlasan: '', description: '' }))
        } else {
          setSwitchCheck((values) => ({
            ...values,
            post: {
              check: false,
              disabled: false
            },
          }))
          setAntePost((values) => ({ ...values, check: false, jenisAlasan: '', description: '' }))
        }
        break;
      default:
        break;
    }
  }

  const handleSelectAlasan = (e, data) => {
    e.persist()
    switch (e.target.value) {
      case 'produktif':
        setAntePost((values) => ({ ...values, jenisAlasan: 'produktif', description: 'Sedang masa produktif.' }))
        break;
      case 'bunting':
        setAntePost((values) => ({ ...values, jenisAlasan: 'bunting', description: 'Sedang bunting.' }))
        break;
      case 'lainnya':
        setAntePost((values) => ({ ...values, jenisAlasan: 'lainnya', description: 'Alasan lainnya.' }))
        break;
      default:
        break;
    }

  }


  // const handleGender = (event) => {
  //   event.persist();
  //   setTambahHewan((values) => ({
  //     ...values,
  //     gender: event.target.value,
  //   }))
  //   // Check state gender
  //   // console.log(event.target.value)
  // }

  useEffect(() => {
    console.log(viewHewan)
    console.log('antePost', antePost)
  }, [tambahHewan, viewHewan, addressTo, antePost])

  // const livestokTable = (props) => {
  //   if (props) {

  //     props.map((item) => {
  //       return (
  //         <tr>
  //           <td>{item._livestock.name}</td>
  //           <td>{ras.item[item._livestock.race].label}</td>
  //           <td>{item._livestock.weight}</td>
  //           <td>{item._livestock.heartGrith}</td>
  //           <td>{item._livestock.length}</td>
  //           <td>{item._livestock.gender ? 'Jantan' : 'Betina'}</td>
  //           <td>{item.age} Hari</td>
  //           <td className="text-center">
  //             <Button as="input" className="mr-3" type="button" value="Ante" />
  //             <Button as="input" className="mr-3" type="button" value="Post" />
  //             <Button as="input" className="mr-3" type="button" value="Pack" />
  //             <Button as="input" className="mr-3" type="button" value="Lihat" />
  //           </td>
  //         </tr>
  //       )
  //     })
  //   }
  // }


  const handleViewHewan = (param, tab) => (e) => {
    e.persist()

    setKey(tab)

    setViewHewan({
      _id: param._id,
      name: param._livestock.name,
      earTag: param._livestock.earTag,
      weight: param._livestock.weight,
      length: param._livestock.length,
      heartGrith: param._livestock.heartGrith,
      beefId: param.id,
      livestockId: param._livestock.id,
      gender: param._livestock.gender,
      race: param._livestock.race,
      dob: param.age,
      address: param._livestock.address,
      feedType: 'hijauan',
    })

  }

  const convertMoment = (dob) => {
    return moment().diff(moment.unix(dob / 1000000), 'days') + ' Hari'
  }

  // const getRace = (_lsId) => {
  //   const x = contract.contracts.methods.livestockRace(_lsId - 1).call()
  //   setRace(x)
  // }

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
      console.log('livestock', contract.contracts.methods.livestocks(0).call())
    }
  }, [contract, pagination.currentPage])

  const antemortem = (_beefId, _epox, _approval, _description, _id, _jenisAlasan) => {
    contract.contracts.methods.checkAntemortem(_beefId, _epox, _approval, _description)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .patch(`http://localhost:3001/slaughters/ante`, {
            beefId: _beefId,
            id: _id,
            approval: _approval,
            jenisAlasan: _jenisAlasan,
            alasan: _description,
            txAnte: receipt.transactionHash,
          })
          .then((res) => console.log(res.data))
        console.log(receipt)
      })
  }
  const postmortem = (_beefId, _epox, _approval, _description, _id, _jenisAlasan) => {
    contract.contracts.methods.checkPostmortem(_beefId, _epox, _approval, _description)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .patch(`http://localhost:3001/slaughters/post`, {
            beefId: _beefId,
            id: _id,
            approval: _approval,
            jenisAlasan: _jenisAlasan,
            alasan: _description,
            txPost: receipt.transactionHash,
          })
          .then((res) => console.log(res.data))
        console.log(receipt)
      })
  }

  const getHewan = () => {

    axios
      .get(`http://localhost:3001/slaughters/${contract.accounts}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
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
      <Modal show={show.view} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{show.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Group as={Row} className="mb-3" controlId="formCheck">
              <Form.Label column sm="3" className="text-right">
                Diterima
              </Form.Label>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  bsCustomPrefix="form-control border-0"
                  onClick={(e) => handleSwitchCheck(e, antePost.label)}
                  checked={(antePost.label == 'Ante') ? switchCheck.ante.check : switchCheck.post.check}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formCheck">
              <Form.Label column sm="3" className="text-right">
                Jenis Alasan
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  placeholder="jenis alasan"
                  name="reason"
                  disabled={(antePost.label == 'Ante') ? switchCheck.ante.disabled : switchCheck.post.disabled}
                  onChange={(e) => handleSelectAlasan(e)}
                  value={antePost.jenisAlasan}
                >
                  <option hidden value=''>Pilih Alasan</option>
                  {(antePost.label == 'Ante') ?
                    jenisAlasan.item.map(function (alasan) {
                      return (
                        <option key={alasan.key} value={alasan.nama}>
                          {alasan.label}
                        </option>
                      );
                    }) : <option key={jenisAlasan.item[2].key} value={jenisAlasan.item[2].nama}>
                      {jenisAlasan.item[2].label}
                    </option>}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCheck">
              <Form.Label className="text-right" column sm={3}>
                Alasan
              </Form.Label>
              <Col sm={8}>
                <Form.Control as="textarea" value={antePost.description} disabled={(antePost.label == 'Ante') ? switchCheck.ante.disabled : switchCheck.post.disabled} name="action" rows={3} placeholder="Alasan ditolak" />
              </Col>
            </Form.Group>
            {console.log('check', switchCheck)}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={(e) => { e.preventDefault(); (antePost.label == 'Ante') ? antemortem(antePost.beefId, moment.unix(new Date())._i, antePost.check, antePost.description, antePost._id, antePost.jenisAlasan) : postmortem(antePost.beefId, moment.unix(new Date())._i, antePost.check, antePost.description, antePost._id, antePost.jenisAlasan) }} >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal >

      <Modal show={show.lihat} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{show.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm="3" className="text-right">
                Pemilik
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="address" readOnly value={viewHewan.address} placeholder="Masukkan nama sapi" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm="3" className="text-right">
                Nama
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="name" readOnly value={viewHewan.name} placeholder="Masukkan nama sapi" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEartag">
              <Form.Label column sm="3" className="text-right">
                Eartag
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="earTag" readOnly value={viewHewan.earTag} placeholder="Masukkan nomor telinga" />
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
                  readOnly
                  value={viewHewan.race}
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
                  <div key={`inline-${type}`} readOnly value={viewHewan.gender} className="mb-3">
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
                <DatePicker name="dob" selected={startDate} readOnly onChange={(date) => { setStartDate(date); setTambahHewan((values) => ({ ...values, dob: moment.unix(date)._i })) }} />
              </Col>
            </Form.Group>
          </Form>
          <Form.Group as={Row} className="mb-3" controlId="formWeight">
            <Form.Label column sm="3" className="text-right">
              Berat
            </Form.Label>
            <Col sm="2">
              <Form.Control type="number" name="weight" readOnly value={viewHewan.weight} min={0} placeholder="Berat" />
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
              <Form.Control type="number" min={0} name="heartGrith" readOnly value={viewHewan.heartGrith} placeholder="Tinggi" />
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
              <Form.Control type="number" min={0} name="length" readOnly value={viewHewan.length} placeholder="Lebar" />
            </Col>
            <Form.Label column sm="2">
              cm
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
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
                    <th>nama</th>
                    <th>Jenis ras</th>
                    <th>Berat</th>
                    <th>Lingkar Dada</th>
                    <th>Panjang</th>
                    <th>Kelamin</th>
                    <th>Umur</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {livestocks ?
                    livestocks.map((item) => {
                      return (<tr>
                        <td>{item._livestock.name}</td>
                        <td>{ras.item[item._livestock.race].label}</td>
                        <td>{item._livestock.weight}</td>
                        <td>{item._livestock.heartGrith}</td>
                        <td>{item._livestock.length}</td>
                        <td>{item._livestock.gender ? 'Jantan' : 'Betina'}</td>
                        <td>{item.age} Hari</td>
                        <td className="text-center">
                          <Button as="input" className="mr-3" type="button" onClick={(e) => handleShow(e, item)} value="Ante" disabled={(item.status == 'diproses') ? false : true} />

                          <Button as="input" className="mr-3" type="button" onClick={(e) => handleShow(e, item)} value="Post" disabled={(item.status == 'antemortem') ? false : true} />
                          <Button as="input" className="mr-3" type="button" value="Pack" disabled={(item.status == 'postmortem') ? false : true} />
                          <Button as="input" className="mr-3" type="button" onClick={(e) => handleShow(e, item)} value="Lihat" />
                        </td>
                      </tr>)

                    }) : ''

                  }
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

            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  )
}
