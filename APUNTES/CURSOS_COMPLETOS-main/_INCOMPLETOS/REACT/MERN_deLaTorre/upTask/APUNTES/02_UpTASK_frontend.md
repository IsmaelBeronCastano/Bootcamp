# 02 MERN UPTASK

## Frontend

> npm create vite@latest frontend

- Y dentro de /frontend

> npm i

- Dependencias

> npm i react-router-dom axios

- Hago limpieza de archivos. Dejo solo el App.jsx con un h1 y el index.css vacío
- Para instalar **Tailwind**

> npm i -D tailwindcss postcss autoprefixer

- Para crear el archivo de configuración de tailwind y postcss

> npx tailwindcss init -p

- En tailwind.config.js añado en content los archivos que van a ser afectados por Tailwind

~~~js
export default {
  content: ["index.html", "./src/**/*.jsx"],
  theme: {
    extend: {},
  },
  plugins: [],
}
~~~

- En index.css añado en la cabecera

~~~css
@tailwind base;
@tailwind components;
@tailwind utilities;
~~~

- En el index.html cambio el nombre del proyecto y en el body le añado un gray y un min-height de 100vh

~~~html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UpTask MERN</title>
  </head>
  <body class="bg-gray-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
~~~
-----

## Routing con React-Router-Dom 6

- En App.jsx importo de react-router-dom BrowserRouter, Routes y Route
- Tenemos dos áreas: 
  - Un área pública dónde registrar usuarios, login, etc
  - Un área privada para el manejo de proyectos y tareas
- Creo las carpetas /layouts  /componentes  /paginas
  - Creo en /layouts/AuthLayout.jsx . Componente del área pública que va a contener el formulario para registrarse, iniciar sesión, olvidé mi password, etc
- Le paso el componente a la ruta "/"
- En el Route interior le coloco index, es decir, el que va a ejecutarse cuando cargue "/"
- Le coloco el componente /paginas/Login.jsx

~~~jsx
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AuthLayout from '../src/layouts/AuthLayout'
import Login from './paginas/Login'


function App() {
 return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />

      </Route>
    </Routes>
  
  </BrowserRouter>

 )
}

export default App
~~~

- Para que imprima el componente Login debo definir el Outlet en AuthLayout

~~~js
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <>
      <h1>Auth Layout</h1>
      
      <Outlet />
    </>
  )
}

export default AuthLayout
~~~

- Agrego el componente Registrar al router con el path /registrar, otra de olvidePassword y NuevoPassword
- App.jsx

~~~jsx
<BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="registrar" element={<Registrar />} />
        <Route path="olvide-password" element={<OlvidePassword />} />
        <Route path="olvide-password/:token" element={<NuevoPassword />} />
        <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
      </Route>
    </Routes>
  </BrowserRouter>
~~~
--------

## Creando el Layout principal

- Vamos a aplicar algunos estilos al Layout principal
- mx-auto va a centrar el contenido, mt para margin top, md: es para media query, un margin top de 10
- md: flex, un display de flex en el tamaño mediano y justify-center para que esté centrado
- En el div el coloco un md (mediaquery de tamaño mediano) que ocupe 2 terceras partes
- En un tamaño más grande (lg) tomará un tercio de la pantalla. Coloco el Outlet dentro del div
### NOTA: puedo ponerle un fondo de color con bg-red-200 y ajustar la pantalla para ver el responsive

~~~jsx
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto mt-5 md:mt-10 p-5 md:flex md:justify-center">
        <div className="md:w-2/3 lg:w-1/3">
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default AuthLayout
~~~
-----

## Login

- text-6xl para aumentar de tamaño, capitalize hace mayúscula el inicio de cada palabra
- En el **formulario** cada campo va a estar en un div
- Le agrego al form un margin en y de 10, fondo blanco, shadow (sombra) y esquinas redondeadas con rounded-lg
  - También un padding de 5 en todas direcciones
- En el **label** le coloco un block para que tome todo el ancho y empuje el input hacia abajo
- En el **input** coloco w-full para que tome todo el ancho
- Le coloco un border para que marque el controno y un padding en todas direcciones para hacer más grande el input
- En el **label** coloco un **htmlFor que apunta al id del input**. De esta manera lo hago accesible cuando clico sobre el label

