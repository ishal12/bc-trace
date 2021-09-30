import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Form, FormControl, InputGroup } from 'react-bootstrap'
import { ContractContext } from '../../context/contractContext'
import { UserContext } from '../../context/userContext';

export default function Header() {
  const { contract, setContract } = useContext(ContractContext);
  const { user, setUser } = useContext(UserContext)

  const [headerHome, setHeaderHome] = useState({
    link: '/home'
  })

  useEffect(() => {
    if (user.length != 0) {
      if (user.role == 0 || user.role == 1) {
        setHeaderHome({ link: '/home' })
      } else if (user.role == 2) {
        setHeaderHome({ link: '/rph' })
      }
    }
  }, [user])

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" >
        <Navbar.Brand href={headerHome.link}>LivestockTrace</Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="/hewan">Hewan Ternak</Nav.Link>
          <Nav.Link href="/kandang">Kandang</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
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
                  user.userAddress
                }
              />
            </InputGroup>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
