/**
 * Preguntas predeterminadas para el juego
 * Estas preguntas se usarán si el usuario no carga un archivo CSV propio
 */
export default [
  // Preguntas fáciles
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "París", "Madrid", "Roma"],
    correctOption: 1,
    difficulty: "easy"
  },
  {
    question: "¿Cuántos lados tiene un triángulo?",
    options: ["3", "4", "5", "6"],
    correctOption: 0,
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el planeta más cercano al Sol?",
    options: ["Venus", "Tierra", "Marte", "Mercurio"],
    correctOption: 3,
    difficulty: "easy"
  },
  {
    question: "¿Qué animal es conocido como el rey de la selva?",
    options: ["Tigre", "León", "Pantera", "Guepardo"],
    correctOption: 1,
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el océano más grande del mundo?",
    options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    correctOption: 2,
    difficulty: "easy"
  },
  
  // Preguntas medias
  {
    question: "¿En qué año comenzó la Segunda Guerra Mundial?",
    options: ["1935", "1939", "1941", "1945"],
    correctOption: 1,
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el elemento químico con símbolo Fe?",
    options: ["Fósforo", "Flúor", "Hierro", "Francio"],
    correctOption: 2,
    difficulty: "medium"
  },
  {
    question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    options: ["206", "214", "186", "248"],
    correctOption: 0,
    difficulty: "medium"
  },
  {
    question: "¿Quién pintó 'La noche estrellada'?",
    options: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Salvador Dalí"],
    correctOption: 2,
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"],
    correctOption: 1,
    difficulty: "medium"
  },
  
  // Preguntas difíciles
  {
    question: "¿En qué año se descubrió la penicilina?",
    options: ["1928", "1932", "1945", "1921"],
    correctOption: 0,
    difficulty: "hard"
  },
  {
    question: "¿Cuál es el número atómico del carbono?",
    options: ["12", "14", "6", "8"],
    correctOption: 2,
    difficulty: "hard"
  },
  {
    question: "¿Quién formuló la teoría de la relatividad?",
    options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
    correctOption: 1,
    difficulty: "hard"
  },
  {
    question: "¿En qué año se fundó la ONU?",
    options: ["1945", "1950", "1939", "1960"],
    correctOption: 0,
    difficulty: "hard"
  },
  {
    question: "¿Cuál es la montaña más alta del mundo?",
    options: ["K2", "Monte Everest", "Kangchenjunga", "Lhotse"],
    correctOption: 1,
    difficulty: "hard"
  }
];