~~~jsx

const Login = () => {
  return (
    <>
      <h1 className="text-orange-600 font-black text-6xl capitalize">Inicia sesión y administra tus
      <span className="text-slate-700"> proyectos</span></h1>

      <form className= "my-10 bg-white shadow rounded-lg p-5">
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="email">Email</label>
          <input type="email"
                 id="email"
                 placeholder="Email de registro"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
        </div>
      </form>
    </>
  )
}

export default Login
~~~

- El diseño de este div lo copio para el password

~~~jsx
<div className="my-5">
    <label className="uppercase text-gray-600 block text-xl font-bold"
        htmlFor="password">Password</label>
    <input type="password"
            id="password"
            placeholder="Escribe tu password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
</div>
~~~

- Coloco un **input** dentro del form para hacer el submit
- Le añado un efecto hover y un transition

~~~jsx
<input type="submit"
        value="Iniciar Sesión"
        className="bg-orange-600 w-full mb-5 text-white uppercase font-bold rounded p-3 hover:cursor-pointer
        hover:bg-orange-700 transition-colors" />
~~~
-----

## Añadiendo el routing a las otras páginas del área pública

- Le añado un nav fuera del form, con display flex y justify:between para que quede uno a cada lado
- Importo Link de react-router-dom para apuntar a las otras páginas, en este caso Registrar y OlvidePassword
- Login.jsx

~~~jsx
<nav className="lg:flex lg:justify-between">
  <Link to="/registrar" 
    className="block text-center my-5 text-slate-500 uppercase text-sm"
  >¿No tienes una cuenta? Regístrate</Link>
  <Link to="/olvide-password"
        className="block text-center my-5 text-slate-500 uppercase text-sm"
  >¿Olvidaste tu password? Recuperalo aquí</Link>
</nav>
~~~

- Para crear la página de Registrar es muy similar. Copio el Fragment y lo llevo al componente Registrar
- Cambio el titulo por Regístrate para administrar tus proyectos
- Le añado dos campos más, uno para el nombre y otro para repetir password
- Importo Link de react-router-dom
  - Esta vez los dirijo a "/" y "/olvide-password"
- Para OlvidePassword solo necesito el email en el formulario. Copio el fragment y dirijo los links a iniciar y registrarse
- Creo ConfirmarCuenta y NuevoPassword
- Una vez más copio todo el contenido a NuevoPassword
- Solo un input de password, esta página no tiene nav
- Para ConfirmarCuenta solo copio el h1 y le pongo Confirma tu cuenta y empieza a crear tus proyectos
- Será una página dónde clicar un link, no hay nav
--------

## Abriendo state al formulario de Registrar

- Este proyecto va a manejar el state de forma global con context pero en el caso de este formulario no es necesario
- Solamente se requiere aquí, en este componente, la información
- Elimino todas las colecciones que tengo en MongoCompass para asegurarme que lo que se agregue sea desde la interfaz gráfica
- Voy a Registrar.jsx
- Creo un state por cada input dentro del componente, antes del return. Los inicio como strings vacíos

~~~jsx
const Registrar = () => {
  
  const [nombre, setNombre] = useState("")
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [repetirPassword, setRepetirPassword] = useState("")
      
  return (...)
}
~~~

- Añado el value y el onChange en el input
- Ejemplo de input

~~~jsx
<input type="text"
        id="nombre"
        value={nombre}
        onChange={e=>setNombre(e.target.value)}
        placeholder="Escribe tu nombre"
        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
~~~

- Si voy a React Developer Tools, Components y me sitúo en Registrar puedo observar en consola los states
- Para trabajar con el submit creo la función handleSubmit. Uso prevent default para prevenir la acción por default y que no refresque el navegador con el submit
- Para **validar el formulario** empiezo por validar que todos los campos tengan algo
- Creo un array lo que me hace disponible el método includes
## NOTA: a no ser que se especifique lo contrario, los hooks y métodos van dentro del componente, antes del return

~~~jsx
const handleSubmit = (e)=>{
      e.preventDefault()
      if([nombre,email,password,repetirPassword].includes("")){
            console.log('Todos los campos son obligatorios')
      }           
}
~~~

