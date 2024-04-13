import {Table} from "solid-bootstrap"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div class="creator">Powered by electron-vite</div>
      <div class="text">
        Build an Electron app with <span class="solid">Solid</span>
      </div>
      <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
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
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
      <div class="actions">
        <div class="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
        </div>
        <div class="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>Send IPC</a>
        </div>
      </div>
      {/* <Versions /> */}
    </>
  )
}

export default App
