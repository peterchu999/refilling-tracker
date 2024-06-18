import { Container, Form, Row, InputGroup, Col, Button, Modal } from 'solid-bootstrap'
import { For, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import Datepicker from '../components/Datepicker'
import { useNavigate } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'

function UpdateExtingusiherModal({ show, setShow, refresh, data }) {
  const navigate = useNavigate()
  const [validated, setValidated] = createSignal(false)

  const updateDataToDB = async ({ agent, netto, refilling_date, expire_date, tank_number }) => {
    const updateOnlineExtinguisher = () =>
      window.api.updateExtinguisher({
        agent,
        netto,
        refilling_date,
        expire_date,
        tank_number,
        id: data.id
      })

    const result = await window.sqlite.refillDataDB?.updateData({
      agent,
      netto,
      refilling_date,
      expire_date,
      tank_number,
      id: data.id
    })
    return result
  }

  const validateData = async (e) => {
    const formTar = e.currentTarget
    if (formTar.checkValidity() === false) {
      setValidated(false)
    }
    // TODO: add more comprehend validation
    setValidated(true)
  }

  const updateData = async () => {
    return updateDataToDB(form)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      validateData(e)
      await updateData()
      setShow(false)
      refresh()
    } catch (err) {
      alert(err)
      setValidated(false)
    }
  }

  const [form, setForm] = createStore({
    agent: data.agent,
    netto: data.netto,
    refilling_date: null,
    expire_date: null,
    tank_number: data.tank_number
  })

  const onShow = () => {
    setForm({
      agent: data.agent,
      netto: data.netto,
      refilling_date: null,
      expire_date: null,
      tank_number: data.tank_number
    })
  }

  return (
    <div>
      <Modal
        size="lg"
        show={show()}
        onShow={onShow}
        aria-labelledby="update-extinguisher-modal"
        onHide={() => {
          setShow(false)
        }}
        // renderBackdrop={(props) => <div class="modal-backdrop show" {...props} />}
        class="modal d-block pe-none"
      >
        <Modal.Header closeButton>
          <Modal.Title id="update-extinguisher-modal">Edit Data</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated()} onSubmit={onSubmit}>
          <Modal.Body>
            <Row class="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Owner</Form.Label>
                <Form.Control required type="text" disabled value={data.owner} />

                <Form.Control.Feedback type="invalid">Owner Required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Agent</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={data.agent}
                  onChange={(e) => setForm({ ...form, agent: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">Agent Required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                <Form.Label>Netto</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="number"
                    step="0.1"
                    required
                    value={data.netto}
                    onChange={(e) => setForm({ ...form, netto: e.target.value })}
                  />
                  <InputGroup.Text id="inputGroupPrepend">Kg</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">Need to Be number</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row class="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>No. Tabung</Form.Label>
                <Form.Control
                  type="text"
                  value={data.tank_number}
                  onChange={(e) => setForm({ ...form, tank_number: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">Agent Required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Refilling Date</Form.Label>
                <Datepicker
                  required
                  onChange={(e) => setForm({ ...form, refilling_date: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                  Refilling Date required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom04">
                <Form.Label>Expire Date</Form.Label>
                <Datepicker
                  required
                  onChange={(e) => setForm({ ...form, expire_date: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">Expire Date Required</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit">Edit Data</Button>
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  )
}

export default UpdateExtingusiherModal
