# IA TRAINING

## Easy of Listening

- **NO ISSUES**: suena natural y conversacional. El nivel de detalle es el adecuado, haciendo la respuesta facil de seguir y comprender
  - Lenguaje fluido 
  - Vocabulario y expresiones cotidianas
  - El tono concuerda con el contexto, ni demasiado coloquial, ni demasiado formal
  - No incluye frases complejas ni argot que dificulten su entendimiento
- **MINOR ISSUES**: contiene pequeños errores que la hacen dificil de seguir.
  - Pausas poco naturales
  - Uso ocasional de frases coloquiales poco utilizadas en lo cotidiano
  - Un tono un poco demasiado formal, pero sin causar grandes estragos
  - Algunas frases más largas o complejas de lo normal, que requieren algo más de esfuerzo del necesario
- **MAJOR ISSUES**: cuando la respuesta es demasiado formal, densa, u otra condición fuera del contexto y el lenguaje natural
  - Lenguaje feo con poca fluidez
  - Uso de vocabulario formal o técnico no usado en lo cotidiano
  - El tono no coincide en el contexto, o demasiado formal o coloquial
  - Las frases son demasiado largas o complejas, o suenan a texto escrito, haciendo que sea dificil de seguir de forma natural
------

## Verbosity

- Repetition: la redundancia o reiteración de las mismas ideas o frases
  - Se evalúa mirando si la información ha sido entregada sin redundancia
  - Preguntarse si hay fatiga tras leer la respuesta por la reiteración de ideas
- Length: lo largo del texto
  - Es el balance entre thoroughness y conciseness
  - Ni demasiado corta ni demasiado larga
    - **Too Short**: 
      - La respuesta no cubre los requerimientos del usuario, dejándose por el camino información importante o explicaciones necesarias
    - **Just Right**: la respuesta es comprensiva, proveyendo todo lo necesario, suficierntemente concisa, para mantener la claridad y el foco
    - **Too long**: elaboraciones innecesarias, haciendo la respuesta poco clara y poco concisa.
- **Supporting Content**: información adicional con los ejemplos, explicaciones y detalles, del tema central
  - Good Supporting content: ofreceprofundidad y claridad
  - Tangential or unrelated content: permanece en el tema en cuestión, ofreciendo información que no contribuye al usuario al entendimiento de la pregunta. Una cosa es dar detalles de tipos de energías renovables y su funcionamiento, y otra de sus beneficios requeridos en el prompt
------

## Instructional Following

- **Promp Request Coverage**
  - **Coverage**: se traduce en si la respuesta cubre lo requerido por el prompt, incluso de forma implicita
    - Para evaluarlo hay una Jerarquía de la Request: es mejor una respuesta que responde 450 palabras de perros que vuelan a una request de escribir una historia de 500 palabras de perros que vuelan, a una respuesta de 500 palabras de perros que no vuelan
    - Going Above and Beyond: a veces las respuestas ofrecen un montón de info adicional, no siempre útil. Si esta no lo es, podríamso decir que no ha seguido las instrucciones del prompt correctamente
  - **Understanding Relevance**:
    - Relevance es cuando evaluas como se relaciona con el prompt la información proporcionada con la respuesta 
    - **Major Issues**: 
      - Cuando hay un montón de información irrelevante.
      - Falta información explicita o implicita requerida en el prompt
    - **Minor Issues**: 
      - Está toda la respuesta relacionada con el prompt o hay algunas indicaciones fuera? 
      - La mayoría de info si está. Cumple con las acotaciones y requerimientos 
      - Faltan algunos detalles
    - **No Issues**: 
      - Está todo cubierto
      - Sigue estrictamente lo requerido en el prompt
    - **Not Applicable**
        - El prompt no contiene directivas específicas 
        - Requerimientos generales en el prompt sin un call to action
------

## Truthfullness

- Hechos verificables: 
  - Cosas que son **true** o **false** más allá de sentimientos, opiniones, interpretaciones... Pueden confirmarse
    - Para considerar un hecho verificable necesita ser:
    - **Objetivo**
    - **Observable**
    - **Repetible**
    - **Documentable**
  - Ejemplos
    - El corazón bombea sangre ---> hecho verificable
    - París es la ciudad más bonita del mundo ---> hecho NO verificable (subjetivo, opinión)
  - Herramientas:
    - **GOOGLE**
    - **LISTAS**: puede haber muchos pedazos de info verificables en una respuesta. Hacer una lista es una buena idea
- Misleading info
  - Es cuando se da por hecho verificable algo que no se puede verificar
    - Ejemplo: la dieta vegana es la más saludable.
      - Cuando debería decir: algunas personas piensan que la dieta vegana es la más saludable
- **Como identificarlos**
  - Busca palabras/expresiones extremas o superlativos: siempre, nunca, todo, nada
  - Compara y contrasta
  - Si pasas más de 30 segundos intentando verificar si es true o false es que no se puede i se trata de misleading info!
- **NOTA**: **un error en truthfulness es peor que tener problemas en writing quality o verbose**
- Cuando dos respuestas son incorrectas en términos de truthfulness se consideran fallos criticos en la respuesta
  - **Cannot Asses**
    - Más de 15 minutos requeridos para buscar las afirmaciones
    - Imposible verificar su validez
    - Cuando la respuesta es "No estoy capacitado para responder"
  - **Not Applicable**
    - Afirmaciones no verificables o opiniones presentadas como hechos
  - **Major Issues**
    - Una o mas afirmaciones centrales de la conclusión son incorrectas
    - Dos o mas supporting pieces son falsas
    - Hechos distintos a las afirmaciones son facilmente encontrados en google
  - **Minor Issues**
    - Todas las afirmaciones estan bien pero incluye un punto incorrecto de support
    - Supporting points incorrectos pero no significativos despues del argumento principal
    - Algunas afirmaciones son controvertidas y no universalmente aceptadas presentadas como hechos
  - **No Issues**
    - Las afirmaciones principales y las de soporte son correctas
    - Afirmaciones controvertidas o generalizaciones están bien introducidas y no dadas como hechos
    - Las info es verificable facilmente
------

## Safety


 
