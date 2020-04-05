import { Entity } from ".";

export interface Group extends Entity {
    groupName: string
    description: string,
    imageUrl?: string
}