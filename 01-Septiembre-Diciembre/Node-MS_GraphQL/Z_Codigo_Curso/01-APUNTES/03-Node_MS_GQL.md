# NODE MICROSERVICIOS GRAPHQL - Auth

- Creo el módulo de auth
- Copio el package.json de users y uso npm i 
- Copio también el .env (cambio el PORT a 3005) y el tsconfig
- Creo un server normalito
- Vamos a manejar la autenticación con middlewares
- auth/src/index.ts

~~~js
import path from "node:path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AuthRoutes } from "./routes";

import { connectionDB } from "./config/db.config";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//connectionDB();

app.use("/auth", AuthRoutes);

app.listen(port, () => {
  console.log("Auth Microservice is running on port:", port);
});
~~~

- En AuthRoutes

~~~js
import { Router } from "express";

import {
  validateEmailMiddleware,
  validateEmailRegistryMiddleware,
} from "../middlewares/validateEmail.middleware";

import {
  hashPasswordMiddleware,
  validatePasswordMiddleware,
} from "../middlewares/hashPassword.middleware";

import {
  verifyGoogleIdTokenMiddleware,
  verifyJWTMiddleware,
} from "../middlewares/verifyJWT.middleware";

import {
  googleSSO,
  login,
  register,
  renewToken,
} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  [validateEmailMiddleware, hashPasswordMiddleware],
  register
);

router.post(
  "/login",
  [validateEmailRegistryMiddleware, validatePasswordMiddleware],
  login
);

router.post("/google", [verifyGoogleIdTokenMiddleware], googleSSO);

router.post("/renew-jwt", [verifyJWTMiddleware], renewToken);

export default router;
~~~

- Haremos la autenticación con google en el siguiente módulo de lecciones
-----

## Docker y MongoDB

- Creo el docker-compose.yml a nivel de raíz (no en src)

~~~yml
version: "3.9"
services:
  mongo:
    image: mongo:latest
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
      MONGO_INITDB_DATABASE: auth
    ports:
      - 27017:27017
    volumes:
      - ./database:/data/db  # persistencia para guardar credenciales

  mongo-express:  # servicio para gestionar visualmente mongo en el navegador
    image: mongo-express:latest
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: root
      ME_CONFIG_MONGODB_URL: mongodb://root:root@mongo:27017/ 
~~~

- Creo la database auth desde el navegador desde **http://localhost:8081/db**
--------

## Conectando microservicio con MongoDB

- Usaremos mongoose, npm i mongoose
- Creo la carpeta config/db.config.ts para la configuración de la DB

~~~js
import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);

    console.log("DB Connected");
  } catch (error) {
    console.log("Connection error");
  }
};
~~~

- En .env tengo la url de la DB 
- Aádo authSource=admin para añadir autenticación a la conexión

> DB_CONNECTION="mongodb://root:root@localhost:27017/auth?authSource=admin"

- Llamo a la función connectionDB en el server index.ts
----

## User Model

- Creo la carpeta auth/src/models/user.model.ts
- Lo que vamos a exponer es el modelo User
- El trim en true lo que hace es limpiar cadenas de texto vacias
- Sin el required no es obligatorio

~~~js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("User", userSchema); 
~~~
------

## Registrando usuario

- Creo auth/src/controllers/auth.controller.ts
- Extraigo la data del body
- Creo el usuario, lo salvo
- Le paso el id al token
- Creo la respuesta con el ok en true y usando la data del usuario

~~~js
import { Request, Response } from "express";

import User from "../models/user.model";
import { jwtSign } from "../helpers/jwt.helper";

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    const user = new User({ username, password, email });

    await user.save();

  //jwtSign.helper.ts
    const token = jwtSign({
      id: user.id,
    });

    return res.status(200).json({
      ok: true,
      message: "User registration successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};
~~~
-----

## Hasheando el password

- Lo haremos con un middleware
- Creo auth/src/middlewares/hashPassword.middleware.ts
- Le paso next como parámetro para que el middleware, una vez haga el trabajo, continue

~~~js
import { NextFunction, Request, Response } from "express";

import { comparePassword, hashPassword } from "../helpers/hashPassword.helper";
import User from "../models/user.model";

export const hashPasswordMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  if (!password) {
    return res.status(403).json({
      ok: false,
      message: "password is required",
    });
  }

  const hash = hashPassword(password); //hasheo del password

  req.body.password = hash; //se lo paso a la propiedad password del body

  next();
};
~~~

- En src/helpers/hashPassword.helper.ts

~~~js
import bcrypt from "bcryptjs";

export const hashPassword = (plainText: string) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(plainText, salt);

  return hash;
};
~~~