- Lo coloco en el onSubmit del form

~~~jsx
 <form className= "mt-10 bg-white shadow rounded-lg p-3"
      onSubmit={handleSubmit}>
~~~

- Evidentemente no va un console.log, va una alerta. Creo el componente de Alerta.jsx en /components 
- Hago el componente reutilizable para alertas buenas y malas
- Le paso el objeto alerta
- Con alerta.error hago un condicional para agregarle un gradiente rojo o verde, con bg-gradient-to-br le indico la dirección (bottom-right)
- Con alerta.message muestro el mensaje

~~~jsx
const Alerta = ({alerta}) => {
  return (

    <div className={`${alerta.error ? 'from-red-400 to-red-600': 'from-green-400 to-green-600'}
                    bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
        {alerta.msg}
    </div>
  )
}

export default Alerta
~~~

- La uso en lugar del console.log, cuando uso el if con el array de states para comprobar que no vengan vacíos
- Creo un nuevo state alerta, setAlerta. Lo inicio como un objeto vacío porque incluirá error y msg

~~~jsx
const handleSubmit = (e)=>{
      e.preventDefault()
      if([nombre,email,password,repetirPassword].includes("")){
            setAlerta({
                  msg: "Todos los campos son obligatorios",
                  error: true
            })
            return
      }           
}
~~~

- Para mostrar el componente extraigo el mensaje del state alerta antes del return. En caso de que exista significa que tiene algo, por lo que debe mostrarse. Para renderizar el componente Alerta elijo el lugar dentro del return
- Uso **&&** para que si el valor de la izquierda es true ejecute el valor de la derecha

~~~jsx
const {msg} = alerta

  return (
    <>
    <h1 className="text-orange-600 font-black text-6xl capitalize">Regístrate y administra tus
    <span className="text-slate-700"> proyectos</span></h1>
      {msg && <Alerta alerta ={alerta} />}

    <form className= "mt-10 bg-white shadow rounded-lg p-3"
      onSubmit={handleSubmit}>
      (...))
~~~

- Seguimos con las validaciones. Password y repetirPassword deben de ser iguales
- Pasadas las validaciones seteo alerta a objeto vacío para hacerlas desaparecer en caso de que haya errores
- Lo siguiente es crear el usuario y almacenarlo en la DB

~~~jsx
const handleSubmit = (e)=>{
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
            //crear usuario en la API
      }
~~~
-------

## Enviando un Request a la API y CORS

- Hago la consulta en un try catch
- Vamos a usar axios en lugar de FETCH. Lo importo
- Dentro del handleSubmit, después de las validaciones

~~~js
try {
    const respuesta  = await axios.post('http://localhost:3000/api/usuarios', {nombre, password, email})  
      } catch (error) {
            console.log(error)
      }
~~~

- Tengo que habilitar CORS para permitir recibir datos de un lado a otro
- Para habilitar CORS voy al backend

> npm i cors

- En app.js creo un whitelist. El frontend está en localhost:5173
- origin devuelve desde donde se originó la petición. Si está en el whitelist la dejará realizarse
- En caso de que no esté permitido devuelvo un error con el callback
- En caso de que esté en la lista blanca le pongo null porque no hay error y le doy acceso con un true
- Coloco el string de conexión de las dos formas, como localhost y como 127.0.0.1
- backend/app.js

~~~js
const app = express()
app.use(express.json())
dotenv.config()

conectarDB()

const whitelist = ['http://127.0.0.1:5173', 'http://localhost:5173']

const corsOptions ={
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions))
~~~

- Debo tener el servidor corriendo y el forntend también para poder hacer el POST
- Si quisiera aceptar cualquier origen debería colocar '*' en whitelist
- El usuarioAlmacenado que devuelvo en la respuesta del backend es lo que tengo en **data** (en consola, en la respuesta de la petición)
- Puedo desestructurarla directamente en la petición

~~~jsx
const {data}  = await axios.post('http://localhost:3000/api/usuarios', {nombre, password, email})
~~~

- En el controlador de crearUsuario, en el backend, en lugar de devolver el usuario voy a devolver un mensaje con .json({msg:"Usuario creado correctamente})

~~~js
try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId() 
    await usuario.save()
    
    res.json({msg: "Usuario creado correctamente. revisa tu email"})
    
} catch (error) {
    console.log(error)
}
~~~

- Vamos a mostrar este mensaje en pantalla

~~~jsx
try {
    const {data}  = await axios.post('http://localhost:3000/api/usuarios', {nombre, password, email})  
    setAlerta({
    msg: data.msg,
    error: false
    })
} catch (error) {
    console.log(error) //error.response para que axios me muestre el error
}
~~~

- De esta manera me muestra el mensaje de usuario creado correctamente en verde en pantalla
- Si intento registrar el mismo usuario salta el catch con el console.log del error
- Para acceder al mensaje de error que generé en el backend, en la docu de axios dice que se accede con error.response (está en la propiedad data)
- Accedo con msg porque yo le puse ese nombre en el controlador
- usuario.controller método crearUsuario

~~~jsx
if(existeUsuario){
      const error = new Error("Usuario ya registrado")

      return res.status(400).json({msg: error.message}) //uso msg, pero puedo ponerle el nombre que quiera
  }
~~~

- En la petición del handleSubmit del componente Registrar, para acceder al error uso error.response.data.msg
- en lugar del console.log coloco una alerta
~~~jsx
try {
    const {data}  = await axios.post('http://localhost:3000/api/usuarios', {nombre, password, email})  
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
~~~

- **Cosas a solucionar:**
  - Todavía no hemos creado el email de confirmación de cuenta
  - El formulario se queda rellenado
  - Tenemos las ruta de la petición visible, no seteada como variable de entorno
-----

## Solucionando estas cositas (lección 471)

- Para vaciar el formulario seteo los states a string vacío en el try del handleSubmit

~~~js
try {
      const {data}  = await axios.post('http://localhost:3000/api/usuarios', {nombre, password, email})  
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
~~~

- Las conexiones del whiteList en app.js para CORS debo meterlas en variables de entorno en .env
- .env

~~~
STRING_CONNECTION_CORS1=http://127.0.0.1:5173
STRING_CONNECTION_CORS2=http://localhost:5173
~~~

- Uso process.env para colocarlas en la whiteList
- En el caso de VITE es import.meta.env.VARIABLE_DE_ENTORNO
- app.js

~~~js
const whitelist = [process.env.STRING_CONNECTION_CORS1, process.env.STRING_CONNECTION_CORS2]

const corsOptions ={
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Error de Cors"))
        }
    }
}
~~~

- Ahora en el frontend creo la variable de entorno para los strings que apuntan a la API
- Debo añadir VITE_ al inicio

~~~
VITE_BACKEND_URL=http://localhost:3000
~~~

- La coloco en el try del handleSubmit en Registrar.jsx

~~~js
const {data}  = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`, {nombre, password, email}) 
~~~
--------

## Instalando y configurando NodeMailer para mail de confirmación

- Recuerda que hicimos el endpoint confirmar/:token
- Tenemos que enviarle ese token al email para que pueda confirmar la cuenta
- Para enviar emails con node vamos a usar el paquete **nodemailer** en el backend

> npm i nodemailer

- Necesitamos un servidor de emails. Podemos usar el servicio que provee **mailtrap**
- Creo la cuenta, creo el inbox UpTASK MERN
- Si entro en el inbox me ofrece las credenciales SMTP, selecciono NODE (nodemailer)
- Me devuelve algo así

~~~js
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "*******abc",
    pass: "*******32a"
  }
});
~~~

