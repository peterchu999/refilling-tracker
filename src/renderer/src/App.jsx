import { Route, Router } from '@solidjs/router'
import InputPages from './pages/InputPages'
import Navbar from './components/Navbar'

function Root(props) {
  return (
    <>
      <Navbar/>
      {props.children}
    </>
  )
}

function App() {
  return <Router root={Root}>
    <Route path="/" component={InputPages}/>
  </Router>
}

export default App
