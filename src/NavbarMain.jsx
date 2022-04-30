import logo from './logo.svg';
import React from "react";
import Navbar  from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container  from "react-bootstrap/Container";


export default function MainNavbar(){
    return(
      <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="50"
            height="50"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/reservoir">ResCal</Nav.Link>
      </Nav>
  
      </Container>
    </Navbar>
    )
  }