- Creo un helper emails.js donde estará olvidé mi password y confirmar cuenta
- Se añadirá un tercero para enviar confirmación cuando se publique un proyecto
- Creo la arrow function emailRegistro que va a tomar el nombre, el email y el toke (lo llamaré datos)
- La llamo en el controlador de crear usuario, después de salvar el usuario
- Le paso nombre, email y token dentro de un objeto

~~~js
const postUsuario = async (req,res)=>{
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")

        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId() 
        await usuario.save()

        emailRegistro({          //le paso los datos a emailRegistro
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        
        res.json({msg: "Usuario creado correctamente. revisa tu email"})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- En emailRegistro uso el método sendMail del transport que me ha facilitado nodeMailer
- El href tiene que apuntar al endpoint de confirmar cuenta

~~~js
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "*********aabc",
      pass: "**********ea4"
    }
  });

export const emailRegistro = async(datos)=>{
    const {email, nombre, token} = datos
    
    const info = await transport.sendMail({
      from: "UpTASK - Administrador de proyectos <cuentas@uptask.com",
      to: email,
      subject: "UpTASK - Confirma tu cuenta",
      text: "Comprueba tu cuenta en UpTASK",
      html: `<p> Hola, ${nombre} </p>
     <p>Comprueba tu cuenta en UpTASK. Tu cuenta ya está casi lista, solo debes hacer clic en el siguiente enlace: </p>
     <a href="${process.env.STRING_CONNECTION_CORS2}/confirmar/${token}">Comprobar cuenta</a>
     <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
      `    
    })
}
~~~

