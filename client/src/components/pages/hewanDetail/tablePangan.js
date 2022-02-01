import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'

export default function TablePangan(props) {
  const [feed, setFeed] = useState([{
    feedType: '',
    amount: '',
    measurement: '',
    actor: '',
    createdAt: ''
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
      getFeed();
    });
  }

  const getFeed = () => {
    axios
      .get(`http://localhost:3001/livestocks/feedRecord/${props.id}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => {
        setFeed(res.data.feed)
        setPagination({ ...pagination, pageCount: res.data.count / 2 })
      })
  }

  useEffect(() => {
    getFeed()
  }, [pagination.currentPage])

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Jenis Pangan</th>
            <th>Sebesar</th>
            <th>Pemberi</th>
          </tr>
        </thead>
        <tbody>
          {(feed.length != 0) ? feed.map((item) => {
            return (
              <tr>
                <td>{moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                <td>{item.feedType}</td>
                <td className='text-right'>{item.amount.toLocaleString().replace(',', '.')} {item.measurement}</td>
                <td>{item.actor}</td>
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