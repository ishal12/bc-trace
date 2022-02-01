import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Table, Card, CardGroup, Modal, labels } from 'react-bootstrap'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../../assets/css/pagination.css'
import moment from 'moment'
import 'moment/locale/id'

function Slaughter(props) {
  const [livestocks, setLivestocks] = useState([{
    createdAt: '',
    addressRPH: '',
    _livestock: {
      race: 0,
      gender: false,
      weight: 0,
    },
    age: 0,
  }])

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
      getSlaughter();
    });
  }

  const getSlaughter = () => {
    axios
      .get(`http://localhost:3001/reports/slaughter/total?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => {
        setLivestocks(res.data.slaughters)
        setPagination({ ...pagination, pageCount: res.data.count / 2 });
      })
  }

  useEffect(() => {
    getSlaughter()
  }, [pagination.currentPage])

  return (
    <>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tangal</th>
              <th>RPH (Pemotong)</th>
              <th>Jenis Sapi</th>
              <th>Kelamin</th>
              <th>Berat</th>
              <th>Umur</th>
            </tr>
          </thead>
          <tbody>
            {(livestocks.length != 0) ? livestocks.map((item) => {
              return (
                <tr>
                  <td>{moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                  <td>{item.addressRPH}</td>
                  <td>{ras.item[item._livestock.race].label}</td>
                  <td>{(item._livestock.gender) ? 'Jantan' : 'Betina'}</td>
                  <td className='text-right'>{(item._livestock.weight).toLocaleString().replace(',', '.')} kg</td>
                  <td className='text-right'>{item.age} Hari</td>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
      </Modal.Footer>
    </>
  )
}

function Transfer(props) {
  const [transfer, setTransfer] = useState([{
    id: '',
    _livestock: {
      name: '',
    },
    from: '',
    to: '',
    stateFrom: '',
    stateTo: '',
    txHash: '',
  }])

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
      getTransfer();
    });
  }

  const getTransfer = () => {
    axios
      .get(`http://localhost:3001/reports/transfer/total?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => {
        setTransfer(res.data.transfers)
        setPagination({ ...pagination, pageCount: res.data.count / 2 });
      })
  }

  useEffect(() => {
    getTransfer()
  }, [pagination.currentPage])

  return (
    <>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sapi</th>
              <th>Tanggal</th>
              <th>Dari</th>
              <th>Ke</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(transfer.length != 0) ? transfer.map((item) => {
              return (
                <tr>
                  <td>{item._livestock.name}</td>
                  <td>{moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                  <td>{(item.stateFrom == '') ? '' : item.from}</td>
                  <td>{item.to}</td>
                  <td>{(item.stateFrom == '') ? `Pemilik pertama` : `${item.stateFrom} ->`} <b>{item.stateTo}</b> </td>
                  <td className="text-center">
                    <Link to={location => `/hewan/detail/${item.id}`} >
                      <Button as="input" className="mr-3" type="button" value="Lihat" />
                    </Link>
                  </td>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Batal
        </Button>
      </Modal.Footer>
    </>
  )
}

function ModalComp(props) {

  return (
    <Modal show={props.show.view} onHide={props.handleClose} dialogClassName='modal-90w'>
      <Modal.Header closeButton>
        <Modal.Title>{props.show.label}</Modal.Title>
      </Modal.Header>
      {(props.show.modal === 'transfer') ? <Transfer handleClose={props.handleClose} /> : ''}
      {(props.show.modal === 'slaughter') ? <Slaughter handleClose={props.handleClose} /> : ''}
    </Modal >
  )
}

export default function HewanH() {
  const [livestocks, setLivestocks] = useState([{
    _id: "",
    id: "",
    name: "",
    earTag: "",
    weight: 0,
    length: 0,
    heartGrith: 0,
    gender: false,
    birth: 0,
    race: 0,
    alive: false,
    address: "",
  }])

  var [dashboard, setDashboard] = useState({
    alive: 0,
    aliveU: 0,
    dead: 0,
    deadU: 0,
    total: 0,
    totalU: 0,
    transfer: 0,
    transferU: 0,
    slaughter: 0,
    slaughterU: 0,
  })

  // const [cowAlive, setCowAlive] = useState({
  //   total: 0,
  //   update: 0,
  // })

  // const [cowDead, setCowDead] = useState({
  //   total: 0,
  //   update: 0,
  // })

  // const [cowTotal, setCowTotal] = useState({
  //   total: 0,
  //   update: 0,
  // })

  // const [transfer, setTransfer] = useState({
  //   total: 0,
  //   update: 0,
  // })

  // const [slaughter, setSlaughter] = useState({
  //   total: 0,
  //   update: 0,
  // })
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
  const handleShow = (val) => {
    console.log(val);
    switch (val) {
      case 'transfer':
        setShow({ view: true, label: 'Tabel Transfer', modal: 'transfer' })
        break;
      case 'slaughter':
        setShow({ view: true, label: 'Tabel Sapi dipotong', modal: 'slaughter' })
        break;
      default:
        break;
    }
  };

  const [raceType, setRaceType] = useState([
    { key: 0, nama: "bali", label: "Bali" },
    { key: 1, nama: "madura", label: "Madura" },
    { key: 2, nama: "brahman", label: "Brahman" },
    { key: 3, nama: "PO", label: "PO" },
    { key: 4, nama: "brahmanCross", label: "Brahman Cross" },
    { key: 5, nama: "ongole", label: "Ongole" },
    { key: 6, nama: "aceh", label: "Aceh" },
  ])

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
      getHewan();
    });
  }

  const convertMoment = (dob) => {
    return moment().diff(moment.unix(dob / 1000000), 'days') + ' Hari'
  }

  const getHewan = () => {
    axios
      .get(`http://localhost:3001/livestocks/?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => {
        setLivestocks(res.data.livestocks)
        setPagination({ ...pagination, pageCount: res.data.count / 2 })
      })
  }

  // const getCowAlive = async () => {
  //   var x = 0
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total/alive`)
  //     .then((res) => {
  //       console.log('alive', res.data.count);
  //       // setCowAlive({ ...cowAlive, total: res.data.count })
  //     })
  //   return x
  // }

  // const getCowAliveU = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total/alive/today`)
  //     .then((res) => {
  //       return res.data.count
  //       // setCowAlive({ ...cowAlive, update: res.data.count })
  //     })
  // }

  // const getCowDead = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total/dead`)
  //     .then((res) => {
  //       return res.data.count
  //       // setCowDead({ ...cowDead, total: res.data.count })
  //     })
  // }

  // const getCowDeadU = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total/dead/today`)
  //     .then((res) => {
  //       return res.data.count
  //       // setCowDead({ ...cowDead, update: res.data.count })
  //     })
  // }

  // const getCowTotal = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total`)
  //     .then((res) => {
  //       return res.data.count
  //       // setCowTotal({ ...cowTotal, total: res.data.count })
  //       console.log(res.data.count);
  //     })
  // }

  // const getCowTotalU = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/livestock/total/today`)
  //     .then((res) => {
  //       return res.data.count
  //       // setCowTotal({ ...cowTotal, update: res.data.count })
  //     })
  // }

  // const getTransfer = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/transfer/total`)
  //     .then((res) => {
  //       return res.data.count
  //       // setTransfer({ ...transfer, total: res.data.count })
  //     })
  // }

  // const getTransferU = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/transfer/total/today`)
  //     .then((res) => {
  //       return res.data.count
  //       // setTransfer({ ...transfer, update: res.data.count })
  //     })
  // }

  // const getSlaughter = () => {
  //   axios
  //     .get(`http://localhost:3001/reports/slaughter/total`)
  //     .then((res) => {
  //       return res.data.count
  //       // setSlaughter({ ...slaughter, total: res.data.count })
  //     })
  // }

  // const getSlaughterU = () => {
  //   var x = 0
  //   axios
  //     .get(`http://localhost:3001/reports/slaughter/total/today`)
  //     .then((res) => {
  //       x = res.data.count
  //       // setSlaughter({ ...slaughter, update: res.data.count })
  //     })

  //   return x
  // }

  const getDashboard = async () => {
    axios
      .get(`http://localhost:3001/reports/dashboard`)
      .then((res) => {
        // setCowAlive({
        //   total: res.data.alive,
        //   update: res.data.aliveU
        // })
        // setCowDead({
        //   total: res.data.dead,
        //   update: res.data.deadU,
        // })
        // setCowTotal({
        //   total: res.data.total,
        //   update: res.data.totalU,
        // })
        // setTransfer({
        //   total: res.data.transfer,
        //   update: res.data.transferU
        // })
        // setSlaughter({
        //   total: res.data.slaughter,
        //   update: res.data.slaughrerU
        // })
        setDashboard({
          alive: res.data.alive,
          aliveU: res.data.aliveU,
          dead: res.data.dead,
          deadU: res.data.deadU,
          total: res.data.total,
          totalU: res.data.totalU,
          transfer: res.data.transfer,
          transferU: res.data.transferU,
          slaughter: res.data.slaughter,
          slaughterU: res.data.slaughterU,
        })
      })
  }

  useEffect(() => {
    getHewan()
    getDashboard()
  }, [pagination.currentPage])

  return (
    <>
      <ModalComp show={show} handleClose={handleClose} />
      <Row className="Justify-content-md-center pt-5">
        <Col xl={1}></Col>
        <Col xl={2}>
          <Card style={{ height: '10rem', width: '13rem', padding: '1rem' }}>
            <Card.Body>
              <Card.Title className="mb-2 text-muted"><h6><center>{`+${dashboard.totalU}`}</center></h6></Card.Title>
              <Card.Title><center>{dashboard.total}</center></Card.Title>
              <Card.Subtitle className="mb-2 text-muted"><center>Total sapi</center></Card.Subtitle>
              <Card.Text>

              </Card.Text>
              <Card.Link href="#"></Card.Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2}>
          <Card style={{ height: '10rem', width: '13rem', padding: '1rem' }}>
            <Card.Body>
              <Card.Title className="mb-2 text-muted"><h6><center>{`+${dashboard.aliveU}`}</center></h6></Card.Title>
              <Card.Title><center>{dashboard.alive}</center></Card.Title>
              <Card.Subtitle className="mb-2 text-muted"><center>Sapi hidup</center></Card.Subtitle>
              <Card.Text>

              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2}>
          <Card style={{ height: '10rem', width: '13rem', padding: '1rem' }}>
            <Card.Body>
              <Card.Title className="mb-2 text-muted"><h6><center>{`+${dashboard.deadU}`}</center></h6></Card.Title>
              <Card.Title><center>{dashboard.dead}</center></Card.Title>
              <Card.Subtitle className="mb-2 text-muted"><center>Sapi tidak hidup</center></Card.Subtitle>
              <Card.Text>

              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2}>
          <Card onClick={(e) => handleShow('transfer')} style={{ height: '10rem', width: '13rem', padding: '1rem' }}>
            <Card.Body>
              <Card.Title className="mb-2 text-muted"><h6><center>{`+${dashboard.transferU}`}</center></h6></Card.Title>
              <Card.Title><center>{dashboard.transfer}</center></Card.Title>
              <Card.Subtitle className="mb-2 text-muted"><center>Perpindahan sapi</center></Card.Subtitle>
              <Card.Text>

              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2}>
          <Card onClick={(e) => handleShow('slaughter')} style={{ height: '10rem', width: '13rem', padding: '1rem' }}>
            <Card.Body>
              <Card.Title className="mb-2 text-muted"><h6><center>{`+${dashboard.slaughterU}`}</center></h6></Card.Title>
              <Card.Title><center>{dashboard.slaughter}</center></Card.Title>
              <Card.Subtitle className="mb-2 text-muted"><center>Sapi dipotong</center></Card.Subtitle>
              <Card.Text>

              </Card.Text>
            </Card.Body>
          </Card>

        </Col>
        <Col xl={1}></Col>

      </Row>

      <Row className="Justify-content-md-center pt-3">
        <Col></Col>
        <Col xl={10} className="mb-3">
          <h1>
            Hewan Ternak
          </h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xl={10}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jenis ras</th>
                <th>Berat</th>
                <th>Lingkar Dada</th>
                <th>Panjang</th>
                <th>Jenis Kelamin</th>
                <th>Umur</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {
                (livestocks != 0) ?
                  livestocks.map((item) => {
                    return (<tr>
                      <td>{item.name}</td>
                      <td>{raceType[item.race].label}</td>
                      <td className="text-right">{item.weight.toLocaleString().replace(',', '.')} kg</td>
                      <td className="text-right">{item.heartGrith.toLocaleString().replace(',', '.')} cm</td>
                      <td className="text-right">{item.length.toLocaleString().replace(',', '.')} cm</td>
                      <td>{item.gender ? 'Jantan' : 'Betina'}</td>
                      <td className="text-right">{convertMoment(item.birth)}</td>
                      <td className="text-center">
                        <Link to={location => `/hewan/detail/${item.id}`} >
                          <Button as="input" className="mr-3" type="button" value="Lihat" />
                        </Link>
                      </td>
                    </tr>)

                  }) : <tr><td colSpan={8}><center>Tidak ada Record</center></td></tr>
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
        </Col>

      </Row>
    </>
  )
}
