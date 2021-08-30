import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Card, Col, Table, Jumbotron, Container, Pagination } from 'react-bootstrap'

export default function HewanDetail() {

    return(
        <>
            <Row className="Justify-content-md-center" className="mb-5 pt-5">
                <Col xl={1}></Col>
                <Col xl={8}>
                    <>
                    <h1>
                        Nama Hewan
                    </h1>
                    <h6 className="d-inline"># id</h6>
                    <h6 className="d-inline pl-3"># earTag</h6>
                    <h6 className="d-inline pl-3"># Ulangtahun</h6>
                    <h6 className="d-inline pl-3"># Kelamin</h6>
                    <h6 className="d-inline pl-3"># status</h6>
                    <h6 className="d-inline pl-3"># State</h6>
                    </>
                </Col>
                <Col xl={2}>
                <h5 className="float-right">
                        # address pemilik
                    </h5>
                </Col>
            </Row>
            <Row className="justify-content-md-center" className="mb-5">
                <Col xl={1}></Col>
                <Col xl={10}>
                    <h3 className="d-inline">
                        Riwayat Berat Badan
                    </h3>
                    <Button href="#" className="d-inline float-right mb-3">Tambah</Button>
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

            <Row className="justify-content-md-center" className="mb-5">
                <Col xl={1}></Col>
                <Col xl={10}>
                    <h3 className="d-inline">
                        Riwayat Kesehatan
                    </h3>
                    <Button href="#" className="d-inline float-right mb-3">Tambah</Button>
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

            <Row className="justify-content-md-center" className="mb-5">
                <Col xl={1}></Col>
                <Col xl={10}>
                    <h3 className="d-inline">
                        Riwayat Transfer
                    </h3>
                    <Button href="#" className="d-inline float-right mb-3">Tambah</Button>
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
