import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Form, FormControl, InputGroup } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext'
import { UserContext } from '../../context/userContext';

export default function Header() {
  const { contract, setContract } = useContext(ContractContext);
  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" >
        <Navbar.Brand href="#home">LivestockTrace</Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="/">Hewan Ternak</Nav.Link>
          <Nav.Link href="/">Kandang</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {/* <Nav className="justify-content-end">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav> */}
          <Form inline>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                size="sm"
                value={
                  // contract.contracts.methods.cowsheds(user.userAddress).call()
                  user.active
                }
              />
            </InputGroup>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
