export const FIA_CAREERS = [
  "Ingeniería Industrial",
  "Ingeniería Civil",
  "Arquitectura",
] as const;

export type FiaCareer = (typeof FIA_CAREERS)[number];

export const SHEET_NAMES = {
  students: "1_Estudiantes",
  sponsors: "2_Patrocinadores",
  teachers: "3_Docentes",
  guests: "4_Invitados",
} as const;

export const DEFAULT_SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID ||
  "1LIg8NUKe-Iznb_tVulvpQywh0sUzIWc49jhkRIg-K-E";

export const DEFAULT_STUDENTS = [
  {
    "cif": "23021590",
    "fullName": "Adriana Alexandra Ruiz Valverde",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 2
  },
  {
    "cif": "23010206",
    "fullName": "Adriano Samuel Medina",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 3
  },
  {
    "cif": "19014885",
    "fullName": "Aldrin Olivas Gonzalez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 4
  },
  {
    "cif": "23021170",
    "fullName": "Alejandra Gisselle Portillo Ruiz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 5
  },
  {
    "cif": "25010174",
    "fullName": "Alejandra Romero Aguilar",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 6
  },
  {
    "cif": "23021014",
    "fullName": "Alejandra Valeria Moncada Quiroz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 7
  },
  {
    "cif": "24011213",
    "fullName": "Alex Rodolfo Calderon Gómez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 8
  },
  {
    "cif": "24011518",
    "fullName": "Alexa Jessenia Manzanarez Martinez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 9
  },
  {
    "cif": "24012203",
    "fullName": "Alexandra Marcela Obando Saintclair",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 10
  },
  {
    "cif": "23021310",
    "fullName": "Alexandra Maritza Duarte Anduray",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 11
  },
  {
    "cif": "24014100",
    "fullName": "Alina Lucia Mena Castillo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 12
  },
  {
    "cif": "22011541",
    "fullName": "Alison Denisse Sandino Hurtado",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 13
  },
  {
    "cif": "23021733",
    "fullName": "Allan Josué Zeledón Castro",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 14
  },
  {
    "cif": "24011227",
    "fullName": "Alondra Daniela Villarreal Chamorro",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 15
  },
  {
    "cif": "24011520",
    "fullName": "Alondra Melissa Treminio Salmeron",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 16
  },
  {
    "cif": "23021555",
    "fullName": "Álvaro José Fonseca Delgado",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 17
  },
  {
    "cif": "23012274",
    "fullName": "Amanda Sofía Domínguez Delgado",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 18
  },
  {
    "cif": "23011063",
    "fullName": "Amaru Isaias Castillo Tijerino",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 19
  },
  {
    "cif": "25011426",
    "fullName": "Ana Gabriela Díaz Pichardo",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 20
  },
  {
    "cif": "24010581",
    "fullName": "Ana Regina Alvarez Membreño",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 21
  },
  {
    "cif": "22021148",
    "fullName": "Ana Sofía Arana Maltez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 22
  },
  {
    "cif": "23021376",
    "fullName": "Ana Sofia Cano Vázquez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 23
  },
  {
    "cif": "24011184",
    "fullName": "Anahí Cristiana Elí Chavarría Ruiz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 24
  },
  {
    "cif": "22021117",
    "fullName": "Anahiris Raquel Corrales Beteta",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 25
  },
  {
    "cif": "24010997",
    "fullName": "Andoni Alberto Pavón Romero",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 26
  },
  {
    "cif": "23020927",
    "fullName": "Andre Enmanuel Joiner Angulo",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 27
  },
  {
    "cif": "25010457",
    "fullName": "André Marcelo Morales Bejarano",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 28
  },
  {
    "cif": "21011817",
    "fullName": "Andrea Fernanda Flores Perez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 29
  },
  {
    "cif": "24011074",
    "fullName": "Andrea Isabel Tinoco Guerra",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 30
  },
  {
    "cif": "23020140",
    "fullName": "Andrea Nicole Alfaro Salvatierra",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 31
  },
  {
    "cif": "24011199",
    "fullName": "Aneth Carolina Arguello López",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 32
  },
  {
    "cif": "22010210",
    "fullName": "Angel Gabriel Centeno Avalos",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 33
  },
  {
    "cif": "22020131",
    "fullName": "Ángel Gabriel Mercado Montenegro",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 34
  },
  {
    "cif": "24010698",
    "fullName": "Ángela Amelia López Espinal",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 35
  },
  {
    "cif": "23021573",
    "fullName": "Angela Michelle Rojas Rosales",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 36
  },
  {
    "cif": "24011059",
    "fullName": "Angeles Ivette Herrera Castillo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 37
  },
  {
    "cif": "22020599",
    "fullName": "Angie Salet Perez Martinez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 38
  },
  {
    "cif": "23010176",
    "fullName": "Anibal Ivan Rizo Maradiaga",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 39
  },
  {
    "cif": "22021027",
    "fullName": "Anicia Azucena Enríquez Rodríguez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 40
  },
  {
    "cif": "25011743",
    "fullName": "Ariel Dávila Rodríguez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 41
  },
  {
    "cif": "24010177",
    "fullName": "Arlen Marina Siu Paz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 42
  },
  {
    "cif": "23020433",
    "fullName": "Armando Ignacio Gomez Bohorquez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 43
  },
  {
    "cif": "25012377",
    "fullName": "Ashley Aracelly Rivas Duarte",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 44
  },
  {
    "cif": "23021592",
    "fullName": "Ashley Naomi Bermúdez Ruiz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 45
  },
  {
    "cif": "22020418",
    "fullName": "Ashley Nicole Lopez Bustos",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 46
  },
  {
    "cif": "24011201",
    "fullName": "Astrid Sarahi Sobalvarro Icaza",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 47
  },
  {
    "cif": "23020490",
    "fullName": "Aura Maria Gonzalez Gonzalez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 48
  },
  {
    "cif": "22020126",
    "fullName": "Aylleng Vanessa Meneses Melendez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 49
  },
  {
    "cif": "24010274",
    "fullName": "Bayardo Antonio Rueda Tigerino",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 50
  },
  {
    "cif": "23021567",
    "fullName": "Bayardo Noel Box Gaitán",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 51
  },
  {
    "cif": "23021530",
    "fullName": "Beatriz Adriana Barberena Cordero",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 52
  },
  {
    "cif": "25012139",
    "fullName": "Belinda Nohemy Pineda Aragon",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 53
  },
  {
    "cif": "24014405",
    "fullName": "Bismark Ariel Solorzano Martínez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 54
  },
  {
    "cif": "22020587",
    "fullName": "Bomnnielly Cecilia Segovia Argeñal",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 55
  },
  {
    "cif": "24011651",
    "fullName": "Briseth Ileana Hernández Santos",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 56
  },
  {
    "cif": "SIN-CIF-57",
    "fullName": "Britney Victoria López Valverde",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 57
  },
  {
    "cif": "23010448",
    "fullName": "Bruno Antonio Delgado Cruz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 58
  },
  {
    "cif": "22021342",
    "fullName": "Bruno Gabriel Araica Muñoz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 59
  },
  {
    "cif": "23010813",
    "fullName": "Byron Alexander Martines Doña",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 60
  },
  {
    "cif": "19015089",
    "fullName": "Camila Jose Valdivia Salinas",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 61
  },
  {
    "cif": "24013215",
    "fullName": "Camila Michelle Flores Díaz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 62
  },
  {
    "cif": "24011224",
    "fullName": "Carlos Alberto Pérez Quintanilla",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 63
  },
  {
    "cif": "24013762",
    "fullName": "Carlos Eduardo Morales Alizaga",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 64
  },
  {
    "cif": "23020184",
    "fullName": "Carlos Ernesto Manzanares Fonseca",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 65
  },
  {
    "cif": "25010090",
    "fullName": "Carlos Gael Ramirez Somarriba",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 66
  },
  {
    "cif": "24010986",
    "fullName": "Carlos José Sequeira Baquedano",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 67
  },
  {
    "cif": "23021657",
    "fullName": "Carlos Roberto Zaldaña Sánchez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 68
  },
  {
    "cif": "21011706",
    "fullName": "Carlos Salvador Hidalgo Gutiérrez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 69
  },
  {
    "cif": "25011039",
    "fullName": "Cesar Mauricio Pacheco Leyton",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 70
  },
  {
    "cif": "24014062",
    "fullName": "César Vicente Osejo Mejía",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 71
  },
  {
    "cif": "23021747",
    "fullName": "Cesar Yohel Moreno",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 72
  },
  {
    "cif": "23021090",
    "fullName": "Christian Andrés Gutiérrez López",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 73
  },
  {
    "cif": "23020803",
    "fullName": "Christopher Alejandro Nuñez Urcuyo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 74
  },
  {
    "cif": "22011205",
    "fullName": "Concepción Argüello Aguilar",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 75
  },
  {
    "cif": "24013893",
    "fullName": "Cristian Enmanuel Campos Morraz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 76
  },
  {
    "cif": "24011008",
    "fullName": "Cristiana Galilea Castro Oporta",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 77
  },
  {
    "cif": "23010455",
    "fullName": "Cristiana Yorlene Martínez Orozco",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 78
  },
  {
    "cif": "24014362",
    "fullName": "Cristina Isamar Hernandez Martinez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 79
  },
  {
    "cif": "19014463",
    "fullName": "Crysthel Marian Cisneros García",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 80
  },
  {
    "cif": "24010863",
    "fullName": "Daisy Lucia Garcia Rivera",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 81
  },
  {
    "cif": "22020025",
    "fullName": "Dalila Sofia Delgado Guevara",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 82
  },
  {
    "cif": "24011764",
    "fullName": "Daniela De Andrea Serrano Herrera",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 83
  },
  {
    "cif": "23020467",
    "fullName": "Daniela Gisele Rocha",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 84
  },
  {
    "cif": "24014065",
    "fullName": "Darwing Manuel Torres Rubio",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 85
  },
  {
    "cif": "24011018",
    "fullName": "David Alejandro Andara Benavides",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 86
  },
  {
    "cif": "22020806",
    "fullName": "David De Jesús Blandón Bustamante",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 87
  },
  {
    "cif": "23012220",
    "fullName": "Dayana Odett Hernández Ruiz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 88
  },
  {
    "cif": "24010731",
    "fullName": "Daysi Ximena Ulloa Murillo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 89
  },
  {
    "cif": "22020826",
    "fullName": "Deglis Antonio Porras Sequeira",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 90
  },
  {
    "cif": "23021156",
    "fullName": "Denis Eduardo Arauz Jarquín",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 91
  },
  {
    "cif": "23020301",
    "fullName": "Dennis Mauricio Madrigal Pineda",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 92
  },
  {
    "cif": "24010875",
    "fullName": "Diana Carolina Vela Rocha",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 93
  },
  {
    "cif": "24010193",
    "fullName": "Diana Lucía Romero Valverde",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 94
  },
  {
    "cif": "22021346",
    "fullName": "Diaz Ramos Walter Alexander",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 95
  },
  {
    "cif": "23020182",
    "fullName": "Diego Arturo Gómez Madriz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 96
  },
  {
    "cif": "24013602",
    "fullName": "Diego Francisco Rojas Pérez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 97
  },
  {
    "cif": "24014406",
    "fullName": "Diego Gustavo Cruz López",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 98
  },
  {
    "cif": "23010159",
    "fullName": "Diego Roberto Corrales Espinoza",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 99
  },
  {
    "cif": "23010399",
    "fullName": "Ebrina Del Carmen Hernández Benítez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 100
  },
  {
    "cif": "22020878",
    "fullName": "Eduardo José Valenzuela García",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 101
  },
  {
    "cif": "24014377",
    "fullName": "Elias Enoc Hernández Martínez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 102
  },
  {
    "cif": "23010271",
    "fullName": "Elías Josué Membreño Martínez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 103
  },
  {
    "cif": "25010524",
    "fullName": "Eliezer Gabriel Zelaya Palma",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 104
  },
  {
    "cif": "17010174",
    "fullName": "Elvin Peniel Rodriguez Rizo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 105
  },
  {
    "cif": "24010203",
    "fullName": "Erica Valeria Coronado Bravo",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 106
  },
  {
    "cif": "23011240",
    "fullName": "Erick Misael Villanueva Blandon",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 107
  },
  {
    "cif": "25012898",
    "fullName": "Ervin Danilo Talavera Rivas",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 108
  },
  {
    "cif": "22010045",
    "fullName": "Esteban Franco Alfaro",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 110
  },
  {
    "cif": "19011900",
    "fullName": "Esther Sarai Navarro Castañeda",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 111
  },
  {
    "cif": "24010430",
    "fullName": "Eva Nahomy Guatemala Espinoza",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 112
  },
  {
    "cif": "22021340",
    "fullName": "Evand Sebastián Bonilla Torrentes",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 113
  },
  {
    "cif": "23010372",
    "fullName": "Fabián David Sánchez Cano",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 114
  },
  {
    "cif": "24011756",
    "fullName": "Fabiana Gabriela Argeñal Diaz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 115
  },
  {
    "cif": "23021416",
    "fullName": "Fabiola Carolina Bussem Quintero",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 116
  },
  {
    "cif": "23021013",
    "fullName": "Fabrizio Alejandro Escobar",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 117
  },
  {
    "cif": "23021632",
    "fullName": "Fergie Hermione Mendoza Ortega",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 118
  },
  {
    "cif": "25010815",
    "fullName": "Fernando Javier García López",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 119
  },
  {
    "cif": "22020818",
    "fullName": "Fernando Jose Tijerino Mondragon",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 120
  },
  {
    "cif": "21011980",
    "fullName": "Fernando Jose Zapata Pomarez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 121
  },
  {
    "cif": "23020601",
    "fullName": "Fernando Julián Torres Velásquez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 122
  },
  {
    "cif": "25010048",
    "fullName": "Fernando Muñoz Corrales",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 123
  },
  {
    "cif": "23021130",
    "fullName": "Fidel Rodriguez Orozco",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 124
  },
  {
    "cif": "22011112",
    "fullName": "Flavio Cesar Silva Conrado",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 125
  },
  {
    "cif": "25014555",
    "fullName": "Francella Javiera Ortiz Siles",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 126
  },
  {
    "cif": "22010595",
    "fullName": "Francis Lucia Chavarría Hernández",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 127
  },
  {
    "cif": "24010641",
    "fullName": "Frank Oliver Medal Moreno",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 128
  },
  {
    "cif": "24010897",
    "fullName": "Freddy Ernesto Araica Jarquin",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 129
  },
  {
    "cif": "22020481",
    "fullName": "Gabriel Enrique Melendez Otero",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 130
  },
  {
    "cif": "23021410",
    "fullName": "Gabriela Belén Góngora Escobar",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 131
  },
  {
    "cif": "25014463",
    "fullName": "Gabriela María Gómez López",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 132
  },
  {
    "cif": "24010918",
    "fullName": "Gamal Hassan Hamad Bravo",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 133
  },
  {
    "cif": "23021086",
    "fullName": "Gema Paola Arauz Cisnero",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 134
  },
  {
    "cif": "22011511",
    "fullName": "Génesis Rubí Cubillo Navarro",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 135
  },
  {
    "cif": "23010712",
    "fullName": "Gerald Ernesto Hernández Huerta",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 136
  },
  {
    "cif": "24010796",
    "fullName": "Gershon Joel Campbell Calero",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 137
  },
  {
    "cif": "25014587",
    "fullName": "Gian Antjony Cruz Reyes",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 138
  },
  {
    "cif": "23021031",
    "fullName": "Gisselle María López López",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 139
  },
  {
    "cif": "23010380",
    "fullName": "Gonzalez Jarquin Jesy Nicole",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 140
  },
  {
    "cif": "22020364",
    "fullName": "Grethel Michell Hernandez Fuentes",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 141
  },
  {
    "cif": "2302119",
    "fullName": "Handly Alexander Leiva Lopéz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 142
  },
  {
    "cif": "24013884",
    "fullName": "Hazell Carollina Borgen Rodezno",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 143
  },
  {
    "cif": "23010524",
    "fullName": "Hilario Jose Medina Rivas",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 144
  },
  {
    "cif": "22011540",
    "fullName": "Hillary Isabella Sandino Hurtado",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 145
  },
  {
    "cif": "19011964",
    "fullName": "Ho Su Kuk Fonseca",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 146
  },
  {
    "cif": "SIN-CIF-147",
    "fullName": "Hollmer Alejandro García Delgado",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 147
  },
  {
    "cif": "23010730",
    "fullName": "Ian Franco Vega Romero",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 148
  },
  {
    "cif": "24010275",
    "fullName": "Ian Hakim Meza García",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 149
  },
  {
    "cif": "25011732",
    "fullName": "Ian Rene Cortez González",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 150
  },
  {
    "cif": "24010980",
    "fullName": "Iara Yaiza Balladares Amaya",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 151
  },
  {
    "cif": "25010128",
    "fullName": "Ilichs Ernesto Bermudez Rodriguez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 152
  },
  {
    "cif": "22020144",
    "fullName": "Illiat Benjamin Jirón Chavarría",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 153
  },
  {
    "cif": "23020283",
    "fullName": "Isaac Antonio Palma Andino",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 154
  },
  {
    "cif": "23010582",
    "fullName": "Isaac Ernesto Romero Guardado",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 155
  },
  {
    "cif": "24010481",
    "fullName": "Isabel Guadalupe Mena Talavera",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 156
  },
  {
    "cif": "24011115",
    "fullName": "Itzel Valeska Luna Sirias",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 157
  },
  {
    "cif": "24011678",
    "fullName": "Iván Alfonso Granados Castellón",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 158
  },
  {
    "cif": "23010346",
    "fullName": "Ivania Javiera Pineda Alfaro",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 159
  },
  {
    "cif": "22020120",
    "fullName": "Jahosca Alejandra Orozco Chávez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 160
  },
  {
    "cif": "22011617",
    "fullName": "Jairo Sebastian Cruz Castro",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 161
  },
  {
    "cif": "23021332",
    "fullName": "Jana Del Carmen Rodríguez Raudez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 162
  },
  {
    "cif": "22021108",
    "fullName": "Janice Scarlette Cruz Guillen",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 163
  },
  {
    "cif": "23010998",
    "fullName": "Janya Gabriela Cubillo Nicaragua",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 164
  },
  {
    "cif": "19014377",
    "fullName": "Javier Andrés López Pérez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 165
  },
  {
    "cif": "22021305",
    "fullName": "Jefferson Steven Macias Salinas",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 166
  },
  {
    "cif": "25010709",
    "fullName": "Jennifer Guadalupe Marin Sandigo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 167
  },
  {
    "cif": "23021333",
    "fullName": "Jennifer Julieth Largaespada Melendez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 168
  },
  {
    "cif": "24014346",
    "fullName": "Jennifer Vanegas Cajina",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 169
  },
  {
    "cif": "25014961",
    "fullName": "Jennifer Vanessa Zanabria Molina",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 170
  },
  {
    "cif": "23021132",
    "fullName": "Jheron Alexander Treminio Ruiz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 171
  },
  {
    "cif": "24010483",
    "fullName": "Jhonny José Baca Gómez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 172
  },
  {
    "cif": "19010092",
    "fullName": "Jimena July Irías Chavarría (Pago Bac)- 150",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 173
  },
  {
    "cif": "22010633",
    "fullName": "Joao Farid Rugama González",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 174
  },
  {
    "cif": "23021083",
    "fullName": "Joaquín Emilio Areas Benavidez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 175
  },
  {
    "cif": "24012089",
    "fullName": "Joha José González López",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 176
  },
  {
    "cif": "21011613",
    "fullName": "Johao Alejandro Gómez Sánchez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 177
  },
  {
    "cif": "23020549",
    "fullName": "Johnny Angel Calero Quiroz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 178
  },
  {
    "cif": "25010965",
    "fullName": "Joliet Amanda Aleman Sanchez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 179
  },
  {
    "cif": "23010212",
    "fullName": "Jorge Alberto Suarez Mclean",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 180
  },
  {
    "cif": "25010571",
    "fullName": "Jorge Enmanuel Sobalvarro Jarquín",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 181
  },
  {
    "cif": "23010445",
    "fullName": "José Alejandro Montero Artavia",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 182
  },
  {
    "cif": "23021322",
    "fullName": "José Antonio Romero Sánchez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 183
  },
  {
    "cif": "24011001",
    "fullName": "José Daniel Ruíz Blandón",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 184
  },
  {
    "cif": "23010059",
    "fullName": "José Isaí Díaz Suárez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 185
  },
  {
    "cif": "24011535",
    "fullName": "José Luis Vallecillo Hernández",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 186
  },
  {
    "cif": "25013177",
    "fullName": "Jose Manuel Calero Ocampo",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 187
  },
  {
    "cif": "23020270",
    "fullName": "José María López Jackson",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 188
  },
  {
    "cif": "24014478",
    "fullName": "José Nathanael Davila Mercado",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 189
  },
  {
    "cif": "26011278",
    "fullName": "José Ricardo Gómez Castro",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 190
  },
  {
    "cif": "24010674",
    "fullName": "Josefa Esperanza Castillo Martínez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 191
  },
  {
    "cif": "23011192",
    "fullName": "Josenrique Argüello Dubon",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 192
  },
  {
    "cif": "23010146",
    "fullName": "Joseph Enrique Fiallos Montenegro",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 193
  },
  {
    "cif": "26010918",
    "fullName": "Josué Francisco Moreno Marín",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 194
  },
  {
    "cif": "24012384",
    "fullName": "Josué Salomón Hernández Tellez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 195
  },
  {
    "cif": "23021422",
    "fullName": "Juan Alberto Gozález Narváez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 196
  },
  {
    "cif": "23020489",
    "fullName": "Juan Camilo Gutiérrez Tapia",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 197
  },
  {
    "cif": "25010462",
    "fullName": "Juan Carlos Vargas Ortega",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 198
  },
  {
    "cif": "23021477",
    "fullName": "Juan De Dios Valdivia Reyes",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 199
  },
  {
    "cif": "25010816",
    "fullName": "Juan Francisco Lindo Bustamante",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 200
  },
  {
    "cif": "23011287",
    "fullName": "Juan Francisco Müller López",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 201
  },
  {
    "cif": "24013424",
    "fullName": "Julio Cesar Marin Benavides",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 202
  },
  {
    "cif": "22020343",
    "fullName": "Julio Javier Sevilla Gallegos",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 203
  },
  {
    "cif": "21012551",
    "fullName": "Junior David Orozco Acevedo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 204
  },
  {
    "cif": "25011455",
    "fullName": "Justin Steven Rivas García",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 205
  },
  {
    "cif": "22020813",
    "fullName": "Justin Steven Ruiz Roa",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 206
  },
  {
    "cif": "23010115",
    "fullName": "Katheryne Lucia Martinez Largaespada",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 207
  },
  {
    "cif": "23020278",
    "fullName": "Kenice Fabiana Merlo Bermúdez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 208
  },
  {
    "cif": "22020766",
    "fullName": "Kenneth Andres Reyes Ruiz",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 209
  },
  {
    "cif": "25011118",
    "fullName": "Kimberly Margarita Valdivia Guido",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 210
  },
  {
    "cif": "23021041",
    "fullName": "Kristen Andrea Ruiz López",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 211
  },
  {
    "cif": "24010767",
    "fullName": "Leonardo Javier Moreira Reyes",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 212
  },
  {
    "cif": "24010554",
    "fullName": "Linda Isabella Espinoza Palacios",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 213
  },
  {
    "cif": "23010319",
    "fullName": "Lisbeth Ruiz Rivera",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 214
  },
  {
    "cif": "24011067",
    "fullName": "Liz Fernanda Luna Castro",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 215
  },
  {
    "cif": "21012634",
    "fullName": "Liz Karina Espinoza Artola",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 216
  },
  {
    "cif": "23021397",
    "fullName": "Lorena Migdalia Morales Alvarado",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 217
  },
  {
    "cif": "24012167",
    "fullName": "Lucía Gabriela Umaña Guerrero",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 218
  },
  {
    "cif": "25011535",
    "fullName": "Lucia Nathalia Hermida Gutiérrez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 220
  },
  {
    "cif": "22020782",
    "fullName": "Ludnys Del Carmen Sánchez Balmaceda",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 221
  },
  {
    "cif": "23021576",
    "fullName": "Luis Enrique Barreda Talavera",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 222
  },
  {
    "cif": "SIN-CIF-223",
    "fullName": "Luis Enrique Vega Aleman",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 223
  },
  {
    "cif": "23010164",
    "fullName": "Luis Fernando Cajina Toruño",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 224
  },
  {
    "cif": "24010773",
    "fullName": "Marcela Del Carmen Tellez Cruz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 225
  },
  {
    "cif": "SIN-CIF-226",
    "fullName": "Marcela Victoria Rivera Jiron",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 226
  },
  {
    "cif": "23010589",
    "fullName": "Marco Antonio Palacios Torres",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 227
  },
  {
    "cif": "25011544",
    "fullName": "Marcos Alejandro Gutiérrez Quiñonez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 228
  },
  {
    "cif": "23012389",
    "fullName": "María Alejandra Barrera Monterrey",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 229
  },
  {
    "cif": "25010282",
    "fullName": "María Andrea Somarriba Morales",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 230
  },
  {
    "cif": "23020906",
    "fullName": "María Belén Jarquín Martínez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 231
  },
  {
    "cif": "SIN-CIF-232",
    "fullName": "Maria Eduarda Oconnor Rodriguez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 232
  },
  {
    "cif": "24010849",
    "fullName": "María Fernanda Almendarez Guzmán",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 233
  },
  {
    "cif": "21011608",
    "fullName": "María Fernanda López Salmerón",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 234
  },
  {
    "cif": "22020822",
    "fullName": "María Gabriela Altamirano Baldizón",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 235
  },
  {
    "cif": "22020084",
    "fullName": "Maria Gabriela Jarquín Parrillas",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 236
  },
  {
    "cif": "25014311",
    "fullName": "María Guadalupe Moreno González",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 237
  },
  {
    "cif": "23012239",
    "fullName": "María Isabel Domínguez Garay",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 238
  },
  {
    "cif": "23011383",
    "fullName": "María José Hurtado Pérez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 239
  },
  {
    "cif": "24011021",
    "fullName": "María José Miranda Rodríguez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 240
  },
  {
    "cif": "22020832",
    "fullName": "Maria Marcela Lindo Velázquez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 241
  },
  {
    "cif": "23020394",
    "fullName": "Maria Nathalia Soza Carvallo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 242
  },
  {
    "cif": "22021265",
    "fullName": "Mariana Vásquez Vado",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 243
  },
  {
    "cif": "23020434",
    "fullName": "Mariángeles Martínez Martínez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 244
  },
  {
    "cif": "22020847",
    "fullName": "Mariangeles Morales Meneses",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 245
  },
  {
    "cif": "22020528",
    "fullName": "Mariangeles Valeska Cabezas Espinoza",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 246
  },
  {
    "cif": "18010898",
    "fullName": "Mariano Eli Baldizon Rodriguez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 247
  },
  {
    "cif": "23011111",
    "fullName": "Mariel José López Pavón",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 248
  },
  {
    "cif": "24011131",
    "fullName": "Marilyn Del Carmen Mejía Escobar",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 249
  },
  {
    "cif": "23010248",
    "fullName": "Marisabel Ruíz Herrera",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 250
  },
  {
    "cif": "24010945",
    "fullName": "Marlon Adrian Laguna Bonilla",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 251
  },
  {
    "cif": "25010344",
    "fullName": "Marlon Ibrahim Muñoz Silwany",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 252
  },
  {
    "cif": "23021080",
    "fullName": "Martha Nohelia Pomares Monjarret",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 253
  },
  {
    "cif": "22010387",
    "fullName": "Maximo Daniel Alvarado Lopez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 254
  },
  {
    "cif": "23010329",
    "fullName": "Mayela Isabel Medrano Alvarado",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 255
  },
  {
    "cif": "19014706",
    "fullName": "Mayling Gabriela Siles Medina",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 256
  },
  {
    "cif": "22021219",
    "fullName": "Miguel Ángel Soza Novoa",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 257
  },
  {
    "cif": "24010484",
    "fullName": "Monica Del Carmen Torres Barrios",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 258
  },
  {
    "cif": "19014194",
    "fullName": "Narciso Salvador Granja Henrique",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 259
  },
  {
    "cif": "23020370",
    "fullName": "Natalia Marcela Montiel Jirón",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 260
  },
  {
    "cif": "23021022",
    "fullName": "Nathalie Michelle Zamora Moreno",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 261
  },
  {
    "cif": "24010424",
    "fullName": "Nayelis Ivell Alvarado Calero",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 262
  },
  {
    "cif": "25011785",
    "fullName": "Neiyeling Aileen González Rodríguez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 263
  },
  {
    "cif": "SIN-CIF-264",
    "fullName": "Nicolais Palacios Melgara",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 264
  },
  {
    "cif": "23021669",
    "fullName": "Nikoll Yaritza Martinez Bosquez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 265
  },
  {
    "cif": "23021419",
    "fullName": "Nora Lucía Báez Meza",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 266
  },
  {
    "cif": "22021208",
    "fullName": "Novis Emanuel Rosales Blandón",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 267
  },
  {
    "cif": "22020050",
    "fullName": "Noxtli Daraly Meneses Garcia",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 268
  },
  {
    "cif": "22020848",
    "fullName": "Oliva Barahona Erick Daniel",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 269
  },
  {
    "cif": "23011093",
    "fullName": "Omar Eli Morales Lopez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 270
  },
  {
    "cif": "24010760",
    "fullName": "Onell Corea Gutiérrez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 271
  },
  {
    "cif": "22020833",
    "fullName": "Paola Mercedes Bendaña Carrillo",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 272
  },
  {
    "cif": "25012763",
    "fullName": "Pedro Xavier Reyes González",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 273
  },
  {
    "cif": "SIN-CIF-274",
    "fullName": "Rashell Rebeca Dávila Rodríguez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 274
  },
  {
    "cif": "23021392",
    "fullName": "Regina Ninoska Vega Solís",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 275
  },
  {
    "cif": "25011898",
    "fullName": "Renata Yamileth Lorio Sanchez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 276
  },
  {
    "cif": "24010574",
    "fullName": "Ricardo José Baldizón López",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 277
  },
  {
    "cif": "22020426",
    "fullName": "Ricardo Noel Marin Amador",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 278
  },
  {
    "cif": "23010155",
    "fullName": "Rigoberto De Jesus Gutierrez Canales",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 279
  },
  {
    "cif": "22021162",
    "fullName": "Roberto Carlos Morales Artiles",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 280
  },
  {
    "cif": "22021151",
    "fullName": "Rodrigo Lafuente Zapata",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 281
  },
  {
    "cif": "24013996",
    "fullName": "Róger Alejandro Téllez Quedo",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 282
  },
  {
    "cif": "23010013",
    "fullName": "Roger Jesús Mercado Alonso",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 283
  },
  {
    "cif": "24010746",
    "fullName": "Ronald Antonio Rodríguez Moncada",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 284
  },
  {
    "cif": "23020129",
    "fullName": "Ronald Heberto Silva Rubio",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 285
  },
  {
    "cif": "23010010",
    "fullName": "Ronald Jose Pio Miranda Vega",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 286
  },
  {
    "cif": "23021134",
    "fullName": "Rosslyn Gabriela Grande Torres",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 287
  },
  {
    "cif": "22020405",
    "fullName": "Roxana Guadalupe Chavez Reyes",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 288
  },
  {
    "cif": "24012296",
    "fullName": "Sair Antonio Lara García",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 289
  },
  {
    "cif": "24011400",
    "fullName": "Samantha Auxiliadora Zamora Valle",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 290
  },
  {
    "cif": "24011795",
    "fullName": "Samira Ivett Zelaya Rivas",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 291
  },
  {
    "cif": "26010109",
    "fullName": "Sandra Guadalupe Nuñez Pacheco",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 292
  },
  {
    "cif": "22011555",
    "fullName": "Saraí Johanna Ruiz Cerna",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 293
  },
  {
    "cif": "19011598",
    "fullName": "Saymond Mijail Montoya Blandon",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 294
  },
  {
    "cif": "24013416",
    "fullName": "Séfora Daniela Zelaya Téllez",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 295
  },
  {
    "cif": "23020826",
    "fullName": "Sherlyn Alexandra Bravo Marenco",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 296
  },
  {
    "cif": "25010024",
    "fullName": "Sidnya Pérez Díaz",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 297
  },
  {
    "cif": "25015849",
    "fullName": "Silvia Mercedes Peréz",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 298
  },
  {
    "cif": "24011114",
    "fullName": "Solki Shayne Slate Hunter",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 299
  },
  {
    "cif": "23020892",
    "fullName": "Sonia Camila Orozco Sevilla",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 300
  },
  {
    "cif": "22020239",
    "fullName": "Stephane Danae Palma Muñoz",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 301
  },
  {
    "cif": "23010827",
    "fullName": "Thamary Alejandra Reyes Reyes",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 302
  },
  {
    "cif": "24011222",
    "fullName": "Tiffany Roxandra Martínez Alvarez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 303
  },
  {
    "cif": "24013312",
    "fullName": "Tzu Chun Chen",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 304
  },
  {
    "cif": "25010819",
    "fullName": "Valeria Alejandra Ortíz González",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 305
  },
  {
    "cif": "23020900",
    "fullName": "Victor Anthony Rostran Mungia",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 306
  },
  {
    "cif": "24012157",
    "fullName": "Víctor Marcel Alemán Altamirano",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 307
  },
  {
    "cif": "19014895",
    "fullName": "Walter Javier Samuel Casaya Arana",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 308
  },
  {
    "cif": "23021594",
    "fullName": "Wendy Nazareth Tijerino Morales",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 309
  },
  {
    "cif": "25014102",
    "fullName": "Wilfredo Sebastián Ruíz Knight",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 310
  },
  {
    "cif": "24010844",
    "fullName": "Wiston Jafeth Meza Mayorga",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 311
  },
  {
    "cif": "23011302",
    "fullName": "Yahir Esteban Mercado",
    "career": "Ingeniería Civil",
    "checkedIn": false,
    "sheetRow": 312
  },
  {
    "cif": "22021071",
    "fullName": "Yalta Georgina Alegria Loaisiga",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 313
  },
  {
    "cif": "22020592",
    "fullName": "Yesli Massiel Morales Velásquez",
    "career": "Arquitectura",
    "checkedIn": false,
    "sheetRow": 314
  },
  {
    "cif": "23021510",
    "fullName": "Yonier Enrique Gonzalez Vargas",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 315
  },
  {
    "cif": "23021568",
    "fullName": "Yuliana Michell Velásquez Vallecillo",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 316
  },
  {
    "cif": "24010570",
    "fullName": "Zamira De Los Ángeles Toruño Núñez",
    "career": "Ingeniería Industrial",
    "checkedIn": false,
    "sheetRow": 317
  }
];

export const DEFAULT_COMPANIES = [
  "PANELCONSA",
  "CONCRENIC",
  "INGENIEROS CONSULTORES CENTROAMERICANOS (I.C.C)",
  "PLYCEM NICARAGUA",
  "IGENIERIA DE MATERIALES Y PAVIMENTOS",
  "MECO",
  "SIKA NICARAGUA",
  "FETESA",
  "EL MUNDO DEL CONCRETO",
  "PINTURA SUR",
  "STEEL MAX",
  "FERRETERIA NOELITO",
  "GRUPO EMPRESARIAL 360",
  "SANJONIA STATE COFFEE S.A.",
  "DELIZ FOOD",
  "SUMINISTROS ELECTRICOS GUTIERREZ",
  "COMPAÑIA DISTRIBUIDORA DE NICARAGUA (CDN)",
  "IBW",
  "LA CASA DEL PERNO",
  "FUENTE PURA"
];
