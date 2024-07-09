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

- POLA (Principle Of Least Astolishment)
- El código debe comportarse de manera predecible y sin sorpresas
- Su objetivo es evitar sorpresas desagradables en el software, ya que rara vez son positivas
- Principio clave de diseño: este principio es quizá el más importante en el diseño de software
- El código debe ser claro y previsible, sin necesidad de inspeccionar todos los detalles de funciones, métodos, variables
- Comportamiento de caja negra: cada abstracción o artefacto debe actuar como una caja negra, con entradas y salidas claras y un comportamiento obvio.
-----

## Código coherente

- Para escribir código sin sorpresas debe haber una coherencia en la forma en que combinamos nuestras abstracciones
- Las abstracciones deben alinearse con su comportamiento esperado
----

## Consistencia en los tipos de retorno

- Inconsistencia en funciones: algunos lenguajes permiten diferentes tipos de datos para el retorno de una función, lo que puede llevar a resultados inesperados
- El efecto de estas inconsistencias acaba proliferando el **código defensivo** con if, else if, try catch, etc
- **Enfoque recomendado**
  - Evitar la programación defensiva innecesaria: se recomienda evitar la programación defensiva dentro del código que controlamos directamente
  - Programación defensiva en los limites del sistema: solo se justifica en los limites de nuestro sistema, dónde interactuamos con código externo fura de nuestro control
  - Consistencia y control: se busca la consistencia en los artefactos que construimos y confianza en su comportamiento
----

## Evita el Monkey Patching

- Monkey Patching es cuando los lenguajes dinámicos permiten cambiar partes del sistema base durante la ejecución
- Un ejemplo de mal uso es usar prototype para cambiar el método toUpperCase a toLowerCase
- Está desaconsejada por el factor sorpresa
- A veces es necesario cuando necesitamos alterar el comportamiento de un código que no podemos cambiar
- Es útil en los tests y construcción de frameworks y librerías
----

## Naming

- "Nuestro código debe ser simple y directo. debería leerse con la misma facilidad que un texto bien escrito"
- El código debe revelar la abstracción
- **Abstracciones significativas**: para cumplir la regla de que el código revele la intención y esté libre de sorpresas, las abstracciones deben tener sentido
- **Elección de nombres**: Cada palabra en el código es un concepto introducido y una oportunidad para conceptualizar el resto del código
- **Conceptos como modelos simplificados**: los conceptos son abstracciones que nos ayudan a entender la realidad, como palabra "mesa" evoca una imagen mental. La palabra mesa es una abstracción
- **Restricciones para nombrar mejor**:
  - Que sea pronunciable (preferiblemente en inglés, sin comernos letras). Puede ser todo lo largo que necesites
  - Que no haya abreviaturas (sin símbolos)
  - Que no haya información técnica del elemento en el nombre (evita reflejar tipos de datos)
  - Que sea tan concreto que no sirva para nombrar ningún otro elemento (helper, manager son demasiado genéricos)
    - En DDD hay un lenguaje obicuo. Se intenta establecer un lenguaje común entre developers con la creación de un glosario y mantener una nomenclatura homgénia
  - Que combine bien con palabras reservadas del lenguaje (como if isPaidInVoice, o if IsNotBlank)
    - Para booleanos usar **is, has, does, are, contains**
    - Para las negaciones isNot, doesnt, hasnt
    - No se recomienda usar and o or
  - Que no sea un alias de otro nombre (no usar nombres diferentes para el mismo concepto, ni sinónimos innecesarios para operaciones conocidas)
    - Ejemplos de redundancia, una función que se llame splitByComas, throwError
    - No usar en unos casos user, en otrs client, en otros customer, a no ser que presenten características diferentes
  - Que considere su contexto
    - El nombre de un método debe apoyarse en el de us clase así como en el de sus argumentos
    - Por ejemplo: calculator.sumOfNumbersIn(expression), o mapper.toDto(user), action.esceute(command)
  - Que distinga entre sustantivos y verbos (uso desustantivos para clases, módulos o paquetes y verbos para métodos o funciones)
- Estas restricciones son heurísticas, no son reglas estrictas
- A veces lo mejor es no nombrar y encadenar llamadas a funciones
---- 
