# 02 Micro Frontend REACT - ESTILOS

- Vamos a estructurar un sistema de carpetas integrando bootstrap que estará en un lugar estratégico
- El resultado final va estar solo en el host y vamos a ver cómo funciona esto

## Reestructura de carpetas de un MF

- Guardo el host y el navbar dentro de una misma carpeta llamada 01-Proyecto
- Creo una segunda carpeta llamada 02-Proyecto
- Creo el primer mf con **npx create-mf-app**, lo llamo host en el puerto 3000 con javascript y CSS
- Hago el cd al host y un npm i
----

## Prefijos de un mf (mf = Module Federation)

- Pongamos que hago un microfrontend de un store con redux
- Ese microfrontend solo se va a encargar de administar el estado
- No va a tener nada que ver con interfaz gráfica
- Creo un mf y lo llamo colorpicker (mf-colorPicker), selecciono Application, react, JavaScript, CSS
- Uso npm i para reconstruir los módulos (o yarn)
- Ahora tengo el microfrontend del host y el del colorpicker
- Creo en colorpicker/src/components/ColorPicker.jsx
- También creo el hook useColors.js
- Para exponerlo voy a webpack.config.js en el apartado plugins

~~~js
plugins: [
new ModuleFederationPlugin({
    name: "mf_colorpicker",
    filename: "remoteEntry.js",
    remotes: {},
    exposes: {
    "./ColorPicker": "./src/components/ColorPicker.jsx",
    "./useColors": "./src/hooks/useColors.js",
    }
    })
]
~~~

- En App.jsx de mf_colorpicker renderizo ColorPicker
- Desestructuro del useColors

~~~js
import React from "react";
import ReactDOM from "react-dom";
import ColorPicker from "./components/ColorPicker";
import { useColors } from "./hooks/useColors";

import "./index.css";

const App = () => {
  const { color, handleChangeColor, handleSubmitSaveColor } = useColors();

  return (
    <div className="container">
      <ColorPicker
        color={color}
        handleChangeColor={handleChangeColor}
        handleSubmitSaveColor={handleSubmitSaveColor}
      />
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
~~~

- useColors
- Guardo en un state color el color del e.target.value con **handleChangeColor**
- En el useState coloco el helper **getLastColor**, que llama al getColorsList para extraer el array de colores del localStorage y retornar el primero 
- En el useState de colorsList coloco el **getColorsList()** que se encarga de recoger el arreglo de colores del localstorage y si no lo hay es un arreglo vacío. Uso JSON.parse
- Con el **handleSubmitSaveColor** añado el color del state proveniente del e.target.value a la colorsList esparciéndola en el arreglo y añadiendo color. Lo guardo en una variable
- Con setColorsList añado esta variable con el nuevo array al state de colorsList
- **HandleClickClearColors** seteo un color predetrminado, pongo el array de colorsList a 0 y los remuevo del localStorage
- En un useeffect que depende de los cambios de colorsList cargo la lista en el localStorage.
- Necesario usar stringify, el localStorage solo acepta strings

~~~js
import { useEffect, useState } from "react";
import { getColorList, getLastColor } from "../helpers/getColors";

export const useColors = () => {
  const [color, setColor] = useState(getLastColor());
  const [colorsList, setColorsList] = useState(getColorList());

  const handleChangeColor = (e) => {
    setColor(e.target.value);
  };

  const handleSubmitSaveColor = (e) => {
    e.preventDefault();

    const copyColors = [color, ...colorsList];

    setColorsList(copyColors);
  };

  const handleClickClearColors = () => {
    setColor("#f2f2f2");
    setColorsList([]);
    localStorage.removeItem("colors");
  };

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colorsList));
  }, [colorsList]);

  return {
    color,
    colorsList,
    handleChangeColor,
    handleSubmitSaveColor,
    handleClickClearColors,
  };
};
~~~

- en src/helpers/getColors

