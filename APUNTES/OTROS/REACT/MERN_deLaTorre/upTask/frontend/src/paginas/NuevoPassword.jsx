import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from "../config/clienteAxios"

const NuevoPassword = () => {

  const params = useParams()
  const {token} = params

  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
       await clienteAxios.get(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit=async (e)=>{
    e.preventDefault()

    if(password.length < 6){
      setAlerta({
        msg: "el password debe contener al menos 6 caracteres",
        error: true
      })
    }

    try {
      const {data}= await clienteAxios.post(`/usuarios/nuevo-password/${token}`, {password})
      setAlerta({
        msg: data.msg,
        error: false
      })
      
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
    <h1 className="text-orange-600 font-black text-6xl capitalize">Escribe tu nuevo
    <span className="text-slate-700"> password</span></h1>
    {msg && <Alerta alerta={alerta} />}
    
    {tokenValido && <form onSubmit={handleSubmit} className= "mt-10 bg-white shadow rounded-lg p-3">
      
      <div className="my-5">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">Nuevo password</label>
        <input
              value={password}
              onChange={e=>setPassword(e.target.value)} 
              type="password"
               id="password"
               placeholder="Escribe tu nuevo password"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>

      <input type="submit"
              value="Guardar Nuevo Password"
              className="bg-orange-600 w-full mb-5 text-white uppercase font-bold rounded p-3 hover:cursor-pointer
              hover:bg-orange-700 transition-colors" />
    </form>}
  </>
  )
}

export default NuevoPassword