# 01 Micro Frontend REACT 

## Reglas Micro-frontends

- La tecnología debe ser agnóstica
- Cada equipo debe tener su código aislado
- Priorizar funciones nativas del navegador antes de funciones personalizadas
- Los micro-frontends deben ser resilientes, si a lguno falla el resto debe seguir funcionando con normalidad
-----

## Ventajas y desventajas

- *Ventajas*
- Repositorios altamente cohesivos, fáciles de mantener y con la menor cantidad de código necesario para ejecutar una acción
- Equipos desacoplados y escalables
- Cambios en partes específicas de la interfaz gráfica más rápida
- *Desventajas*
- Grandes retos para eliminar dependencias o comunicar los microfrontends
- Duplicidad de dependencias
- Mayor cantidad de archivos que el cliente requiere descargar
- Añade complejidad al ciclo de integración y despliegue continuo
- Requiere especialistas en Micro-Frontend obligatoriamente
----

## Paquetes de Micro-Frontend

- Ambas opciones usan webpack
  - **Module federation**: implementado a partir de webpack 5
  - **single-spa**: trabaja con Angular. Es más complicado empezar con este paquete
---

## Comunicar 2 Micro-frontends


- Para crear un micro-frontend con React y npm (con mf, que es Module Federation)

> npx create-mf-app

- Creo una Application (aplicación web) llamada host en el puerto 3000 con react y CSS
- Permite typescript y Tailwind (!)
- También se pueden crear API REST (backend)
. Uso npm i (para instalar las dependencias)
- Creo otra Application con el mismo comando (fuera de la carpeta host, en un nivel superior) en el puerto 3001 llamada navbar
- Borro el index.css de App.jsx en el proyecto de navbar para que no haya conflictos con el css ya que en el host no se aplicaría
- Creo la carpeta components dentro de la aplicación navbar/src/ con un componente Navbar.jsx y lo coloco en el App.jsx dentro de un Fragment
- Creo un archivo CSS llamado Navbar.css y lo importo

~~~js
import React from 'react'
import "./Navbar.css"

const Navbar = () => {
  return  <nav>
    <h1>NavBar</h1>
  </nav>
    
}

export default Navbar
~~~

- En el host es dónde se va a montar **TODO**
  - Voy a tener el micro-frontend del carrito de compras, el del navbar, etc. Todos se van a conectar en el host
  - Cada micro-frontend es una aplicación independiente
- Es recomendable usar **Normalize.css** en cada micro-Frontend para resetear los estilos que vienen por defecto en los navegadores
- Puedo ir a la web de Normalize, copiar la url del archivo a descargar y añadirlo como cdn en el head de mi index.html

~~~html
<link rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css">
~~~

- Sigo con mi archivo CSS, le agrego unos estilos y una fuente de Google Fonts
  - Selecciono la familia y el grosor, copio lo que hay en la etiqueta style de @import (en el view selected families)
  - Pego en el archivo CSS el @import
  - Uso la linea de código que me ofrece google para llamar a la fuente

~~~css
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

nav{
    background-color: blueviolet;
    color:antiquewhite;
    padding: 0.5rem;
    font-family: 'Roboto', sans-serif; 
    display: flex;
    justify-content: center;    
}
~~~

- Para poder mostrar el Navbar en el host debo exponerlo en el **archivo de configuración de webpack**
- Es importante el archivo **remoteEntry.js**
- Si voy a localhost:3001/remoteEntry.js (dónde está el navbar) me dice que no puede hacer el GET porque no estoy exponiendo nada
- En el archivo **webpack.config**, al final, tengo remotes y exposes que son para llamar y para exponer los mf
- Son objetos literales de js
- En exposes llamo **en un string** usando ./ con el nombre del componente y le agrego la ruta donde se encuentra
- webpack.config.js

~~~js
  plugins: [
    new ModuleFederationPlugin({
      name: "navbar", //expongo el navbar en su archivo webpack
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Navbar": "./src/components/Navbar.jsx"
      },{...}
     ]
~~~

- Ahora si voy a localhost:3001/remoteEntry.js si aparece el código de remoteEntry.js
- Ahora **debo importarlo desde remotes del archivo webpack.config del host**
- Le doy el nombre (en este caso navbar) y uso la nomenclatura para llamarlo con el nombre del componente@url

~~~js
plugins: [
new ModuleFederationPlugin({
    name: "host",
    filename: "remoteEntry.js",
    remotes: {
    navbar: "navbar@http://localhost:3001/remoteEntry.js" //uso el name@la_dirección_del_componente
    },
    exposes: {},{...}
    ]
   <>
~~~

- Ahora debo importarlo con el nombre del paquete (el micro-Frontend, lo que pone en el name del ModuleFederationPlugin en webpack.config) / el nombre del componente con el que lo expuse en exposes de wepack.config ("./Navbar")

~~~js
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "navbar/Navbar" //uso el name/Componente para importarlo


const App = () => (
  <div className="container">
    <Navbar />
      <h1>MicroFrontend React</h1>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
~~~

- Debo agregar Normalize al index.html del host también

## NOTA: cuando toco el archivo de webpack tengo que bajar y subir la aplicación de React

- Si tuviera varios componentes, debo exponer cada componente en su archivo webpack y agregarlo en el host de esta forma
- En exposes nombro cada componente a importar

~~~js
 plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        navbar:
          "navbar@https://brilliant-tarsier-f680b6.netlify.app/remoteEntry.js",
        counterReact:
          "counter_mf@https://elaborate-crumble-973d08.netlify.app/remoteEntry.js",
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
        new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
~~~js

~~~

## Resumen:

- El nombre que pongo delante en el string del **remotes** para conectar con el mf es el nombre del paquete. El **name** en **ModuleFederationPlugin** del microfrontend que quiero importar.
- Cuando hago la importación en el **host** para renderizar el componente del otro mf, la primera palabra después del from es el nombre que le he dado al módulo en el objeto **remotes** del host.
- La segunda palabra (el componente) es como lo he nombrado en el objeto **exposes con el ./**
- Cuando escribo css de los componentes conviene poner en el className del app.jsx de cada componente el nombredelcomponente-container para que no haya colisiones
- Para la intellisense de los styled components instalar la extension vscode-styled-components
- Para los styled components se usará emotion
- Instalar

> npm i @emotion/react @emotion/styled

- La sintaxis de un styled component queda así

~~~js
import styled from '@emotion/styled'

const Button = styled.button`
  color: tomato;
  cursor:pointer;
  font-size: 1.3rem;


`

render(<Button>This is a tomato button.</Button>)
~~~

- Button puede ir dentro de cualquier componentes, tener props, etc
-------

## Dinamic Styled Components

~~~js
import React, { useState } from "react";
import styled from "@emotion/styled";

import Button from "./Button";

import "./Counter.css";

const Success = styled.span`
  color: lime;
`;

const Error = styled.span`
  color: tomato;
`;

const Counter = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="Counter-container">
      <h2>
        Counter:{" "}
        {counter < 0 ? <Error>{counter}</Error> : <Success>{counter}</Success>}
      </h2>

      <Button onClick={() => setCounter(counter + 1)} text="+1" />
      <Button onClick={() => setCounter(counter - 1)} text="-1" />
    </div>
  );
};

export default Counter;
~~~

- Los styled components colisionan menos (a nivel de estilos) en mis microfrontends al generar sus propios microhashes
----

## Diseños con Bootsrap y micro-frontends






