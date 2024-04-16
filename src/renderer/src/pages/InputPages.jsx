import { Container, Form, Row, InputGroup, Button, Col } from 'solid-bootstrap'
import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import Datepicker from '../components/Datepicker'

function InputPages(props) {
  const insertDataToDB = ({ owner, agent, netto, refilling_date, expire_date }) => {
    console.log({ owner, agent, netto, refilling_date, expire_date })
    const result = window.sqlite.refillDataDB?.insertData({
      owner,
      agent,
      netto,
      refilling_date,
      expire_date
    })
    console.log(result)
  }

  const onPrintQR = (e) => {
    onSubmit(e)
    // TODO: handle print QR
  }

  const onSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const formTar = e.currentTarget
    if (formTar.checkValidity() === false) {
      setValidated(false)
    }

    // TODO: add more comprehend validation
    setValidated(true)

    insertDataToDB(form)
  }

  const [validated, setValidated] = createSignal(false)

  const [form, setForm] = createStore({
    owner: '',
    agent: '',
    netto: null,
    refilling_date: null,
    expire_date: null
  })

  return (
    <Container fluid>
      <h2>Input Data</h2>
      <Form noValidate validated={validated()} onSubmit={onSubmit}>
        <Row class="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Owner</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Owner Required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Agent</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setForm({ ...form, agent: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Agent Required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Netto</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="number"
                required
                onChange={(e) => setForm({ ...form, netto: e.target.value })}
              />
              <InputGroup.Text id="inputGroupPrepend">Kg</InputGroup.Text>
              <Form.Control.Feedback type="invalid">Need to Be number</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row class="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Refilling Date</Form.Label>
            <Datepicker
              required
              onChange={(e) => setForm({ ...form, refilling_date: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Refilling Date required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom04">
            <Form.Label>Expire Date</Form.Label>
            <Datepicker
              required
              onChange={(e) => setForm({ ...form, expire_date: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Expire Date Required</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit">Add Data</Button>
        <Button class="mx-3" onClick={onPrintQR}>
          Print QR
        </Button>
      </Form>
    </Container>
  )
}

export default InputPages
