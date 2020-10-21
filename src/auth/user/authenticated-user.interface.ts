import { UserProperties } from "./user-properties.interface";

export interface AuthenticatedUser extends UserProperties {
    token: string;
}
