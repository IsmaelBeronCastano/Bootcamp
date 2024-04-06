# SETEAR VARIABLES DE ENTORNO REACT-NATIVE

- Para agregar variables de entorno

> npm i react-native-config

- Añadir esto a android/app/build.gradle

~~~js
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"

android {
    defaultConfig {
        manifestPlaceholders = [API_KEY: "$System.env.API_KEY"] //"$process.env.API_KEY"
    } }
~~~

- Crear la variable en el archivo  API_KEY en .env y colocarla así en AndroidManifest

~~~html
 <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value= "${API_KEY}"/>
~~~

