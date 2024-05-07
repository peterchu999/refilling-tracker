import { Route, Router } from '@solidjs/router'
import InputPages from './pages/InputPages'
import Navbar from './components/Navbar'
import DatabasePage from './pages/DatabasePage'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import OwnerPage from './pages/OwnerPage'

const queryClient = new QueryClient()

function Root(props) {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router root={Root} base="/">
        <Route path="/" component={DatabasePage} />
        <Route path="/input" component={InputPages} />
        <Route path="/owner" component={OwnerPage} />
      </Router>
    </QueryClientProvider>
  )
}

export default App
