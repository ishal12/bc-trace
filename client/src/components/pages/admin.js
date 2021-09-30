import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Row, Col, Table, Pagination, Tab, Tabs, Spinner } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext';
import { UserContext } from '../../context/userContext';
import axios from 'axios'
import TablePendaftar from './admin/tablePendaftar'
import TablePengguna from './admin/tablePengguna'

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const { contract, setContract } = useContext(ContractContext);

  const [key, setKey] = useState('pendaftar');

  const [roleType, setRoleType] = useState([
    { key: 0, label: 'Peternak' },
    { key: 1, label: 'Stocker' },
    { key: 2, label: 'RPH' },
  ])

  const [statusType, setStatusType] = useState([
    { key: 0, label: 'Tidak Aktif' },
    { key: 1, label: 'Aktif' },
    { key: 2, label: 'Proses' },
  ])

  useEffect(() => {

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
              <TablePendaftar roleType={roleType} statusType={statusType} />
            </Tab>

            <Tab eventKey="pengguna" title="Pengguna">
              <TablePengguna roleType={roleType} statusType={statusType} />
            </Tab>
          </Tabs>

        </Col>
      </Row>
    </>
  )
}
