// export interface Roles{
//     subscriber?: boolean;
//     editor?: boolean;
//     admin?: boolean;
// }

export interface User{
    uid: string;
    email: string;
    name?: string;
    phone?: string;
    thumbnail?: string;
    employee_number?: string;
    role : string;
}