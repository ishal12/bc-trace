import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import { ContractContext } from '../../../context/contractContext'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'

export default function PemotonganDitolak(props) {
  const { contract, setContract } = useContext(ContractContext)

  const [livestocks, setLivestocks] = useState([{
    addressRPH: '',
    beefId: '',
    age: 0,
    status: '',
    updatedAt: '',
    _livestock: {
      _id: '',
      id: '',
      name: '',
      earTag: '',
      weight: 0,
      length: 0,
      heartGrith: 0,
      gender: false,
      birth: '',
      race: 0,
      alive: false,
      createdAt: '',
      updatedAt: '',
      address: ''
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
      getHewan();
    });
  }

  const getHewan = () => {
    axios
      .get(`http://localhost:3001/slaughters/ditolak/${contract.accounts}?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setLivestocks(res.data))
  }

  useEffect(() => {
    getHewan()
  }, [contract, pagination])

  return (
    <>
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
            <th>Alasan</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {(livestocks.length !== 0) ?
            livestocks.map((item) => {
              return (<tr>
                <td>{item._livestock.name}</td>
                <td>{props.raceType[item._livestock.race].label}</td>
                <td className='text-right'>{item._livestock.weight.toLocaleString().replace(',', '.')} kg</td>
                <td className='text-right'>{item._livestock.heartGrith.toLocaleString().replace(',', '.')} cm</td>
                <td className='text-right'>{item._livestock.length.toLocaleString().replace(',', '.')} cm</td>
                <td className='text-right'>{item._livestock.gender ? 'Jantan' : 'Betina'}</td>
                <td>{item.age} Hari</td>
                <td>{item.status}</td>
                <td className="text-center">
                  <Button as="input" className="mr-3" type="button" value="Lihat" onClick={(e) => props.handleShow(e, item)} />
                </td>
              </tr>)

            }) : <tr><td colSpan={9}><center>Tidak ada Record</center></td></tr>

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
    </>
  )
}