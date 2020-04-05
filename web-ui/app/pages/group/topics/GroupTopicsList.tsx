import * as React from 'react';
import { Topic, TopicCardWithEditability } from '../../../model/topic';
import GroupTopic from './topic/GroupTopic';
import './GroupTopicsList.scss';

export interface TopicWithEditability extends Topic {
    isPinnable: boolean,
    isEditable: boolean,
    ideaCount: number
}

interface IProps {
    topics: TopicCardWithEditability[],
    listHeading: string,
    onClickEditTopic: (topicId: number) => void,
    onClickPinnedIcon: (topicId: number) => void,
    onClickDeleteTopic: (topicId: number) => void
}

const GroupTopicsList: React.FC<IProps> = ({topics, listHeading, onClickEditTopic, onClickPinnedIcon, onClickDeleteTopic}) => {
    return (
        <div className="groupTopicList">
            <div className="groupTopicList__heading">{listHeading}</div>
            <div className='groupTopicList__topics'>
                {topics.map(displayedTopic => (
                    <div className="groupTopicList__topic" key={displayedTopic.model.id}>
                        <GroupTopic 
                            topic={displayedTopic} 
                            onClickEditTopic={onClickEditTopic}
                            onClickPinnedIcon={onClickPinnedIcon}
                            onClickDelete={onClickDeleteTopic}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupTopicsList;