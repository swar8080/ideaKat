import { User, Entity } from ".";

export interface Idea extends Entity {
    topicId: number,
    author: User,
    summary: string,
    description: string,
    colour: IdeaColour,
    tags: IdeaTag[] 
}

export interface IdeaTag {
    label: string
}

export enum IdeaColour {
    YELLOW = "Yellow",
    BLUE = "Blue",
    ORANGE = "Orange",
    GREEN = "Green"
}

export const IdeaColourValues = {
    [IdeaColour.YELLOW]: "#ffc",
    [IdeaColour.BLUE]: "#9cfeff",
    [IdeaColour.ORANGE]: "#ffcf9c",
    [IdeaColour.GREEN]: "#cdff9c"
}

export interface IdeaWithEditability extends Idea {
    isEditable: boolean
}

export interface IdeaValues {
    summary: string,
    description: string,
    colour: IdeaColour,
    tags: IdeaTag[] 
}

export interface IdeaComment extends Entity {
    topicId: number
    ideaId: number,
    author: User,
    comment: string
}

export interface IdeaSearch {
    topicId: number,
    searchString?: string,
    colour?: IdeaColour,
    isUsersIdeas?: boolean,
    tags?: IdeaTag[]
}