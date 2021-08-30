import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Tabs, Tab, Pagination, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from '../../context/userContext'
import { ContractContext } from '../../context/contractContext'
import { LscountContext } from '../../context/lscountContext'
import { LivestocksContext } from '../../context/livestocks'
import web3 from 'web3'
import moment from 'moment'
import axios from 'axios'


export default function RPH() {
  const { contract, setContract } = useContext(ContractContext)
  const { user, setUser } = useContext(UserContext)
  const { livestockCounts, setLivestockCounts } = useContext(LscountContext)
  // const { livestocks, setLivestocks } = useContext(LivestocksContext)
  const [livestocks, setLivestocks] = useState()

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

  const [race, setRace] = useState()

  const [key, setKey] = useState('hewanTernak');

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

  const [selectHewan, setSelectHewan] = useState({
    weight: 0,
    length: 0,
    heartGrith: 0,
    id: '',
  })

  const [test, setTest] = useState([]);

  const handleGender = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      gender: event.target.value,
    }))
    // Check state gender
    // console.log(event.target.value)
  }

  const handleName = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      name: event.target.value,
    }))
  }

  const handleDOB = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      dob: moment.unix(event.target.value)._i,
    }))
  }

  const handleFather = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      fatherId: event.target.value,
    }))
  }

  const handleMother = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      motherId: event.target.value,
    }))
  }

  const handleEarTag = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      earTag: event.target.value,
    }))
  }

  const handleRace = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      race: event.target.value,
    }))
  }

  const handleWeight = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      weight: event.target.value,
    }))
  }

  const handleLength = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      length: event.target.value,
    }))
  }

  const handleHeartGrith = (event) => {
    event.persist();
    setTambahHewan((values) => ({
      ...values,
      heartGrith: event.target.value,
    }))
  }

  const handleBeratBadan = (event) => {
    event.persist();
    //KIRIM KE STATE
  }

  const handleKesehatan = (event) => {
    event.persist();
    //KIRIM KE STATE
    setSelectHewan({
      weight: 100,
      length: 200,
      heartGrith: 300,
    })
  }

  // const getRace = (_lsId) => {
  //   const x = contract.contracts.methods.livestockRace(_lsId - 1).call()
  //   setRace(x)
  // }

  const addLivestock = (_name, _eartag, _father, _mother, _dob, _gender, _race, _weight, _length, _hearthGrith) => {
    console.log(parseInt(livestockCounts) + 1)

    contract.contracts.methods.registerLivestock(_father, _mother, _dob, _eartag, _gender, _race, _weight, _length, _hearthGrith, moment.unix(new Date())._i)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        axios
          .post('http://localhost:3001/livestocks/add', {
            id: parseInt(livestockCounts) + 1,
            name: _name,
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

  useEffect(() => {
    if (user.role == 0) {
      setJabatan("Peternak")
    } else if (user.role == 1) {
      setJabatan("Stocker")
    } else if (user.role == 2) {
      setJabatan("RPH")
    } else {
      setJabatan("Error")
    }
    // console.log("ue: role")
  }, [user])



  useEffect(() => {
    // console.log("ue contract")
    // console.log(contract)
  }, [contract])

  useEffect(() => {
    // console.log("ue lscount")
    // console.log(livestockCounts)
  }, [livestockCounts])

  // useEffect(() => {
  //   // console.log("ue ls")
  //   // console.log(livestocks)
  // }, [livestocks])

  useEffect(() => {
    // console.log("ue tambah")
  }, [tambahHewan])

  useEffect(() => {
    axios
      .get('http://localhost:3001/livestocks/0x18e5e9683aB77f1ed54d785939eC5754A3feCedC')
      .then((res) => setLivestocks(res.data))
  }, [])

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
                <Form.Control type="text" name="name" onChange={handleName} placeholder="Masukkan nama sapi" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEartag">
              <Form.Label column sm="3" className="text-right">
                Eartag
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" name="earTag" onChange={handleEarTag} placeholder="Masukkan nomor telinga" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formFatherId">
              <Form.Label column sm="3" className="text-right">
                Id Bapak
              </Form.Label>
              <Col sm="8">
                <Form.Control type="number" name="fatherId" onChange={handleFather} placeholder="Masukkan nomor id bapak" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formMotherId">
              <Form.Label column sm="3" className="text-right">
                Id Induk
              </Form.Label>
              <Col sm="8">
                <Form.Control type="number" name="motherId" onChange={handleMother} placeholder="Masukkan nomor id induk" />
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
                  onChange={handleRace}
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
                  <div key={`inline-${type}`} onChange={handleGender} value={tambahHewan.gender} className="mb-3">
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
              <Form.Control type="number" name="weight" onChange={handleWeight} min={0} placeholder="Berat" />
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
              <Form.Control type="number" min={0} name="heartGrith" onChange={handleHeartGrith} placeholder="Tinggi" />
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
              <Form.Control type="number" min={0} name="length" onChange={handleLength} placeholder="Lebar" />
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
                    <th>Kelamin</th>
                    <th>Umur</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {
                    livestocks.livestocks.map((item) => livestocks.owner[item.lsId - 1] == contract.accounts[0] && (
                      <tr key={item.lsId}>
                        <td>{web3.utils.hexToUtf8(item.earTag)}</td>
                        <td>{ras.item[livestocks.race[item.lsId - 1]].nama}</td>
                        <td>{livestocks.weight[item.lsId - 1]} kg</td>
                        <td>{livestocks.heartGrith[item.lsId - 1]} cm</td>
                        <td>{livestocks.length[item.lsId - 1]} cm</td>
                        <td>{item.status ? "Hidup" : "Mati"}</td>
                        <td className="text-center">
                          <Button as="input" className="mr-3" onClick={(e) => { e.preventDefault(); setKey('transfer') }} type="button" value="Transfer" />
                          <Button as="input" className="mr-3" type="button" value="BB" />
                          <Button as="input" className="mr-3" type="button" value="Kesehatan" />
                          <Button as="input" className="mr-3" type="button" value="Lihat" />
                          <Button as="input" variant="danger" className="mr-3" type="button" value="Mati?" disabled={item.status ? false : true} />
                        </td>
                      </tr>
                    ))
                  } */}

                  {livestocks ?
                    livestocks.map((item) => {
                      return (<tr>
                        <td>{item.name}</td>
                        <td>{ras.item[item.race].label}</td>
                        <td>{item.weight}</td>
                        <td>{item.heartGrith}</td>
                        <td>{item.length}</td>
                        <td>{item.alive ? 'Hidup' : 'Mati'}</td>
                        <td>{moment.unix(item.birth / 1000000).fromNow()}</td>
                        <td className="text-center">
                          <Button as="input" className="mr-3" type="button" value="Ante" />
                          <Button as="input" className="mr-3" type="button" value="Post" />
                          <Button as="input" className="mr-3" type="button" value="Pack" />
                          <Button as="input" className="mr-3" type="button" value="Lihat" />
                        </td>
                      </tr>)

                    }) : ''

                  }
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

            </Tab>

            {/* Pemotongan Ditolak */}
            <Tab eventKey="ditolak" title="Pemotongan Ditolak">
              <Form className="mt-5">
                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    id Hewan ternak
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    Address Pengirim
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    Address Penerima
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" type="submit">Kirim</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab>

            {/* PPemotongan Diterima */}
            <Tab eventKey="diterima" title="Pemotongan Diterima">
              <Form className="mt-5">
                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    id Hewan ternak
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Berat
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Umur
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Lingkar Dada
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Kelamin
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                  <Form.Label className="text-right" column sm={4}>
                    Panjang
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="Berat" />
                  </Col>

                  <Form.Label className="text-right" column sm={2}>
                    Jenis Ras
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control plaintext readOnly placeholder="umur" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    Address Pengirim
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalEmail">
                  <Form.Label className="text-right" column sm={4}>
                    Address RPH
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control type="text" placeholder="id hewan" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 7, offset: 2 }}>
                    <Button className="float-right" type="submit">Kirim</Button>
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
