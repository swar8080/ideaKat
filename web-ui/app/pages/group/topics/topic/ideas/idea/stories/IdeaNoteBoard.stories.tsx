import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {loremIpsumSentence} from '../../../../../../../../testutils/loremipsum';
import { IdeaColour, IdeaTag, IdeaWithEditability } from '../../../../../../../model/idea';
import IdeaNoteBoard from '../../IdeaNoteBoard';

let nextId = 0;
const ideaWith: (description: string, colour: IdeaColour, summary: string, tags: IdeaTag[]) => IdeaWithEditability = (description, colour, summary, tags = []) => {
    return {
        id: nextId++,
        topicId: 2,
        description,
        summary,
        colour,
        tags,
        author: {
            id: 3,
            name: "author name",
            email: "user@email.com",
            createDate: "abc"
        },
        createDate: "abc",

        isEditable: true
    }
}

const randomTags = (numTags: number): IdeaTag[] => {
    const tags: IdeaTag[] = []
    for (let i = 0; i < numTags; i++){
        tags.push({
            label: loremIpsumSentence(1),
        });
    }
    return tags;
} 

storiesOf('IdeaNoteBoard', module)
    .add("Notes", () => {
            const ideas = [
                ideaWith(loremIpsumSentence(0), IdeaColour.YELLOW, loremIpsumSentence(5), randomTags(1)), 
                ideaWith(loremIpsumSentence(5), IdeaColour.YELLOW, loremIpsumSentence(5), randomTags(2)), 
                ideaWith(loremIpsumSentence(15), IdeaColour.BLUE, loremIpsumSentence(5), randomTags(3)), 
                ideaWith(loremIpsumSentence(50), IdeaColour.GREEN, loremIpsumSentence(5), randomTags(4)),
                ideaWith(loremIpsumSentence(100), IdeaColour.BLUE, loremIpsumSentence(5), randomTags(5)),
                ideaWith(loremIpsumSentence(23), IdeaColour.GREEN, loremIpsumSentence(5), []),
                ideaWith(loremIpsumSentence(4), IdeaColour.ORANGE, loremIpsumSentence(5), []),
                ideaWith(loremIpsumSentence(10), IdeaColour.ORANGE, loremIpsumSentence(5), []),
                ideaWith(loremIpsumSentence(44), IdeaColour.YELLOW, loremIpsumSentence(5), [])
            ]

            return (
                <IdeaNoteBoard ideas={ideas} isFilteringOnTag={() => false}/>
            );
    });