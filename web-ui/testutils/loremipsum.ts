import {LoremIpsum} from 'lorem-ipsum';

const lorem = new LoremIpsum();

export const loremIpsumSentence = (length: number): string => {
    return lorem.generateWords(length);
}