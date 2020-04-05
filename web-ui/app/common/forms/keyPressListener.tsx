import {KeyboardEvent} from 'react';

export function onKeyPressed(event: KeyboardEvent, keyName: string, ifPressed: () => void){
    if (event.key === keyName){
        ifPressed();
    }
}

export function onEnterKeyPressed(event: KeyboardEvent, ifPressed: () => void){
    onKeyPressed(event, "Enter", ifPressed);
}