import { Entity, User } from ".";

export interface Topic extends Entity {
    groupId: number,
    author: User,
    summary: string,
    description: string,
    pinned: boolean,
    ideaContributionInstructions?: string
}

export interface TopicValues {
    summary: string
    description: string
    pinned: boolean
    ideaContributionInstructions: string
}

export interface TopicCard {
    model: Topic
    ideaCount: number
}

export interface TopicCardWithEditability extends TopicCard {
    isPinnable: boolean,
    isEditable: boolean,
    isDeleteable: boolean
}