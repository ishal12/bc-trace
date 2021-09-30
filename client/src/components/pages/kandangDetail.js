import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../../assets/css/pagination.css'
import moment from 'moment'
import 'moment/locale/id'

export default function KandangDetail() {
  const { address } = useParams()
  const [jabatan, setJataban] = useState([
    { label: 'Peternak' },
    { label: 'Stocker' },
    { label: 'RPH' },
  ])
  const [user, setUser] = useState({
    _id: '',
    address: '',
    name: '',
    role: 0,
    status: 0,
  })
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
      .get(`http://localhost:3001/livestocks/${address}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setLivestocks(res.data))
  }

  const getUser = () => {
    axios
      .get(`http://localhost:3001/users/${address}`)
      .then((res) => setUser(res.data))
  }

  useEffect(() => {
    getHewan()
    getUser()
  }, [pagination])

  return (
    <>
      <Row className="Justify-content-md-center pt-5">
        <Col></Col>
        <Col xl={10} className="mb-3">
          <h1>
            {user.name}
          </h1>
          <h6 className="d-inline"># {user.address}</h6>
          <h6 className="d-inline pl-3"># {jabatan[user.role].label}</h6>
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
                      <td>{item.weight}</td>
                      <td>{item.heartGrith}</td>
                      <td>{item.length}</td>
                      <td>{item.gender ? 'Jantan' : 'Betina'}</td>
                      <td>{convertMoment(item.birth)}</td>
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
