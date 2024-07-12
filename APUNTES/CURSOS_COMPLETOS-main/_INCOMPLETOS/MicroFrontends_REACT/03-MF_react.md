# Single Page Applications y Microfrontends

- Creando MF con Tailwind

> yarn create mf-app

- Creo el host /Application/PORT=8080/React/JS o TypeScript/Tailwind
- Creo otro microfrontend como navbar para la barra de navegación y las rutas
- mf-navbar/Applicattion/PORT=8081/React/JS o TypeScript/Tailwind
- Entro en el directorio e instalo los módulos de node
- Con yarn start inicio el microfrontend
- En App.js

~~~js
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "mf_navbar/Navbar";

import NotFound from "./pages/NotFound";

import "./index.scss";

import Loader from "./components/Loader";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PersonajesPage = lazy(() => import("./pages/PersonajesPage"));
const DetallePersonajePage = lazy(() => import("./pages/DetallePersonajePage"));

const App = () => (
  <BrowserRouter>
    <Navbar />

    <div className="mx-20 mt-10">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <HomePage />
            </Suspense>
          }
        />

        <Route
          path="/personajes"
          element={
            <Suspense fallback={<Loader />}>
              <PersonajesPage />
            </Suspense>
          }
        />

        <Route
          path="/personajes/:name"
          element={
            <Suspense fallback={<Loader />}>
              <DetallePersonajePage />
            </Suspense>
          }
        />

        <Route
          path="/about"
          element={
            <Suspense fallback={<Loader />}>
              <AboutPage />
            </Suspense>
          }
        />

        {/* Manejo de Rutas no agregadas */}
        <Route path="*" element={<NotFound />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </div>
  </BrowserRouter>
);
ReactDOM.render(<App />, document.getElementById("app"));
~~~

- En src/components
- Error.jsx

~~~js
import React from "react";

export class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      return <h2>Ocurrio un error en el Micro-Frontend, favor de validarlo</h2>;
    }

    return this.props.children;
  }
}
~~~

- Loader.jsx

~~~js
import React from "react";

import "./Loader.css";

const Loader = () => {
  return (
    <div className="text-center p-3">
      <div className="lds-spinner bg-gray-100 shadow-xl rounded-md">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
~~~

- Loader.css

~~~css
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #333;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
~~~

- src/pages/
- DetallePersonajePage

~~~js
import React from "react";

import DetallePersonaje from "mf_detalle_personaje/DetallePersonaje";

const DetallePersonajePage = () => {
  return <DetallePersonaje />;
};

export default DetallePersonajePage;
~~~

- HomePage

~~~js
import React from "react";

import { Error } from "../components/Error";
import Counter from "mf_counter/Counter";

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="font-bold text-lg">Counter MF</h1>
      <Error>
        <Counter initialCounter={10} />
      </Error>
    </div>
  );
};

export default HomePage;
~~~

- NotFound

~~~js
import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="my-16  text-5xl text-red-500">404 Page Not Found</h1>
      <NavLink to="/" className="bg-blue-400 p-3 text-white rounded-md">
        Go to home
      </NavLink>
    </div>
  );
};

export default NotFound;
~~~

- PersonajesPage

~~~js
import React, { useEffect, useRef } from "react";

import { Error } from "../components/Error";

import placeCards from "mf_cards/placeCards";

const PersonajesPage = () => {
  const cardsRef = useRef(null);

  useEffect(() => {
    placeCards(cardsRef.current);
  }, []);

  return (
    <>
      <Error>
        <div ref={cardsRef}></div>
      </Error>
    </>
  );
};

export default PersonajesPage;
~~~

- Dockerfile

~~~Dockerfile
FROM node:16.17.0-alpine

RUN mkdir app

WORKDIR /app

COPY ./package.json .

RUN yarn install

COPY ./ .

RUN yarn build

RUN npm i -g http-server

EXPOSE 8080
CMD [ "http-server", "dist", "-p", "8080" ]
~~~

- webpack.config.js

~~~js
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        mf_navbar: "mf_navbar@http://localhost:8081/remoteEntry.js",
        mf_counter: "mf_counter@http://localhost:8082/remoteEntry.js",
        mf_cards: "mf_cards@http://localhost:8083/remoteEntry.js",
        mf_detalle_personaje:
          "mf_detalle_personaje@http://localhost:8084/remoteEntry.js",
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
};
~~~

- 

