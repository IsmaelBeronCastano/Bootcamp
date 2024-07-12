import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AuthLayout from '../src/layouts/AuthLayout'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import NuevoPassword from '../src/paginas/NuevoPassword'


function App() {
 return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="registrar" element={<Registrar />} />
        <Route path="olvide-password" element={<OlvidePassword />} />
        <Route path="olvide-password/:token" element={<NuevoPassword />} />
        <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
      </Route>
    </Routes>
  </BrowserRouter>
 )
}

export default App
