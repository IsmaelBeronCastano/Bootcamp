import { useState } from 'react'
import {Link} from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const Registrar = () => {

      const [nombre, setNombre] = useState("")
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [repetirPassword, setRepetirPassword] = useState("")
      const [alerta, setAlerta] = useState({})

      const handleSubmit = async (e)=>{
            e.preventDefault()
            if([nombre,email,password,repetirPassword].includes("")){
                  setAlerta({
                        msg: "Todos los campos son obligatorios",
                        error: true
                  })
                  return
            } 
            if(password !== repetirPassword){
                  setAlerta({
                        msg: "Los passwords no coinciden",
                        error: true
                  })
                  return
            }          
            if(password.length < 6){
                  setAlerta({
                        msg: "El password es muy corto. Añade al menos 6 caracteres",
                        error: true
                  })
                  return
            }  
            
            setAlerta({})
            
            try {
                 const {data}  = await clienteAxios.post('/usuarios', {nombre, password, email})  
                 setAlerta({
                  msg: data.msg,
                  error: false
                 })
                 setNombre("")
                 setEmail("")
                 setPassword("")
                 setRepetirPassword("")
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
    <h1 className="text-orange-600 font-black text-6xl capitalize">Regístrate y administra tus
    <span className="text-slate-700"> proyectos</span></h1>
      {msg && <Alerta alerta ={alerta} />}

    <form className= "mt-10 bg-white shadow rounded-lg p-3"
      onSubmit={handleSubmit}>
      <div className="my-3">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="nombre">Nombre</label>
        <input type="text"
               id="nombre"
               value={nombre}
               onChange={e=>setNombre(e.target.value)}
               placeholder="Escribe tu nombre"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>
      
      <div className="my-3">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="email">Email</label>
        <input type="email"
               id="email"
               value={email}
               onChange={e=>setEmail(e.target.value)}
               placeholder="Email de registro"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>
      <div className="my-5">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">Password</label>
        <input type="password"
               id="password"
               value={password}
               onChange={e=>setPassword(e.target.value)}
               placeholder="Escribe tu password"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>
      <div className="my-5">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password2">Repetir password</label>
        <input type="password"
               id="password2"
               value={repetirPassword}
               onChange={e=>setRepetirPassword(e.target.value)}
               placeholder="Repetir password"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>

      <input type="submit"
              value="Registrarse"
              className="bg-orange-600 w-full mb-5 text-white uppercase font-bold rounded p-3 hover:cursor-pointer
              hover:bg-orange-700 transition-colors" />
    </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
        >¿Ya tienes una cuenta? Inicia sesión</Link>
        <Link to="/olvide-password"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
        >¿Olvidaste tu password? Recuperalo aquí</Link>
      </nav>
  </>
  )
}

export default Registrar