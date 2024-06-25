import { Container, Nav, Navbar } from 'solid-bootstrap'
import { A } from '@solidjs/router'

function CustomNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav class="me-auto">
            <A class="nav-link" href="/">Database</A>
            <A class="nav-link" href="/input">Input Data</A>
            <A class="nav-link" href="/owner">Owner Management</A>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
