import * as React from 'react';
import { storiesOf } from '@storybook/react';
import TagListEditor, {removeEqualTag} from '../tag/TagListEditor';
import { IdeaTag } from '../../../../../../../model/idea';
import { useState } from 'react';


storiesOf('TagSelector', module)
    .add("Tags", () => {
        return <TagDemo/>
    });

const TagDemo = () => {
    const [tags, setTags] = useState<IdeaTag[]>([{label:"tag1"}, {label:"tag2"}]);

    return <TagListEditor
        tags={tags} 
        onRemoveTag={tag => setTags(removeEqualTag(tags, tag))}
        onAddTag={tag => setTags(tags.concat(tag))}
    />
}