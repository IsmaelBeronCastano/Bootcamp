# APUNTES DISEÑO SOSTENIBLE

## Programar para las personas

- "Programar es decirle a otra persona lo que pretendes que la máquina haga" --Donald Knuth
- El código sostenible debe ser **fácil de mantener a largo tiempo**
- **Diseño intuitivo y complejidad mínima**, y estar bien cubierto por pruebas automáticas
- Mantenimiento evolutivo y correctivo del software
- **No hay recetas mágicas**
- Programar para la sostenibilidad es mucho más que picar código

### El arte de escribir código comprensible

- Desafío de la claridad
- Software como arte transformador
- Resolver problemas para usuarios y mantenedores
-----

## Las reglas del diseño simple

- TDD y testing no son suficientes por si solos
- Sin principios de diseño adecuados, se puede añadir complejidad innecesaria
- Con tests adecuados, el código admite refactoring
- Las reglas de diseño simple por Kent Bech
  - Pasar los test
  - Revelar la intención
  - No duplicar conocimiento
  - Tener el menor número de elementos posibles
- *Beneficios*:
  - Código fácil de mantener
  - Mantener: poder cambiar (actualizar, añadir/quitar funcionalidad, corregir defectos)
  - Facilita la adaptación a cambios y aporta valor a los usuarios
- Limitaciones del diseño simple
  - Respetar las reglas no garantiza que otros puedan continuar con el producto
  - La complejidad inherente al problema persiste
  - Sin embargo, es la estrategia más mantenible conocida
- *La importancia de los tests*:
  - Una sólida batería de tests claros y concisos es esencial
  - Con tests adecuados, gran parte de la batalla está ganada
- *Consejos para principiantes*:
  - Antes de adentrarse en patrones de diseños, DDD, etc, asegurarse de aplicar las reglas del diseño simple
  - Priorizar que el código tenga tests
    - Un código con tests adecuados permite rfactoring
-----

## El código pasa los tests

- Todo software con vida útil prolongada necesita tests
- Las empresas de éxito respaldan su código con tests
- Referencia a repositorios abiertos con ejemplos de tests
- *Riesgos de no tener tests*:
  - Es como jugar a la ruleta rusa
  - Riesgos: pérdida de datos, dinero, tiempo
  - Problemas pueden surgir a posteriori
- Lo deseable es que al menos el 80% del código esté cubierto por tests
- TDD suele alcanzar el 90%
- 100% no es práctico
- *Calidad del código del test*:
  - El código debe de ser igual de conciso, expresivo y concreto que cualquier otro código
  - Los nombres de las pruebas deben reflejar el caso de uso con lenguaje de negocio
  - Cada test debe evaluar un único comportamiento
- *Escribir tests que aporten valor*:
  - tests fáciles de mantener
  - No tratar los tests como código de segunda clase
  - Los tests también requieren mantenimiento  
-----

## El código revela la intención

- Cuando hay que modificar para añadir funcionalidad o corregir defectos, a menudo los autores no están disponibles
- Buscamos **patrones, convenciones y consistencia**
- Esperamos que cada linea tenga un propósito
- la realidad es que el código está lleno de accidentes
- Causas: prisas, desconocimiento, falta de atención, etc
- Cuando toca trabajar con código heredado siempre tenemos la oportunidad de limpiarlo
- Escribir con intencionalidad
- Reconocer la importancia de la claridad en el código
- **Elegir soluciones que dejen clara la intención**
- **Ser deliberado en cada linea de código**
- **Utilizar espacios y lineas en blanco con propósito**
- **Ser consistente con el estilo**
- **No tomar decisiones arbitrarias**
- **Mantener un estilo coherente**
- **Mejorar o arruinar el proyecto linea a linea, día a día**
----

## Principio DRY - No hay duplicidad de conocimiento

- La tercera regla del dieño simple se refiere a **DRY (Don`t Repeat Yourself)**
- Evitar duplicidades en el código
- No solo se refiere a bloques de código repetidos
- Significa no repetir conceptos
- El código puede repetiirse si es necesario
- Diferentes contextos pueden requerir bloques de código similares
- **La duplicidad es de lejos más barata que la abstracción incorrecta**
- Antes de eliminar duplicidades 
  - Asegurarse de tener pruebas suficientes
  - Determinar si es realmente buna duplicidad de conocimiento
  - Contar hasta 3 nantes de eliminar una duplicidad
-------

## Principios YAGNI y KISS

- Mínimo número de elementosa posibles
- La cuarta regla del diseño simple es evitar la sobreingeniería
- Evitar construir software reutilizable innecesariamente
- La reutilización puede añadir complejidad innecesaria
- Enfocarse en los requisitos actuales
- YAGNI: no vas a necesitarlo (You Aint Gonna Need It)
- KISS: Mantenlo simple y estúpido (Keep iT Simple and Stupid)
- La experiencia de Beck:
  - Programar para los requisitos actuales
  - Adaptabilidad a cambios futuros
  - No ignorar la arquiitectura de software
- Los requisitos no funcionales deben abordarse tan pronto como se conozcan
  - Seguridad, intyernalización, localización...
  - Evitar añadir código por si acaso
- Falacia de la reutilización:
  - Software con excesiva configuración
  - Especialistas requeridos para las instalacionwea (cuellos de botella)
--------

## Las reglas de código sostenible

- El detrioro gradual del código
- Ignoramos la importancia de cada linea de código 
- El código no se arruina en un solo día
- El daño acumulado es dificil de reparar
- Pequeños detalloes que importan
  - Cómo nombramos métodfos y variables
  - Dónde las definimos y las inicializamos
- **Cuatro reglas básicas**:
  - El código debe estar bien cubierto por tests automáticos
  - Los tests deben ser útiles y fáciles de mantener
  - Las abstracciones deben ser adecuadas y precisas
  - Debe haber una intención clara en cada línea de código escrita
------

## Sin test no hay calidad en el software

- La cobertura adecuada es crucial
- eS IMPRESCINDIBLE ESCRIBIR BUENOS TESTS
- Sin tests se pierde el control del proyecto
- La cadencia inicial del proyecto no se mantiene
- Sin tests, terminarás con código inmanejable
  - Porque nadie escribe código perfecto a la primera
    - Tenderás a la refactorización permanente, para lo cual necesitas estar respaldado por tests
  - Se cometen errores de diseño
  - La refactorización es esencial para corregir errores de diseño
- LA REFACTORIZACIÓN DEBE SER UINA PRÁCTICA DIARIA
- Los tests de calidad son fundamentales para la refactorización
------

## Abstracciones adecuadas e intencionalidad

- La cuarta regla: programar con intención
- Evitar decisiones arbitrarias
- Razonar cada linea de código
- Evitar dogmas y buscar lógica razonada
- Si haces que el código funcione solo has hecho la mitad del trabajo
- La otra mitad es que sea facil de mantener
------

## Principio de menor sorpresa

- 