- **Ha funcionado con la variable de entorno que lleva localhost en lugar de 127.0.0.1**
- Me lleva a la página de ConfirmarCuenta del frontend, **tengo el token en la url**
-----

## Confirmando la cuenta

- Importo useEffect para leer la url necesitamos que el código se ejecute una vez
- El useState será para mostrar el componente Alerta
- Importo useParams de react-router-dom para leer la url y Link para redireccionar
- Importo axios y el componente Alerta
- Si voy a app.js puedo ver que el path de confirmarCuenta es localhost:3000/api/usuarios/confirmar/:token
- Puedo usar este :token con useParams para extraer el token
- Si hago un console.log de params me devuelve un objeto con el :id

~~~js
const params = useParams()

console.log(params)
~~~

- Desestructuro el token de params
- Necesito el useEffect para asegurarme de que el código se ejecute cuando el componente esté listo al menos una vez
- Es una petición get al backend. Al ser get no necesito especificarlo en axios ya que es por default

~~~js
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import  axios  from "axios"
import  Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {

  const params = useParams()
  const {token} = params
  
  const [alerta, setAlerta] = useState({})

  useEffect(()=>{
    const confirmarCuenta = async()=>{
      try {
        const url =`http://localhost:3000/api/usuarios/confirmar/${token}`
        const {data}= await axios(url)

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
    confirmarCuenta()
  }, [])

  const {msg} = alerta

  return (
    <>
    <h1 className="text-orange-600 font-black text-6xl capitalize">Confirma tu cuenta y empieza a crear tus
    <span className="text-slate-700"> proyectos</span></h1>
    <div>{msg && <Alerta alerta={alerta} />} </div>

  </>
  )
}

export default ConfirmarCuenta
~~~

- Creo otro state para renderizar el link al Login
- Lo inicio en false porque la cuenta inicia como no confirmada

~~~js
const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
~~~

- Coloco el setCuentaConfirmada(true) dentro del try una vez se ha confirmado la cuenta

~~~js
useEffect(()=>{
    const confirmarCuenta = async()=>{
      try {
        const url =`http://localhost:3000/api/usuarios/confirmar/${token}`
        const {data}= await axios(url)
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
      }
      (...)}})
~~~

- Renderizo el Link condicionalmente

~~~js
  return (
    <>
    <h1 className="text-orange-600 font-black text-6xl capitalize">Confirma tu cuenta y empieza a crear tus
    <span className="text-slate-700"> proyectos</span></h1>
    <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white"
    >{msg && <Alerta alerta={alerta} />}
      {cuentaConfirmada &&    
         <Link to="/"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
        >Inicia sesión</Link>}
     </div>
  </>
  )
~~~

## NOTA: quito el StrictMode en el main para que no haga el doble render y me de error

- main.js

~~~js
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
~~~

- Para quitar el error de Cannot set properties of null (setting 'confirmado') voy al controlador

~~~js
const confirmarCuenta = async (req,res)=>{
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({token})

    
    if(!usuarioConfirmar){
        const error = new Error("Token no valido")
        res.status(400).json({msg: error.message})
    }
    
    if(usuarioConfirmar === null) return
    

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})

    } catch (error) {
        console.log(error)
    }
}
~~~
-----

