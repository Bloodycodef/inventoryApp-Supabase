export interface Profile {
  username: string;
  role: "admin" | "staf-gudang" | "staf-kasir";
  branch_name: string;
  email?: string;
}
