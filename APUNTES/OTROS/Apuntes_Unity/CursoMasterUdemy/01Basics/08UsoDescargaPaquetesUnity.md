## USO Y DESCARGA DE PACKAGES

- Los packages son conjuntos de herramientas o recursos que puedo descargar y usar en Unity
- Puedo descargarlos desde la tienda de Unity, hay packages desarrollados por empresas externas y por el mismo Unity
- Puedo crear mis propios paquetes y exportarlos
    - Puedo empaquetar los materiales del proyecto y exportarlo para algún colaborador, por ejemplo
- Todos los packages tienen una escena de ejemplo ( es un requisito para estar en la tienda, igual que mantener la estructura de carpetas )
- Paquetes muy usados  y gratos (y gratis!) son PBS Materials Variety Pack, PolygonStarter
- ProBuilder se integró en Unity, muy útil para prototipar. Son herramientas
----

## Ventana Package Manager

- Window/PackageManager
- top-left, simbolo de + para agregar un paquete desde el disco, agregar paquetes desde GitHUb
- Packages; Unity Registry (de Unity), inProject (los paquetes que tengo en el proyecto), MyAssets(los assets que he descargado en el ciclo de vida de UnityID). Cuando elijo My Assets aparecen más opciones como Filter y Clear Filter
    - Son paquetes que puedo tener anteriormente y desde aquí incorporarlos al proyecto
- Sort By: Fecha de compra, por Nombre, etc.
- A la derecha aparece toda la info del paquete seleccionado
- A la derecha del nombre del paquete aperece un icono
    - Si aparece una carpeta significa que puedo incorporarlo en el proyecto porque ya lo tengo
    - Si aparece la flecha hacia abajo es que debo descargarlo
    - El circulo con la flecha hacia arriba es que hay un update
    - Un check en verde es que ya están incorporados al proyecto
- El botón de importar está en bottom-right
- Top-right tengo el buscador y el engranaje de advanced, me lleva al Project Settings/Package Manager
    - Scoped Registries es un modo avanzado para trabajar con los distribuidores de paquetes
    - Advanced Settings:
        - Enable Preview Packages: versiones no finales que ya se pueden descargar y probar
        - Si vuelvo al package manager y selecciono Packages: Unity registry aparecen tambien paquetes Preview 
        - El paquete Device SImulator sirve para emular dispositivos, tiene años ya
---

## Instalando Paquetes desde el Asset Store

- Asset Store es la tienda oficial de Unity
- Window/AssetStore
    - En la página web estan organizados por Assets, Tools, Services, etc
    - Puedo realizar búsquedas y fiultrar por precios/gratis
    - By Unity/Unity Essentials: paquetes de Unity
    - Lo que sea que quiera agregar uso el botón Add To My Assets y lo añade a UNity
        - Ahora aprece en My Assets del Package Manager con la flechita abajo porque me lo tengo que descargar
        - Lo descargo y cambia el botón de Download a Import
        - Con Import aparece la ventana con toda la estructura del paquete, con opciones para filtrar alguna carpeta que no me interese
            - En bottom-left esta All (marcar todo) None (desmarcar todo)
        - Ahora tengo la carpeta del paquete(un modelo, una pistola, lo que sea) en Assets del proyecto
        - Puedo ir a la carpeta de scenes y cargar la escena donde me muestra todo lo que hay en el paquete en la ventana de escena
        - Si no ineteresa, se selecciona desde Proyecto y Delete (Supr)
            - Si son herramientas hay que ir con cuidado de hacerlo de esta manera
        - Con los paquetes de Unity Registry es todo muy parecido pero a la hora de quitar los paquetes es otra operativa
----

## Importando paquetes registrados por Unity

- Importo 2D Sprite (en el Package Manager, Packages: Unity registry) que es para recortar Sprites
- Lo instalo
- Si quiero remover el paquete aparece en el árbol de Project/Packages
    - Si voy al Package Manager, Packages: InProject, aparece el paquete
    - Lo selecciono y en bottom-right tengo el botón de Remove
----

## Importando y Exportando Custom Packages

- Cómo crear paquetes a través de Assets que tenga en mi proyecto
- Selecciono el Modelo/Objeto/PreFab en la ventana de proyecto, clic derecho/ExportPackage
    - Aparece la ventana de lo que voy a exportar. Puedo filtrar. Le añado el nombre y la ubicación
    - Asegurarse de si está o no chequeada bottom-left include dependencies (materiales, scripts, etc)
    - Me puede interesar exportar el PreFab sin las dependencias para tener el modelo en la escena sin ninguna textura ni material
- Puedo incorporar el paquete arrastrando el paquete a la ventana de proyecto, o clic derecho/Import Package/Custom Package
---