## Primeros pasos con Reestablecer Password (475)

- Voy a enviar un email para reescribir el password y recuperar la cuenta
- Voy al componente OlvidePassword
- Creo el state de email, le añado el value y el onChange al input, creo la función handleSubmit y se la paso al onSubmit del form
- Importo el componente Alerta, creo un state como objeto vacío, hago la validación en el handleSubmit de si viene el email vacío o es menor a 6 caracteres muestre la alerta
- Se podría colocar una expresión regular para validar el email

~~~js
const OlvidePassword = () => {

  const [email, setEmail]= useState("")
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(email === "" || email.length < 6){
      setAlerta({
        msg: "El email es obligatorio",
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
    <h1 className="text-orange-600 font-black text-6xl capitalize">Recupera tu
    <span className="text-slate-700"> password</span></h1>

    {msg && <Alerta  alerta={alerta} />}

    <form onSubmit={handleSubmit} 
    className= "mt-10 bg-white shadow rounded-lg p-3">
      <div className="my-3">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="email">Email</label>
        <input 
               value={email}
               onChange={e=>setEmail(e.target.value)}
               type="email"
               id="email"
               placeholder="Email de registro"
               className="w-full mt-3 p-3 border rounded-xl bg-gray-50"  />
      </div>
      (...)
  )
~~~

## Enviando email y token para reestablecer password

- Uso un try catch en el handleSubmit
- En el post le paso la url, y los datos tienen que ser un JSON por lo que le paso un objeto con el email
- Con axios el error está en error.response

~~~js
 try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password`, {email})
    } catch (error) {
      console.log(error.response)
    }
~~~

- Si le paso un email que no existe me devuelve en consola "El usuario no existe"
- Esto es porque así lo tengo configurado en el controlador
- usuario.controller

~~~js
const olvidePassword = async (req,res)=>{

    const {email} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no existe")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- Para leer este error y mostrar una alerta uso **error.response.data.msg**
- Si todo va bien me genera un nuevo token
- Hago la alerta para notificarlo

~~~js
try {             //TODO: mover hacia un cliente axios
  const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password`, {email})
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
~~~

- Va a ser en el try catch del controlador donde voy a enviar el email
- Va a ser muy similar a la función de emailRegistro en helpers/emails.js

~~~js
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "********abc",  //TODO:pasar a variables de entorno
      pass: "*********a4"
    }
  });

export const emailOlvidePassword = async(datos)=>{
  const {email, nombre, token} = datos
  
  const info = await transport.sendMail({
    from: "UpTASK - Administrador de proyectos <cuentas@uptask.com",
    to: email,
    subject: "UpTASK - Recupera tu password",
    text: "Comprueba tu cuenta en UpTASK",
    html: `<p> Hola, ${nombre} </p>
   <p>Recupera tu password de UpTASK. Para ello, solo debes hacer clic en el siguiente enlace: </p>
   <a href="${process.env.STRING_CONNECTION_CORS2 }/olvide-password/${token}">Recuperar password</a>
   <p>Si no quieres recuperar tu password, puedes ignorar el mensaje </p>
    `    
  })
}
~~~

- En el usuario.controller le paso los datos a la función

