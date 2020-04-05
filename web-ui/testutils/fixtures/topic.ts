import { Topic, TopicCardWithEditability } from "../../app/model/topic";

export const TOPIC: Topic = {
    id: 1,
    groupId: 1,
    author: {
        id: 1,
        name: "user1",
        email: "user1@email.com",
        createDate: "abc",
        imageUrl: "https://i.stack.imgur.com/34AD2.jpg"
    },
    summary: "nec nam aliquam sem et tortor consequat id porta nibh venenatis cras sed felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque volutpat ac",
    description: "Description 1",
    pinned: false,
    createDate: "123",
    ideaContributionInstructions: "ideaContributionInstructions"
}

export const DISPLAYED_TOPIC: TopicCardWithEditability = {
    model: TOPIC,
    isPinnable: false,
    isEditable: false,
    isDeleteable: false,
    ideaCount: 10,
}