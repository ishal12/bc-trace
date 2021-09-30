import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'

export default function TableTransfer(props) {
  const [transfer, setTransfer] = useState([{
    owner: {
      userAddress: '',
      name: '',
      role: '',
    },
    key: ''
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
      .get(`http://localhost:3001/blockchains/transfer/${props.id}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setTransfer(res.data))
  }

  useEffect(() => {
    getTransfer()
  }, [pagination])

  return (
    <>
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
                <td>{props.stateType[item.owner.role]}</td>
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
    </>
  )
}