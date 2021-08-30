import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Container, Pagination } from 'react-bootstrap'

export default function HewanH() {

  return (
    <>
      <Row className="Justify-content-md-center pt-5">
        <Col></Col>
        <Col xl={10} className="mb-3">
          <h1>
            Hewan Ternak
          </h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xl={10}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
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
        </Col>

      </Row>
    </>
  )
}
