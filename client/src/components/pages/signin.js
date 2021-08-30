import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext'
import axios from 'axios'
import { UserContext } from '../../context/userContext'

export default function Signin() {
  const { contract, setContract } = useContext(ContractContext);
  const { user, setUser } = useContext(UserContext);

  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState({
    address: '',
    name: '',
    role: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    axios
      .post('http://localhost:3001/users/add', users)
      .then((res) => console.log(res.data))
    // console.log(user);
  }

  const handleAddress = (event) => {
    event.persist();
    setUsers((values) => ({
      ...values,
      address: event.target.value,
    }))
  }

  const handleName = (event) => {
    event.persist();
    setUsers((values) => ({
      ...values,
      name: event.target.value,
    }))
  }

  const handleRole = (event) => {
    event.persist();
    setUsers((values) => ({
      ...values,
      role: event.target.value,
    }))
  }

  useEffect(() => {
    setUsers({ address: contract.accounts[0] });
  }, [contract])

  return (
    <>
      <Row className="justify-content-md-center pt-5">
        <Card style={{ width: '50rem' }}>
          <Card.Header>Pendaftaran</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextAddress">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="text" name="address" onChange={handleAddress} readOnly value={contract.accounts[0]} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
                <Form.Label column sm="2">
                  Nama
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="text" name="name" onChange={handleName} value={users.name} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  Jabatan
                </Form.Label>
                <Col sm="10">
                  <Form.Control as="select" name="role" onChange={handleRole} value={users.role} placeholder={'pilih'}>
                    <option hidden>Pilih jabatan</option>
                    <option value="0">Peternak</option>
                    <option value="1">Stocker</option>
                    <option value="2">RPH</option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    </>
  )
}
