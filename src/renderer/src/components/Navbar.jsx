import { Container, Nav, Navbar } from "solid-bootstrap"

function CustomNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav class="me-auto">
            <Nav.Link href="/">Database</Nav.Link>
            <Nav.Link href="/input">Input Data</Nav.Link>
            <Nav.Link href="/owner">Owner Management</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


export default CustomNavbar
