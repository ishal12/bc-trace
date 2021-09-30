import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'

export default function TableKesehatan(props) {
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
      getKesehatan();
    });
  }

  const getKesehatan = () => {
    axios
      .get(`http://localhost:3001/blockchains/hRecord/${props.id}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setHRecord(res.data))
  }

  useEffect(() => {
    getKesehatan()
  }, [pagination])

  return (
    <>
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
                <td>{props.convertMomentDate(item.healthR.timeRecord)}</td>
                <td>{web3.utils.hexToUtf8(item.healthR.description)}</td>
                <td>{web3.utils.hexToUtf8(item.healthR.action)}</td>
                <td>{(item.healthR.sick) ? 'Sakit' : 'Sehat'}</td>
                <td>{item.actor.name}</td>
              </tr>
            )
          }) : <tr><td colSpan={5}><center>Tidak ada Record</center></td></tr>}
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