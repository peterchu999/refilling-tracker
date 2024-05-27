import { Container, Form, Row, InputGroup, Button, Col, Table as BTable } from 'solid-bootstrap'
import { Match, Switch, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { encryptPassword, generateSaltKey } from '../../../utils/auth'
import { createQuery } from '@tanstack/solid-query'

function OwnerPage() {
  const validateAndInsertData = (e) => {
    const formTar = e.currentTarget
    if (formTar.checkValidity() === false) {
      setValidated(false)
    }

    // TODO: add more comprehend validation
    // setValidated(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await validateAndInsertData(e)

    try {
      const salt = generateSaltKey()
      const encryptedPassword = window.api.encryptPassword(form.password)
      const result = await window.api.insertOwner({ ...form, password: encryptedPassword, salt })
      const inner = window.sqlite.ownerDataDB.insertOwnerData({ ...form, id: result.id })
      setValidated(true)
      return inner
    } catch (error) {
      setValidated(false)
      alert(error)
    }
  }

  const owners = createQuery(() => ({
    queryKey: ['owners'],
    queryFn: async () => {
      try {
        const result = window.api.fetchOwners()
        return result
      } catch (error) {
        throw error
      }
    }
  }))

  const [validated, setValidated] = createSignal(false)

  const [form, setForm] = createStore({
    name: null,
    username: null,
    password: null
  })

  return (
    <Container fluid>
      <h2>Create New Owner</h2>
      <Form noValidate validated={validated()} onSubmit={onSubmit}>
        <Row class="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Name Required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Username Required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">Password Invalid</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Button type="submit">Add Data</Button>
      </Form>
      <Switch>
        <Match when={owners.isLoading}>
          <p>Is loading</p>
        </Match>
        <Match when={owners.isError}>
          <Text>Is loading</Text>
        </Match>
        <Match when={owners.data}>
          <BTable class='mt-3' striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>Nama Perusahaan</th>
                <th>Username Perusahaan</th>
              </tr>
            </thead>
            <tbody>
              <For each={owners.data}>
                {(datum) => {
                  console.log(datum)
                  return (
                    <tr>
                      <td>{datum.name}</td>
                      <td>{datum.username}</td>
                    </tr>
                  )
                }}
              </For>
            </tbody>
          </BTable>
        </Match>
      </Switch>
    </Container>
  )
}

export default OwnerPage
