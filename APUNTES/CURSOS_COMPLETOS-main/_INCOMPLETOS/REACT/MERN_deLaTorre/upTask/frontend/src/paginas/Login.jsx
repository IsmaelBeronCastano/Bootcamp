import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword]= useState("")
  const [alerta, setAlerta]= useState({})
  
  const handleSubmit = async (e)=>{
    e.preventDefault()

    if([email, password].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return  //importante este return para detener el código
    }
    try {
      const {data}= await clienteAxios.post('/usuarios/login', {email, password})
      setAlerta({})
      localStorage.setItem('token', data.token)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta
  return (
    <>
      <h1 className="text-orange-600 font-black text-6xl capitalize">Inicia sesión y administra tus
      <span className="text-slate-700"> proyectos</span></h1>

      {msg && <Alerta  alerta={alerta} />}
      <form onSubmit={handleSubmit} 
            className= "mt-10 bg-white shadow rounded-lg p-3">
        <div className="my-3">
          <label className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="email">Email</label>
          <input value={email}
                 onChange={e=>setEmail(e.target.value)}
                 type="email"
                 id="email"
                 placeholder="Email de registro"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="password">Password</label>
          <input value={password}
                 onChange={e=>setPassword(e.target.value)}
                 type="password"
                 id="password"
                 placeholder="Escribe tu password"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
        </div>

        <input type="submit"
                value="Iniciar Sesión"
                className="bg-orange-600 w-full mb-5 text-white uppercase font-bold rounded p-3 hover:cursor-pointer
                hover:bg-orange-700 transition-colors" />
      </form>

        <nav className="lg:flex lg:justify-between">
          <Link to="/registrar"
                className="block text-center my-5 text-slate-500 uppercase text-sm"
          >¿No tienes una cuenta? Regístrate</Link>
          <Link to="/olvide-password"
                className="block text-center my-5 text-slate-500 uppercase text-sm"
          >¿Olvidaste tu password? Recuperalo aquí</Link>
        </nav>
    </>
  )
}

export default Login