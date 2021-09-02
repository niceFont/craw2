
export interface User {
    _id: string,
    username: string,
    lastX: number,
    lastY: number,
    color: string,
    thickness: number,
    shouldConnect: boolean
}
export interface Users {
  [key : string] : User
}

export interface LocalUser extends User {
    token: string
}
