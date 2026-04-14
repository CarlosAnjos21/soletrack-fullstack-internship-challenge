export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
}

export interface User {
  id:        string;
  name:      string;
  email:     string;
  role:      "ADMIN" | "OPERATOR";
  createdAt?: string;
}