
export const URL = "http://localhost:5000/";
// export const URL = "https://courses-at-brown-plus-plus.herokuapp.com/";

export const AXIOS_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
  }
};

export const AVAILABLE_CONCENTRATIONS = [ 
"AFRI", "AMST", "ANTH", "APMA", "ARAB", "ARCH", "ASYR", "BIOL", "CHEM", "CHIN", "CLAS", "CLPS", "COLT", 
"COST", "CSCI", "DATA", "EAST", "ECON", "EDUC", "EEPS", "ENGL", "ENGN", "ENVS", "ETHN", "FREN", "GNSS",
"GREK", "GRMN", "HIAA", "HISP", "HIST", "IAPA", "ITAL", "JAPN", "JUDS", "KREA", "LACA", "LATN", "LITR", 
"MATH", "MCM", "MUSC", "NEUR", "PHIL", "PHP", "PHYS", "POBS", "POLS", "RELS", "RUSS", "SANS", "SAST", 
"SIGN", "SOC", "TAPS", "VISA"
];

export const RECOMMENDED_COURSES = [
  {
    title: "VISA 0160 Foundation Painting", 
    description: "[Course description from C@B]", 
    link: "#"
  }, 
  {
    title: "CSCI 1270 Database Management Systems", 
    description: "[Course description from C@B]", 
    link: "#"
  }, 
  {
    title: "VISA 0150 Digital 2D Foundation", 
    description: "[Course description from C@B]", 
    link: "#"
  }
];

export const PRIORITY_OPTIONS = [
  "Low time commitment", 
  "Low difficulty",
  "High enjoyment", 
  "Suitability for non-concentrators", 
  "Small class size",
  "Fair grading"
];

export const COURSE_CODES = [
  "CS19", 
  "CS30", 
  "CS32", 
  "MATH0520", 
  "MATH0540"
];

export const PATHWAY_DATA = {
  "CSCI": {
    'CS15': ['CS16'], 
    'CS16': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420'], 
    'CS17': ['CS18'], 
    'CS18': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420'], 
    'CS19': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420', 'CS18'], 
    'MATH0520': ['CS1420'], 
    'MATH0540': ['CS1420'], 
    'CS30': ['CS1951A'],
    'CS32': ['CS1951A'], 
    'CS22': ['CS1010'], 
    'CS171': [], 
    'CS1010': [], 
    'CS1420': [],
    'CS1951A': []
  },
  "VISA": {
    'VISA 0100': ['VISA 1110', 'VISA 1160', 'VISA 1310'], 
    'VISA 0120': ['VISA 1310'], 
    'VISA 0130': [], 
    'VISA 0140': [], 
    'VISA 0150': [], 
    'VISA 0160': ['VISA 1310'], 
    'VISA 1110': [], 
    'VISA 1160': [], 
    'VISA 1310': ['VISA 1320'], 
    'VISA 1320': []
  }
}

export const COLORS = {
  'courseTaken': '#6c6',
  'courseAvailable': '#cfc'
}

