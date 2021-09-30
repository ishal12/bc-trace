import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Modal, Pagination } from 'react-bootstrap'
import web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id'
import ReactPaginate from 'react-paginate'
import '../../../assets/css/pagination.css'
import { ContractContext } from '../../../context/contractContext';

export default function TablePangan(props) {
  const [loading, setLoading] = useState(false);
  const { contract, setContract } = useContext(ContractContext);
  const [users, setUsers] = useState([]);

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
      getPendaftar();
    });
  }

  const addUser = (address, name, role) => {
    setLoading(true);
    contract.contracts.methods
      .registerCowshed(address, name, role)
      .send({ from: contract.accounts[0] })
      .on('receipt', (receipt) => {
        setLoading(false)
        axios
          .patch(`http://localhost:3001/users/activate/${address}`, {
            txHash: receipt.transactionHash
          })
          .then((res) => {
            console.log(res.data)
            window.location.reload()
          })

      });
  }

  const getPendaftar = () => {
    axios
      .get(`http://localhost:3001/users/process/?offset=${pagination.offset}&perPage=${pagination.perPage}`)
      .then((res) => setUsers(res.data))
  }

  useEffect(() => {
    getPendaftar()
  }, [pagination])

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Address</th>
            <th>Jabatan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {(users != 0) ?
            users.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{props.roleType[item.role].label}</td>
                  <td>{props.statusType[item.status].label}</td>
                  <td align="center">
                    <Button as="input" onClick={(event) => { event.preventDefault(); }} type="button" value="Tambah" />
                  </td>
                </tr>
              )
            }) : <tr><td colSpan={5}><center>Tidak ada Record</center></td></tr>
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