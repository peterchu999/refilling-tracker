import { Form } from 'solid-bootstrap'

function Datepicker(props) {
  return (
    <>
      <Form.Control type="date" {...props} />
    </>
  )
}

export default Datepicker
