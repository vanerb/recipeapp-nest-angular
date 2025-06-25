export interface Users {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
    token: string;
}

export interface UpdateUser {
    id: string;
}