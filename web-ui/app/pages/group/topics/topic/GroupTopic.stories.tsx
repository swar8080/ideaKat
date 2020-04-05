import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {loremIpsumSentence} from '../../../../../testutils/loremipsum';
import GroupTopic from './GroupTopic';
// import { DisplayedTopic } from '../GroupTopicsList';
// import { DISPLAYED_TOPIC } from '../../../../../testutils/fixtures/topic';

// const gt = (summaryLength: number, descriptionLength: number, pinned: boolean, isPinnable: boolean, isEditable: boolean, ideaCount: number) => {
//     return (
//         <GroupTopic 
//             topic={{
//                 ...DISPLAYED_TOPIC,
//                 summary: loremIpsumSentence(summaryLength),
//                 description: loremIpsumSentence(descriptionLength),
//                 pinned,
//                 isPinnable,
//                 isEditable,
//                 ideaCount
//             }}
//             onClickEditTopic={(topicId: number) => {}}
//             onClickPinnedIcon={() => {}}
//         />
//     );
// }

// storiesOf('GroupTopic', module)
//     .add("Varying summary lengths", () => {
//         return (
//             <>
//               {gt(2, 1, true, true, true, 10)}
//               {gt(10, 100, true, true, true, 10)}
//               {gt(20, 100, false, true, true, 10)}
//               {gt(30, 100, true, true, true, 10)}
//             </>
//         )
//     })
//     .add("Pinned and unpinned", () => {
//         return (
//             <>
//               {gt(20, 100, true, true, false, 10)}
//               {gt(20, 100, false, true, false, 10)}
//               {gt(20, 100, true, false, false, 10)}
//               {gt(20, 100, false, false, false, 10)}
//             </>
//         )
//     })
//     .add("Editable and uneditable", () => {
//         return (
//             <>
//               {gt(20, 100, false, false, true, 10)}
//               {gt(20, 100, false, false, false, 10)}
//             </>
//         )
//     })
//     .add("Full options", () => {
//         return (
//             <>
//               {gt(20, 100, true, true, true, 10)}
//             </>
//         )
//     })
//     .add("Idea Count", () => {
//         return (
//             <>
//               {gt(20, 100, true, true, true, 10)}
//               {gt(20, 100, true, true, true, 0)}
//               {gt(20, 100, true, true, true, 100)}
//             </>
//         )
//     })

