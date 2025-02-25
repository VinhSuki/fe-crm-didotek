import AuthProvider from './context/Auth/AuthProvider'
import AppRouter from './routes/routes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
      // <AppRouter />
  )
}

export default App
