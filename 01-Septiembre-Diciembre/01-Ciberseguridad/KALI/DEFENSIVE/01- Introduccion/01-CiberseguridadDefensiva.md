# 01 CIBERSEGURIDAD DEFENSIVA - INTRO


- Seguiremos el NIST (National Institue of Standards and Technology) Cyber Security Framework
- Divide la ciberseguridad en 5 subdominios:
  - Identify: de las amenazas, de los activos en la infraestructura, de los procesos críticos de negocio, etc
  - Protect: protección de todo lo identificado y de las posibles amenazas
  - Detect: detección de posibles amenazas, anomalías, eventos de seguridad
  - Respond: respuesta cuando sufrimos un ataque a la seguridad, que fases debemos seguir, que herramientas usar
  - Recover: recuperación ante un posible incidente de seguridad
### Blue Team Vs Red Team Vs Purple Team

- El Blue Team está orientado a la ciberseguridad defensiva. Establecen y mantienen las medidas de seguridad necesarias para la infraestructura de una organización
- El Red Team está orientado a la ciberseguridad ofensiva. Prueban la eficacia de las medidas de seguridad implementadas. Su objetivo es identificar brechas de seguridad que necesiten ser abordadas
- El Purple Team combina el Red Team y el Blue Team: su objetivo es que el blue team aprenda de las tácticas y técnicas del red team.
- O almenos es una manera de encasillar. Puedes estar fuera de esto y tocar un poco todo
----

## Pilares de la confidencialidad

- La triada CIA
    - Confidencialidad: capacidad de garantizar que la info no se encuentra disponible
      - La info almacenada no puede ser consultada por error o de manera intencionada sin autorización
      - La info que se transmite de punto A a punto B no puede ser consultada sin autorización
    - Integridad: capacidad de garantizar la exactitud y completitud de la información a lo largo de todo su ciclo de vida
      - La información almacenada no puede ser modificada por error o intencionalmente si el conocimiento de quien la ha almacenado
      - la información que se transmite de punto A a punto B no puede ser modificada por error o intencionalmente sin el consentimiento del emisor
    - Disponibilidad: capacidad de garantizar la accesibilidad de la información
      - La información debe poder ser consultada siempre que sea necesario
- La triada CIA es suficiente para que sirvan de driver para implementar las medidas necesarias?
- Podrían tenerse tres pilares más
- La autenticación, la autorización y el no repudio (garantizar que el receptor de la información pueda negar haberla recibido)
-----

## Amenaza, ataque y vulnerabilidad

- Hay un entorno de amenazas posibles con capacidades de afectar negativamente a traves de un acceso no autorizado a una infraestructura
- Un servidor expuesto a internet esta expuesto a infinidad de amenazas
- Hay varias fuentes, no siempre relacionadas con actores. También eventos accidental (terremotos, entre otros)
- Una vulnerabilidad es una falla en el diseño o implementación de controles internos y que puede derivar en fugas de información o violar las politicas de seguridad del sistema
- Los servicios, las aplicaciones, pueden tener fallas, una web es vulnerable al sql injection, por ejemplo
- Un ataque es el mecanismo mediante el que un atacante explota una vulnerabilidad
- 