~~~js
const olvidePassword = async (req,res)=>{

    const {email} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no existe")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()

        emailOlvidePassword({
            email: email,
            nombre: usuario.nombre,
            token: usuario.token           
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- Esto me envia un mail a mailtrap con el link que me lleva al componente NuevoPassword
----

## Validando token para resetear password

- Ahora debo leer el token y hacer la consulta a la API
- Voy a NuevoPassword, importo useState, importo Link y useParams de react-router-dom, axios y Alerta 
- En el useEffect apunto a la API de olvide-password para comprobar el token
- Ejecuto la función!

~~~js
const NuevoPassword = () => {

  const params = useParams()
  const {token} = params

  const [alerta, setAlerta] = useState({})

  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
       const {data}= await axios(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password/${token}`)
        console.log(data)
      } catch (error) {
          setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])


  return (...) }
~~~

- Si el token es válido el console.log de la data me devuelve Token válido y el usuario existe
- Estoy apuntando a esta ruta

> router.get('/olvide-password/:token', usuarioController.comprobarToken)

- Que tiene este controlador

~~~js
const comprobarToken = async (req,res)=>{
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token})

    if(!tokenValido){
        const error = new Error("Token no válido")
       return res.status(400).json({msg: error.message})
    }

    return res.json({msg: "Token válido, usuario existe"})
}
~~~

- No me interesa el mensaje de token válido
- Solo si el token es válido mostrará el formulario
- Para ello uso un state y renderizo el form condicionalmente

~~~js
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const params = useParams()
  const {token} = params

  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido] = useState(false)

  useEffect(()=>{
    const comprobarToken= async()=>{
      try {
       await axios(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password/${token}`)
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

  const {msg} = alerta
  return (
    <>
    <h1 className="text-orange-600 font-black text-6xl capitalize">Escribe tu nuevo
    <span className="text-slate-700"> password</span></h1>
    {msg && <Alerta alerta={alerta} />}
    
    {tokenValido && <form className= "mt-10 bg-white shadow rounded-lg p-3">
      
      <div className="my-5">
        <label className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">Nuevo password</label>
        <input type="password"
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
~~~

- Creo un nuevo state para el password
- Coloco el state en el value del input, y en el onChange (e)=>setPassword(e.target.value)
- Creo el handleSubmit, se lo coloco en el onSubmit del form
- Ahora debo apuntar a la API

> router.post('/nuevo-password/:token', usuarioController.nuevoPassword)

- El controlador de nuevoPassword es

~~~js
const nuevoPassword = async(req,res)=>{
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(!usuario){
        const error = new Error("Token no válido")
        res.status(400).json({msg: error.message})
    }

    try {
        usuario.password = password
        usuario.token = ""
        await usuario.save()
        res.json({msg: "Password modificado correctamente"})
        
    } catch (error) {
        console.log(error)
    }
}
~~~

- Tengo seteado el input con el state password y el setPassword en el onChange, y en el form tengo el handleSubmit en el onSubmit
- En el handleSubmit hago la validación del password, y en un try catch apunto a la API para almacenar el password

~~~js
 const handleSubmit=async (e)=>{
    e.preventDefault()
    
    if(password.length < 6){
      setAlerta({
        msg: "el password debe contener al menos 6 caracteres",
        error: true
      })
    }

    try {
      const {data}= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/nuevo-password/${token}`, {password})
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
~~~

- Muevo a variables de entorno la configuración de nodemailer y los endpoints en el fromt que no estén con variables de entorno
- En el frontend debo usar import.meta.env.VITE_nombre_variable y en el backend process.env.nombre_variable
- Todas mis peticiones apuntan a http://localhost:3000/api/usuarios
- Puedo crear una variable de axios
- Creo la carpeta config en el frontend, en src
- Creo el archivo clienteAxios.jsx

~~~js
import axios from 'axios'

const clienteAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

export default clienteAxios
~~~

- Ahora solo tengo que usarlo. En los get debo añadir .get

~~~js
const {data}  = await clienteAxios.post('/usuarios', {nombre, password, email})
~~~

## NOTA: He tenido problemas para configurar en variables de entorno nodemailer. Lo dejo en crudo
-----

## Validando la autenticación

- En el Login importo useState, Alerta y clienteAxios. También useNavigate de react-router-dom
- Coloco los value y los onChange en los inputs con los state y setState
- Creo el handleSubmit y lo coloco en el onSubmit del form
- Hago la petición post en un try catch.
- Por ahora hago un console.log de la data

~~~js
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
      localStorage.setItem('token', data.token)  //almaceno el token en el localStorage
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
~~~

- Si vamos al controlador de login veremos que generamos un nuevo JWT

~~~js
const login = async (req,res)=>{
    const {email, password} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("Usuario no encontrado")
       return res.status(400).json({msg: error.message})
    }

    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message})
    }

    if(await usuario.comprobarPassword(password)){
        return res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
    }    
}
~~~

- Necesito el token para validar el usuario en diferentes sitios 
- Quiero almacenar este token en el localStorage (en Chrome está en Application - LocalStorage)
- Voy a colocar todo el objeto que obtengo de la petició a /usuarios/login en el context
