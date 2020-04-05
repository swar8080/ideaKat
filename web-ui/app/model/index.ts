export interface Entity {
    id?: number,
    createDate: string
}

export interface User extends Entity {
    name: string,
    email: string,
    imageUrl?: string
}