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
  { cif: "20210001", fullName: "Carlos Eduardo Mendoza López", career: "Ingeniería Industrial", checkedIn: false, sheetRow: 2 },
  { cif: "20210002", fullName: "María Fernanda Rivas Solís", career: "Arquitectura", checkedIn: false, sheetRow: 3 },
  { cif: "20210003", fullName: "José Alejandro Pérez Morales", career: "Ingeniería Civil", checkedIn: false, sheetRow: 4 },
  { cif: "20220004", fullName: "Sofía Valentina Castro Blandón", career: "Arquitectura", checkedIn: false, sheetRow: 5 },
  { cif: "20220005", fullName: "Luis Enrique Gutiérrez Ortiz", career: "Ingeniería Industrial", checkedIn: false, sheetRow: 6 },
  { cif: "20220006", fullName: "Andrea Nicole Martínez Ruiz", career: "Ingeniería Civil", checkedIn: false, sheetRow: 7 },
  { cif: "20230007", fullName: "Diego Armando Zeledón Navarro", career: "Ingeniería Industrial", checkedIn: false, sheetRow: 8 },
  { cif: "20230008", fullName: "Valeria Isabel Chávez Duarte", career: "Arquitectura", checkedIn: false, sheetRow: 9 },
  { cif: "20240009", fullName: "Gabriel Antonio Herrera Ramírez", career: "Ingeniería Civil", checkedIn: false, sheetRow: 10 },
  { cif: "20240010", fullName: "Camila Lucía Bermúdez Silva", career: "Arquitectura", checkedIn: false, sheetRow: 11 },
];

export const DEFAULT_COMPANIES = [
  "Empresa Prueba 01 - Constructora Nicaragüense",
  "Empresa Prueba 02 - Cementos del Pacífico",
  "Empresa Prueba 03 - Aceros y Perfiles S.A.",
  "Empresa Prueba 04 - Estudio Arquitectura UAM",
  "Empresa Prueba 05 - Ingeniería Estructural Centroamérica",
  "Empresa Prueba 06 - Grupo Ferretero Nacional",
  "Empresa Prueba 07 - Soluciones Eléctricas NIC",
  "Empresa Prueba 08 - Tecnología BIM Nicaragua",
  "Empresa Prueba 09 - Topografía y Geotecnia S.A.",
  "Empresa Prueba 10 - Logística Industrial S.A.",
  "Empresa Prueba 11 - Materiales Sostenibles FIA",
  "Empresa Prueba 12 - Diseños Urbanos Managua",
  "Empresa Prueba 13 - Energía Solar Nicaragua",
  "Empresa Prueba 14 - Automatización Industrial S.A.",
  "Empresa Prueba 15 - Pinturas y Recubrimientos NIC",
  "Empresa Prueba 16 - Consultora Ambiental Centroamérica",
  "Empresa Prueba 17 - Concretos Premezclados S.A.",
  "Empresa Prueba 18 - Banco Aliado Universitario",
  "Empresa Prueba 19 - Telecomunicaciones Empresariales",
  "Empresa Prueba 20 - Maquinaria Pesada del Sur",
  "Empresa Prueba 21 - Vidrios y Aluminios Modernos",
  "Empresa Prueba 22 - Software CAD y Simulación",
  "Empresa Prueba 23 - Innovación Constructiva S.A.",
];