~~~js
export const getColorList = () =>
  JSON.parse(localStorage.getItem("colors")) || [];

export const getLastColor = () => {
  const listColor = getColorList();

  return listColor[0] || "#732812";
};
~~~

- En el host, para poder renderizar el colorPicker debo importarlo en el webpack.config

~~~js
 plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        colorPicker:
          "mf_colorpicker@https://mf-colorpicker.netlify.app/remoteEntry.js", //aqui en desarrollo sería localhost
        colorList:
          "mf_colorlist@https://mf-colorlist.netlify.app/remoteEntry.js",
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
    })
 ]
~~~

- En el host lo renderizo de esta manera en el App.jsx

~~~js
import React from "react";
import ReactDOM from "react-dom";

import ColorPicker from "colorPicker/ColorPicker";
import ColorList from "colorList/ColorList";

import { useColors } from "colorPicker/useColors";

const App = () => {
  const {
    color,
    colorsList,
    handleChangeColor,
    handleSubmitSaveColor,
    handleClickClearColors,
  } = useColors();

  return (
    <>
      <h1 className="text-center bg-dark text-white p-2">Color Picker</h1>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-md-4">
            <ColorList
              colorsList={colorsList}
              handleClickClearColors={handleClickClearColors}
            />
          </div>
          <div className="col-12 col-md-8">
            <ColorPicker
              color={color}
              handleChangeColor={handleChangeColor}
              handleSubmitSaveColor={handleSubmitSaveColor}
            />
          </div>
        </div>
      </div>
    </>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
~~~

- No hemos visto el otro microfrontend, mf-colorlist
- Hago lo mismo. Creo el componente y lo expongo en **plugins del webpack.config**

~~~js
plugins: [
    new ModuleFederationPlugin({
    name: "mf_colorlist",
    filename: "remoteEntry.js",
    remotes: {},
    exposes: {
        "./ColorList": "./src/components/ColorList.jsx",
    }
    ...
~~~

- En components/ColorList.jsx
- Le paso el colorsList que seteo como un arreglo vacío por defecto, y el handleClickClearColors que es para restear el colorsList

~~~js
import React from "react";
import Swal from "sweetalert2";

const ColorList = ({ colorsList = [], handleClickClearColors }) => {
  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color); //retorna un apromesa que es resuelta cuando el clipboard se haya actualizado

    //lanzo la alerta
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Color: ${color} Copied!`,
      showConfirmButton: false,
      timer: 1300,
      timerProgressBar: true,
    });
  };

  return (
    <>
      {colorsList.length > 0 && ( //Si hay algún elemento en el colorsList renderizo el botón de ClearList y le paso en el onClick la función de reseteo
        <button
          className="btn btn-danger my-4 w-100"
          onClick={handleClickClearColors}
        >
          Clear List
        </button>
      )}

      <div className="list-group text-center">
        {colorsList.length > 0 ? ( //si colorsList es mayor que 0 lo recorro con .map
          colorsList.map((color, index) => (
            <button
              key={index} //en la key coloco el index
              type="button"
              className="list-group-item list-group-item-action text-white"
              aria-current="true"
              title="Copiar"
              style={{
                background: color,
                fontWeight: "bolder",
              }}
              onClick={() => handleCopyColor(color)} //en el onClick le paso el método para copiar en el clipboard. Renderizo el color del estado
            >
              {color} 
            </button>
          ))
        ) : (//si no hay colores en la lista muestro que no hay colores que mostrar. Uso b de bold
          <div className="alert alert-danger" role="alert">
            <b>Sin elementos por mostrar...</b>  
          </div>
        )}
      </div>
    </>
  );
};

export default ColorList;
~~~

- Es en el index.html del host dónde tengo bootstrap

~~~html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Color Picker MF App</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div id="app"></div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa"
      crossorigin="anonymous"
    ></script>
  </body>
</html>
~~~