- El helper jwtSign es asi

~~~js
import jwt from "jsonwebtoken";

//guardo esta interfaz en src/interfaces
export interface IUserPayload {
  id: string;
}

export const jwtSign = (payload: IUserPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};
~~~

- En .env especifico la variable de entornp

> JWT_SECRET="mys3crE7K3yW0rD"

- Hago uso de los middlewares en AuthRoutes
- auth/src/routes/authRoutes.routes.ts

~~~js
import { Router } from "express";

import {
  hashPasswordMiddleware,
  validatePasswordMiddleware,
} from "../middlewares/hashPassword.middleware";



import {
  register,
} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  [validateEmailMiddleware, hashPasswordMiddleware],
  register
);

export default router;
~~~
-------

## validar JWT

- Creamos un nuevo middleware para validar el token
- Si hago un console.log del token que paso desde POSTMAN Auth, Bearer Token hay un espacio en blanco entre Bearer y el token

~~~js
import { NextFunction, Request, Response } from "express";

import { jwtVerify} from "../helpers/jwt.helper";

export const verifyJWTMiddleware = (
  req: any | Request, //coloco any para salvar el error
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization; //extraigo la authorization de los headers

  if (!authorization) {
    return res.status(403).json({
      ok: false,
      message: "Token is required",
    });
  }

  try {
    const token = authorization.split(" ")[1];//separo por espacios, me quedo con la segunda posición

    const { id }: any = jwtVerify(token); //creo este helper para verificar el token

    req.uid = id; //le paso el uid a la request

    next(); //llamo a next
  } catch (error) {
    return res.status(500).json({ ok: false, error });
  }
};
~~~

- El helper en auth/src/helpers/jwt.helper.ts

~~~js
import jwt from "jsonwebtoken";


export const jwtVerify = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return payload;
  } catch (error) {
    throw error;
  }
};
~~~

- Una vez validado el token voy a querer renovar el token
- Quiero que cada petición que se me haga traiga un nuevo token, antes verifico el usuario
- Hago que pase por el middleware de verificarJWT y le paso el controller al endpoint

~~~js
export const renewToken = (req: Request | any, res: Response) => {
  const { uid } = req; //se lo añadí a la req en verifyJWTMiddleware
 //genero el nuevo token
    id: uid,
  });

  return res.status(200).json({ ok: true, jwt: token });
};
~~~

- En el auth.controller

~~~js
router.post("/renew-jwt", [verifyJWTMiddleware], renewToken);
~~~

- el login no va a necesitar verificar el token, pero si deberemos obtener un token, retornarlo y en función de ese token hacer otras peticiones
------

## Login

- El login hace uso de **dos middlewares**
- Primero valido que el usuario exista con validateEmailregistryMiddleware
- auth/src/validateEmail.middleware.ts

~~~js
export const validateEmailRegistryMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.active) {
    return res.status(403).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  req.uid = user.id;

  next();
};
~~~

- En validatePassword extraigo el uid de la Request y el password del body
- Valido si no viene el password y si no encuentra el user o esta inactivo
- Verifico el password
- Valido si el password es correcto
- auth/src/middlewares/hashPassword.middleware.ts

~~~js
export const validatePasswordMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const uid = req.uid;

  if (!password) {
    return res.status(403).json({
      ok: false,
      message: "password is required",
    });
  }

  const user = await User.findById(uid);

  if (!user || !user.active) {
    return res.status(404).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  if (user.google) {
    return res.status(403).json({
      ok: false,
      message: "User must log in with google",
    });
  }

  const hash = user.password;
                                //helper
  const result = comparePassword(password, hash);

  if (!result) {
    return res.status(403).json({
      ok: false,
      message: "Email or password invalid",
    });
  }

  next();
};

//el helper comparePassword de /helpers/hashPassword.helper.ts
export const comparePassword = (plaintText: string, hash: string) => {
  return bcrypt.compareSync(plaintText, hash);
};
~~~

- En AuthRoutes coloco los middlewares

~~~js
router.post(
  "/login",
  [validateEmailRegistryMiddleware, validatePasswordMiddleware],
  login
);
~~~

- En el login extraigo el uid
- Genero un nuevo token, lo devuelvo en la response
- Ya he verificado email y el password con los middlewares
- auth/src/controllers/auth.controller

