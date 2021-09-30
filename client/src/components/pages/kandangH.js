import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Jumbotron, Container, Pagination } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../../assets/css/pagination.css'

export default function KandangH() {
  const { contract, setContract } = useContext(ContractContext)

  const [kandangs, setKandangs] = useState([{
    _id: "",
    address: "",
    name: "",
    role: 0,
    status: 0,
  }])

  const [pagination, setPagination] = useState({
    offset: 0,
    perPage: 2,
    pageCount: 100 / 2,
    currentPage: 1
  })

  const [roleType, setRoleType] = useState([
    { role: 0, label: 'Peternak' },
    { role: 1, label: 'Stocker' },
    { role: 2, label: 'RPH' },
  ])

  const [statusType, setStatusType] = useState([
    { role: 0, label: 'Tidak Aktif' },
    { role: 1, label: 'Aktif' },
  ])

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    const offset = (selectedPage * pagination.perPage) - pagination.perPage;

    setPagination({
      ...pagination,
      currentPage: selectedPage,
      offset: offset
    }, () => {
      getKandang();
    });
  }

  const getKandang = () => {
    axios
      .get(`http://localhost:3001/users/home/?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setKandangs(res.data))
  }

  useEffect(() => {
    getKandang()
  }, [pagination])

  return (
    <>
      <Row className="Justify-content-md-center pt-5">
        <Col></Col>
        <Col xl={10} className="mb-3">
          <h1>
            Kandang
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
                <th>Alamat</th>
                <th>Hewan Ternak</th>
                <th>Role</th>
                <th>Aktif</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {
                (kandangs != 0) ?
                  kandangs.map((item) => {
                    return (<tr>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td>{item.totalLivestock}</td>
                      <td>{roleType[item.role].label}</td>
                      <td>{statusType[item.status].label}</td>
                      <td className="text-center">
                        <Link to={location => `/kandang/detail/${item.address}`} >
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
