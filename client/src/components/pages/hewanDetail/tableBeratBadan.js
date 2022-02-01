import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'

export default function TableBeratBadan(props) {
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
      getWRecord();
    });
  }

  const getWRecord = () => {
    axios
      .get(`http://localhost:3001/blockchains/wRecord/${props.id}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => {
        setWRecord(res.data.record)
        setPagination({ ...pagination, pageCount: res.data.count / 2 });
      })
  }

  useEffect(() => {
    getWRecord()
  }, [pagination.currentPage])

  return (
    <>
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
                <td>{props.convertMomentDate(item.weightR.timeRecord)}</td>
                <td className='text-right'>{Number(item.weightR.weight).toLocaleString().replace(',', '.')} kg</td>
                <td className='text-right'>{Number(item.weightR.heartGrith).toLocaleString().replace(',', '.')} cm</td>
                <td className='text-right'>{Number(item.weightR.length).toLocaleString().replace(',', '.')} cm</td>
                <td>{item.actor.name}</td>
              </tr>
            )
          }) : <tr><td colSpan={5}>Tidak ada Record</td></tr>}
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