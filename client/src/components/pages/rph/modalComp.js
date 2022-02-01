import React, { useState, useEffect, useContext } from 'react'
import { Link, } from 'react-router-dom'
import { Form, Button, Row, Col, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import { ContractContext } from '../../../context/contractContext'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import '../../../assets/css/pagination.css'
import "react-datepicker/dist/react-datepicker.css";
import AlertBox from '../../layout/alertBox';

export default function MondalComp(props) {

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

  const [alertBox, setAlertBox] = useState({
    show: false,
    variant: 'danger',
    head: '',
    body: '',
  })

  return (
    <>
      <Modal show={props.show.view} onHide={props.handleClose} size={(props.show.modal === 'lihat') ? 'lg' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>{props.show.label}</Modal.Title>
        </Modal.Header>
        {(props.show.modal === 'antePost') ? <AntePost data={props.antePost} setAlertBox={props.setAlertBox} /> : ''}
        {(props.show.modal === 'lihat') ? <Lihat raceType={props.raceType} viewHewan={props.viewHewan} setAlertBox={props.setAlertBox} /> : ''}
      </Modal >
      <AlertBox body={alertBox.body} head={alertBox.head} variant={alertBox.variant} show={alertBox.show} />
    </>
  )
}

function AntePost(props) {
  const { contract, setContract } = useContext(ContractContext)

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
  })
  const [jenisAlasan, setJenisAlasan] = useState([
    { key: 0, nama: "produktif", label: "Produktif" },
    { key: 1, nama: "bunting", label: "Bunting" },
    { key: 2, nama: "lainnya", label: "Lainnya" },
  ])

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

  useEffect(() => {
    if (props.data) {
      setAntePost({
        label: props.data.label,
        beefId: props.data.beefId,
        check: props.data.check,
        disabled: props.data.disabled,
        description: props.data.description,
        jenisAlasan: props.data.jenisAlasan,
        _id: props.data._id,
      })
    }
  }, [])

  const handleInputAlasan = (e) => {
    e.persist()
    setAntePost((values) => ({ ...values, description: e.target.value }))
  }

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
          .then((res) => {
            console.log(res.data)
            props.setAlertBox({
              variant: 'success',
              head: 'Berhasil menambahkan riwayat Antemortem',
              body: '' + res.data,
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
          .then((res) => {
            console.log(res.data)
            props.setAlertBox({
              variant: 'success',
              head: 'Berhasil menambahkan riwayat Postmortem',
              body: res.data,
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
      {console.log('modal', antePost)}
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
                required
              >
                <option hidden value=''>Pilih Alasan</option>
                {(antePost.label == 'Ante') ?
                  jenisAlasan.map(function (alasan) {
                    return (
                      <option key={alasan.key} value={alasan.nama}>
                        {alasan.label}
                      </option>
                    );
                  }) : <option key={jenisAlasan[2].key} value={jenisAlasan[2].nama}>
                    {jenisAlasan[2].label}
                  </option>}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCheck">
            <Form.Label className="text-right" column sm={3}>
              Alasan
            </Form.Label>
            <Col sm={8}>
              <Form.Control as="textarea" onChange={(e) => handleInputAlasan(e)} value={antePost.description} disabled={(antePost.label == 'Ante') ? switchCheck.ante.disabled : switchCheck.post.disabled} name="action" rows={3} placeholder="Alasan ditolak" required />
            </Col>
          </Form.Group>
          {console.log('check', switchCheck)}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={(e) => { e.preventDefault(); (antePost.label == 'Ante') ? antemortem(antePost.beefId, moment.unix(new Date())._i, antePost.check, antePost.description, antePost._id, antePost.jenisAlasan) : postmortem(antePost.beefId, moment.unix(new Date())._i, antePost.check, antePost.description, antePost._id, antePost.jenisAlasan) }} >
          Simpan
        </Button>
      </Modal.Footer>
    </>
  )
}

function Lihat(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [beef, setBeef] = useState({
    beefId: '',
    lsId: '',
    dateAnte: '',
    datePost: '',
    datePack: '',
    ante: '',
    post: '',
    slaughterHouse: '',
    desc: '',
  })

  const convertMomentDate = (date) => {
    return moment.unix(date / 1000000).format("MMMM Do YYYY, h:mm a")
  }

  const getBeef = () => {
    axios
      .get(`http://localhost:3001/blockchains/slaughter/${props.viewHewan.beefId}`)
      .then((res) => setBeef(res.data))
  }

  useEffect(() => {
    getBeef()
  }, [props.viewHewan.beefId])

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formName">
            <Form.Label column sm="3" className="text-right">
              Pemilik
            </Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="address" readOnly value={props.viewHewan.address} placeholder="Masukkan nama sapi" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formName">
            <Form.Label column sm="3" className="text-right">
              Nama
            </Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="name" readOnly value={props.viewHewan.name} placeholder="Masukkan nama sapi" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formEartag">
            <Form.Label column sm="3" className="text-right">
              Eartag
            </Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="earTag" readOnly value={props.viewHewan.earTag} placeholder="Masukkan nomor telinga" />
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
                value={props.viewHewan.race}
              >
                {props.raceType.map(function (item) {
                  return (
                    <option key={item.key} value={item.key}>
                      {item.label}
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
                <div key={`inline-${type}`} readOnly value={props.viewHewan.gender} className="mb-3">
                  <Form.Check
                    inline
                    value={0}
                    label="Betina"
                    checked={props.viewHewan.gender == 0}
                    name="gender"
                    type={type}
                    id={`inline-${type}-1`}
                  />
                  <Form.Check
                    inline
                    value={1}
                    label="Jantan"
                    checked={props.viewHewan.gender == 1}
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
              Umur
            </Form.Label>
            <Col sm="2">
              <Form.Control className="text-right" type="number" name="age" plaintext readOnly value={props.viewHewan.dob} min={0} placeholder="Umur" />
            </Col>
            <Form.Label column sm="2">
              Hari
            </Form.Label>
          </Form.Group>
        </Form>
        <Form.Group as={Row} className="mb-3" controlId="formWeight">
          <Form.Label column sm="3" className="text-right">
            Berat
          </Form.Label>
          <Col sm="2">
            <Form.Control className="text-right" type="number" name="weight" plaintext readOnly value={props.viewHewan.weight.toLocaleString().replace(',', '.')} min={0} placeholder="Berat" />
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
            <Form.Control className="text-right" type="number" min={0} name="heartGrith" plaintext readOnly value={props.viewHewan.heartGrith.toLocaleString().replace(',', '.')} placeholder="Tinggi" />
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
            <Form.Control className="text-right" type="number" min={0} name="length" plaintext readOnly value={props.viewHewan.length.toLocaleString().replace(',', '.')} placeholder="Lebar" />
          </Col>
          <Form.Label column sm="2">
            cm
          </Form.Label>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formLength">
          <Form.Label column sm="3" className="text-right">
            Antemortem
          </Form.Label>
          <Col sm="6">
            <Form.Control type="text" name="ante" plaintext readOnly value={(beef.dateAnte != 0) ? convertMomentDate(beef.dateAnte) : 'Belum melakukan pengecekan antemortem'} placeholder="Ante" />
          </Col>

          <ButtonAntePost date={beef.dateAnte} check={beef.ante} />

        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formLength">
          <Form.Label column sm="3" className="text-right">
            postmortem
          </Form.Label>
          <Col sm="6">
            <Form.Control type="text" name="ante" plaintext readOnly value={(beef.datePost != 0) ? convertMomentDate(beef.datePost) : 'Belum melakukan pengecekan postmortem'} placeholder="Post" />
          </Col>
          <ButtonAntePost date={beef.datePost} check={beef.post} anteDate={beef.dateAnte} anteCheck={beef.ante} />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formLength">
          <Form.Label column sm="3" className="text-right">
            Packing
          </Form.Label>
          <Col sm="6">
            <Form.Control type="text" name="ante" plaintext readOnly value={(beef.datePack != 0) ? convertMomentDate(beef.datePack) : 'Belum melakukan Packing'} placeholder="Pack" />
          </Col>
          <ButtonPack date={beef.datePack} check={beef.post} />
        </Form.Group>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </>
  )
}

function ButtonAntePost(props) {
  if (props.anteDate != 0 && props.anteCheck == false) {
    return (
      <Button variant="outline-danger" >
        Ditolak
      </Button>
    )
  }

  if (props.date == 0 && props.check == false) {
    return (
      <Button variant="outline-warning" >
        Diproses
      </Button>
    )
  } else if (props.date != 0 && props.check == true) {
    return (
      <Button variant="outline-success" >
        Diterima
      </Button>
    )

  } else if (props.date != 0 && props.check == false) {
    return (
      <Button variant="outline-danger" >
        Ditolak
      </Button>
    )
  }
}

function ButtonPack(props) {
  if (props.date == 0 && props.check == false) {
    return (
      <Button variant="outline-warning" >
        Diproses
      </Button>
    )
  } else if (props.date == 0 && props.check == false) {
    return (
      <Button variant="outline-warning" >
        Diproses
      </Button>
    )
  }
  else if (props.date == 0 && props.check == true) {
    return (
      <Button variant="outline-warning" >
        Diproses
      </Button>
    )
  } else if (props.date != 0 && props.check == true) {
    return (
      <Button variant="outline-success" >
        Diterima
      </Button>
    )
  }
}