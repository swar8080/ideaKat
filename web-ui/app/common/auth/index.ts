import { User } from "../../model";

export interface AuthenticationStatus {
    isLoggedIn: boolean,
    isAdmin: false,
    user: User,
}