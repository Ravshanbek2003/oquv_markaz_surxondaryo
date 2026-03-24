export interface UserData {
  id: number;
  full_name: string;
  phone_number: string;
  groups: string[];
  courses: string[];
  teachers: string[];
  breanch: string;
  balance: string;
}

export const STUDENTS: UserData[] = [
  {
    id: 1,
    full_name: "To'xtoshov Sardor",
    phone_number: "(94) 030 29 84",
    groups: ["New elementary"],
    courses: ["IT Bootcamp"],
    teachers: ["Shamsiddin"],
    breanch: "Termzi",
    balance: "1500000",
  },
  {
    id: 2,
    full_name: "Shoraximov Shamsiddin",
    phone_number: "(99) 436 89 42",
    groups: ["Prezidnet maktabiga...", "IT Bootcamp"],
    courses: ["Prezidnet maktabiga...", "IT Bootcamp"],
    teachers: ["Muhammad", "Nafisa"],
    breanch: "Termzi",
    balance: "1500000",
  },
  {
    id: 3,
    full_name: "Botir Umarov",
    phone_number: "(99) 436 89 42",
    groups: ["New elementary"],
    courses: ["IT English"],
    teachers: ["Mirmuxsinbek"],
    breanch: "Termzi",
    balance: "1500000",
  },
  {
    id: 4,
    full_name: "Sherali Sheraliyev",
    phone_number: "(99) 436 89 42",
    groups: ["New elementary"],
    courses: ["IT English"],
    teachers: ["Xojiatdoston"],
    breanch: "Termzi",
    balance: "1500000",
  },
  {
    id: 5,
    full_name: "Vaxob Vaxobov",
    phone_number: "(99) 436 89 42",
    groups: ["New elementary"],
    courses: ["IT English"],
    teachers: ["Umar"],
    breanch: "Termzi",
    balance: "1500000",
  },
  {
    id: 6,
    full_name: "Nozima Safaullayeva",
    phone_number: "(99) 436 89 42",
    groups: ["New elementary"],
    courses: ["IT English"],
    teachers: ["Nigina"],
    breanch: "Termzi",
    balance: "1500000",
  },
];
