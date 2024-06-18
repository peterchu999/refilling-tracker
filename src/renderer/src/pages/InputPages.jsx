import { Container, Form, Row, InputGroup, Button, Col } from 'solid-bootstrap'
import { For, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import Datepicker from '../components/Datepicker'
import { printQRToPdfFile } from '../../../utils/qrcode'
import { useNavigate } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'

function InputPages() {
  const navigate = useNavigate()
  const [validated, setValidated] = createSignal(false)
  const state = createQuery(() => ({
    queryKey: ['owners'],
    queryFn: async () => {
      try {
        const result = window.sqlite.ownerDataDB?.fetchOwnerData()
        return result
      } catch (error) {
        throw error
      }
    }
  }))

  const insertDataToDB = async ({
    owner,
    agent,
    netto,
    refilling_date,
    expire_date,
    owner_id,
    tank_number
  }) => {
    const insertOnlineExtinguisher = () =>
      window.api.insertExtinguisher({
        owner,
        agent,
        netto,
        refilling_date,
        expire_date,
        owner_id: owner,
        tank_number
      })

    const result = await window.sqlite.refillDataDB?.insertData(
      {
        owner,
        agent,
        netto,
        refilling_date,
        expire_date,
        owner_id,
        tank_number
      },
      insertOnlineExtinguisher
    )
    return result
  }

  const validateAndInsertData = async (e) => {
    const formTar = e.currentTarget
    if (formTar.checkValidity() === false) {
      setValidated(false)
    }
    // TODO: add more comprehend validation
    setValidated(true)
    const result = await insertDataToDB(form)
    return result
  }

  const onPrintQR = async (e) => {
    const { lastInsertRowid } = await validateAndInsertData(e)
    await printQRToPdfFile([{ id: lastInsertRowid, ...form }])
    navigate('/', { replace: true })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await validateAndInsertData(e)
      navigate('/', { replace: true })
    } catch (err) {
      alert(err)
      setValidated(false)
    }
  }

  const [form, setForm] = createStore({
    owner: '',
    agent: '',
    owner_id: null,
    netto: null,
    refilling_date: null,
    expire_date: null,
    tank_number: null
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
              list="owner"
              disabled={state.isError || state.isLoading}
              onChange={(e) => {
                const value = e.target.value
                if (value.includes('||')) {
                  const [id, name] = value.split('||')
                  setForm({ ...form, owner: name, owner_id: id })
                  e.target.value = name
                }
              }}
            />
            <datalist id="owner">
              <For each={state.data || []}>
                {(data) => {
                  return <option value={[data.id, data.name].join('||')} label={data.name} />
                }}
              </For>
            </datalist>

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
                step="0.1"
                required
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
            <Form.Control.Feedback type="invalid">Refilling Date required</Form.Control.Feedback>
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
        <Button type="submit">Add Data</Button>
        <Button class="mx-3" onClick={onPrintQR}>
          Print QR
        </Button>
      </Form>
    </Container>
  )
}

export default InputPages
