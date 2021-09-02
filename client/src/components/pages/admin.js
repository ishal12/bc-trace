import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Pagination, Tab, Tabs, Spinner } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext';
import { UserContext } from '../../context/userContext';
import axios from 'axios'

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const { contract, setContract } = useContext(ContractContext);
  const { user, setUser } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [key, setKey] = useState('pendaftar');

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

  useEffect(() => {
    axios
      .get('http://localhost:3001/users/')
      .then((res) => setUsers(res.data))
  }, [])
  return (
    <>
      {
        loading &&
        console.log('Loading')
      }
      {
        !loading &&
        console.log('Loading False')
      }
      <Row className="Justify-content-md-center" className="mb-5 pt-5">
        <Col xl={1}></Col>
        <Col xl={8}>
          <>
            <h1>
              Admin
            </h1>
            <h6 className="d-inline"># {contract.accounts}</h6>
            <h6 className="d-inline pl-3"># {contract.isAdmin ? 'Admin' : 'Error'}</h6>
          </>
        </Col>
      </Row>
      <Row className="justify-content-md-center" className="mb-5">
        <Col xl={1}></Col>
        <Col xl={10}>
          <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="pendaftar" title="Pendaftar">
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
                  {
                    users.map((item) => item.status == 2 && (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>
                          {
                            item.role == 0 &&
                            "Peternak"
                          }
                          {
                            item.role == 1 &&
                            "Stocker"
                          }
                          {
                            item.role == 2 &&
                            "RPH"
                          }
                        </td>
                        <td>
                          {
                            item.status == 1 &&
                            "Aktif"
                          }
                          {
                            item.status == 0 &&
                            "Tidak Aktif"
                          }
                          {
                            item.status == 2 &&
                            "Pending"
                          }
                        </td>
                        <td align="center">
                          {
                            item.status == 2 &&
                            <Button as="input" onClick={(event) => { event.preventDefault(); addUser(item.address, item.name, item.role) }} type="button" value="Tambah" />
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <Pagination className="">
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </Tab>
            <Tab eventKey="pengguna" title="Pengguna">
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
                  {
                    users.map((item) => item.status != 2 && (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>
                          {
                            item.role == 0 &&
                            "Peternak"
                          }
                          {
                            item.role == 1 &&
                            "Stocker"
                          }
                          {
                            item.role == 2 &&
                            "RPH"
                          }
                        </td>
                        <td>
                          {
                            item.status == 1 &&
                            "Aktif"
                          }
                          {
                            item.status == 0 &&
                            "Tidak Aktif"
                          }
                          {
                            item.status == 2 &&
                            "Pending"
                          }
                        </td>
                        <td align="center">
                          {
                            item.status == 2 &&
                            <Button as="input" onClick={(event) => { event.preventDefault(); addUser(item.address, item.name, item.role) }} type="button" value="Tambah" />
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </Tab>
          </Tabs>

        </Col>
      </Row>
    </>
  )
}