~~~js
export const login = async (req: Request | any, res: Response) => {
  const uid = req.uid;

  try {
    const user = await User.findById(uid);

    const token = jwtSign({
      id: uid,
    });

    return res.status(200).json({
      ok: true,
      message: "User Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};
~~~
------

## Google Sign in

- En AuthRoutes

~~~js
router.post("/google", [verifyGoogleIdTokenMiddleware], googleSSO);
~~~

- El middleware

~~~js
export const verifyGoogleIdTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body; //extraigo el token del body (ver el html)

  if (!token) {
    return res
      .status(403)
      .json({ ok: false, message: "User not authenticated" });
  }

  const googleUser = await googleVerify(token);//uso el helper

  if (!googleUser) {
    return res
      .status(403)
      .json({ ok: false, message: "User not authenticated" });
  }

  req.body.email = googleUser.email; //le paso el email y username en el body para usar en el controller
  req.body.username = googleUser.username;

  next();
};
~~~

- El helper

~~~js
import { OAuth2Client } from "google-auth-library";

import { IUserPayload } from "../interfaces/IUserPayload.interface";

export const googleVerify = async (token: string) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return { email: payload.email, username: payload.name };
};
~~~

- El controller

~~~js
export const googleSSO = async (req: Request, res: Response) => {
  const { email, username } = req.body; //extraigo el email y username que pasé desde el middleware

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username, password: ":v", email, google: true });
      await user.save();
    }

    const token = jwtSign({
      id: user.id,
    });

    return res.status(200).json({
      ok: true,
      message: "User signin google",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      jwt: token,
    });
  } catch (error) {
    console.log(`Error find: ${error}`);

    return res.status(500).json({
      error,
      ok: false,
    });
  }
};
~~~ 

- Proveedor de botón google sign in: https://developers.google.com/identity/gs/web/guides/overview/
- Abrir página credenciales de la consola API de google
- No hay que pagar
- En el botón top left selecciono el proyecto o genero uno nuevo con el botón PROYECTO NUEVO
- Seguir el proceso en https://developers.google.com/identity/gs/web/guides/get-google-api-clientid
- clicar Crear credenciales / clicar ID de cliente OAuth, seleccioinar aplicación Web en tipo de aplicación
  - Está en la página de consola API Google, con el poyecto de Node seleccionado
  - Confirmo la pantalla de consentimiento. Selecciono usuario interno (intranet), para que cualquiera se pueda conectar **elijo externo**
  - Relleno la información (nombre del proyecto, mi correo, si quiero un lgotip, dominios autorizados, etc)
- Una vez hecho este proceso (ahora si) le doy a CREAR CREDENCIALES en la pantalla de consola API de Google con el proyecto seleccionado
- Me da las variables ID client y Secret client. Descargo el JSON (trae todas mis credenciales)
- Coloco en .env GOOGLE_CLIENT_ID y GOOGLE_SECRET_KEY
- El botón de login y logout en html

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google SignIn</title>

    <script src="https://accounts.google.com/gsi/client" async defer></script>
  </head>
  <body>
    <h1>Google SSO</h1>

    <div
      id="g_id_onload"
      data-client_id="303570499103-sjs3kb3k0313ldgc0ih7khhdi87iq9k7.apps.googleusercontent.com"
      data-auto_prompt="false"
      data-callback="handleCredentialResponse"
    ></div>
    <div
      class="g_id_signin"
      data-type="standard"
      data-size="large"
      data-theme="outline"
      data-text="sign_in_with"
      data-shape="rectangular"
      data-logo_alignment="left"
    ></div>

    <button onclick="logout()">Log out</button>

    <script>

      async function handleCredentialResponse(response) {
        const token = response.credential; <!--//extraigo el token-->

        const res = await fetch("/auth/google", { <!--//apunto a mi endpoint-->
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }), <!--//paso el token al body como un string-->
        });

        const data = await res.json(); <!--//extraigo la data de la response-->

        localStorage.setItem("email", data.user.email); <!--// paso el email al localstorage-->
      }

      async function logout() { <!--//creo el logout-->
        const account = google.accounts.id;

        account.disableAutoSelect();

        const email = localStorage.getItem("email");

        account.revoke(email, (res) => {
          if (res.successful) {
            localStorage.clear();
            location.reload();
          }
        });
      }
    </script>
  </body>
</html>
~~~