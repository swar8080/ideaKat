import * as React from 'react';
import { Group } from '../../../../../model/group';
import './TopicIdeasPage.scss';
import TopicRepository from '../../../../../repository/TopicRepository';
import IdeaRepository from '../../../../../repository/IdeaRepository';
import { IdeaWithEditability, IdeaValues, IdeaSearch, IdeaColour, IdeaColourValues, IdeaTag } from '../../../../../model/idea';
import { useState, useEffect } from 'react';
import IdeaNoteBoard from './IdeaNoteBoard';
import IdeaNoteFormModal from './idea/IdeaNoteFormModal';
import { TopicValues } from '../../../../../model/topic';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { IdeaValidation } from '../../../../../model/validation';
import ColourSelector from './idea/ColourSelector';
import IdeaNoteTag from './idea/tag/IdeaNoteTag';
import useTabTitle from '../../../../../routing/useTabTitle';

interface IProps {
    group: Group,
    topicId: number,
    isAddingIdea?: boolean
}

const TopicIdeasPage: React.FC<IProps> = ({group, topicId, ...props}) => {
    const [topic, setTopic] = useState<TopicValues>(undefined);
    const [ideasById, setIdeasById] = useState<Record<number, IdeaWithEditability>>({});
    const [isAddingIdea, setIsAddingIdea] = useState(props.isAddingIdea);
    const [editIdeaStatus, setEditIdeaStatus] = useState({
        idea: undefined
    });
    const [ideaSearchRequest, setIdeaSearchRequest] = useState<IdeaSearch>({topicId})
    const [ideaSearchState, setIdeaSearchState] = useState({
        query: "",
        dirty: false
    });
    const [tagFilterSelection, setTagFilterSelection] = useState<Record<string, boolean>>({});
    useTabTitle(topic? `ideaKat - ${topic.summary}` : null, [topic]);

    useEffect(() => {
        TopicRepository.getById(topicId)
            .then(topic => setTopic(topic))
    }, [topicId])

    useEffect(() => {
        if (ideaSearchRequest.topicId !== topicId){
            setIdeaSearchRequest(prev => ({
                ...prev,
                topicId
            }));
        }
    }, [topicId])

    useEffect(() => {
        IdeaRepository.searchForIdeas(ideaSearchRequest)
            .then(ideas => {
                const ideaMap: Record<number, IdeaWithEditability> = {};
                setIdeasById(ideas.reduce(
                    (ideaMap, idea) => {
                        ideaMap[idea.id] = idea;
                        return ideaMap;
                    }, ideaMap)
                )
            });
    }, [ideaSearchRequest])

    useEffect(() => {
        reloadTagFilterOptions();
    }, [topicId])

    function onSaveIdea(values: IdeaValues){
        return IdeaRepository.createIdea(topicId, values)
            .then(response => {
                if (response.successful){
                    setIsAddingIdea(false);
                    setIdeasById({
                        ...ideasById,
                        [response.data.id]: response.data 
                    });
                    reloadTagFilterOptions();
                    return response;
                }
            })
    }

    function onEditIdea(values: IdeaValues){
        return IdeaRepository.editIdea(editIdeaStatus.idea.id, values)
            .then(response => {
                setIdeasById({
                    ...ideasById,
                    [response.data.id]: response.data 
                });
                setEditIdeaStatus({
                    idea: undefined
                });
                reloadTagFilterOptions();
                return response;
            });
    }

    function reloadTagFilterOptions(){
        IdeaRepository.getTagsForTopic(topicId)
            .then(tags => {
                setTagFilterSelection(prev => {
                    const tagSelectionMap: Record<string, boolean> = {}
                    return tags.reduce((map, nextTag) => {
                        map[nextTag.label] = prev[nextTag.label] || false;
                        return map;
                    }, tagSelectionMap)
                })
            })
    }

    const isFilteringOnTag = React.useMemo(() => {
        const caseInsensitiveTags: Set<string> = Object.entries(tagFilterSelection).reduce((filteredLabels, entry) => {
            const [label, selected] = entry;
            if (selected){
                filteredLabels.add(label.toLowerCase());
            }
            return filteredLabels;
        }, new Set<string>());    

        return (tag: IdeaTag) => caseInsensitiveTags.has(tag.label.toLowerCase());
    }, [tagFilterSelection])

    function filterOnSearchString(){
        setIdeaSearchRequest(prev => ({
            ...prev,
            searchString: ideaSearchState.query
        }));
        setIdeaSearchState(prev => ({
            ...prev,
            dirty: false    
        }));
    }

    function onChangeSearchString(event: React.SyntheticEvent){
        const input = event.currentTarget as HTMLInputElement;
        setIdeaSearchState({
            query: input.value,
            dirty: true
        });
    }

    function onSearchKeyPress(event: React.KeyboardEvent){
        if (event.key === "Enter"){
            event.preventDefault();
            filterOnSearchString();
        }
    }

    function toggleShowingUsersIdeas(){
        setIdeaSearchRequest(prev => ({
            ...prev,
            isUsersIdeas: !prev.isUsersIdeas
        }));
    }
    
    function onClickColour(colour: IdeaColour){
        setIdeaSearchRequest(prev => ({
            ...prev,
            colour: prev.colour !== colour? colour : undefined
        }));
    }

    function clearFilters(){
        setIdeaSearchState({
            query: "",
            dirty: false
        });
        setTagFilterSelection(prev => {
            const tagSelectionMap: Record<string, boolean> = {}
            return Object.keys(prev).reduce((map, nextLabel) => {
                map[nextLabel] = false;
                return map;
            }, tagSelectionMap)
        });
        setIdeaSearchRequest({topicId});
    }
    
    const hasContributionInstructions: boolean = topic && !!topic.ideaContributionInstructions;
    const displayTagFilter: boolean = Object.keys(tagFilterSelection).length > 0;
    return (
        <>
            <div className='topicIdeasPage'>
                <div className='topicIdeasPage__header'>
                    <div className='topicIdeasPage__contributionInstructions'>
                        {topic && <div className='topicIdeasPage_topicSummary'>{topic.summary}</div>}
                        {hasContributionInstructions && 
                            <div className='topicIdeasPage__instructions'>{topic.ideaContributionInstructions}</div>
                        }
                    </div>
                </div>
                <div className='topicIdeasPage__ideaBoardContainer'>
                    <div className='topicIdeasPage__ideaBoardFilters'>
                        <div className='topicIdeasPage__filtersHeading'>Filters</div>
                        <div className='topicIdeasPage__filtersForm'>
                            <Form>
                                <Form.Group className='topicIdeasPage__formGroup'>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <Button onClick={filterOnSearchString} disabled={!ideaSearchState.dirty} title={'Search'} variant='outline-secondary'>
                                                <FontAwesomeIcon icon={faSearch}/>
                                            </Button>
                                        </InputGroup.Prepend>
                                        <Form.Control as='input'
                                            className='topicIdeasPage__searchTermInput'
                                            value={ideaSearchState.query}
                                            onChange={onChangeSearchString}
                                            maxLength={IdeaValidation.SEARCH_STRING_MAX_LEN}
                                            onKeyPress={onSearchKeyPress}
                                        />                                    
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className='topicIdeasPage__formGroup topicIdeasPage__formColourGroup'>
                                    <ColourSelector
                                        selectedColour={ideaSearchRequest.colour}
                                        onClickColour={onClickColour}
                                        className='topicIdeasPage__colourFilter'
                                    />
                                </Form.Group>
                                {displayTagFilter && 
                                <Form.Group className='topicIdeasPage__formGroup'>
                                    <div className='topicIdeasPage__tagFilters'>
                                    {Object.keys(tagFilterSelection)
                                        .sort((label1, label2) => label1.localeCompare(label2))
                                        .map(label => {
                                        return (
                                            <IdeaNoteTag
                                                tag={{label}}
                                                selected={tagFilterSelection[label]}
                                                key={label}
                                                onClick={() => {
                                                    if (tagFilterSelection[label]){
                                                        setIdeaSearchRequest(prev => ({
                                                            ...prev,
                                                            tags: prev.tags.filter(tag => tag.label !== label)
                                                        }));
                                                    }
                                                    else {
                                                        setIdeaSearchRequest(prev => ({
                                                            ...prev,
                                                            tags: (prev.tags || []).concat({label})
                                                        }));
                                                    }

                                                    setTagFilterSelection(prev => ({
                                                        ...prev,
                                                        [label]: !prev[label]
                                                    }))
                                                }}
                                            />
                                        )
                                    })}
                                    </div>
                                </Form.Group>}
                                <Form.Group className='topicIdeasPage__formGroup' onClick={toggleShowingUsersIdeas}>
                                    <Form.Check
                                        label='Only Show My Ideas'
                                        checked={!!ideaSearchRequest.isUsersIdeas}
                                        readOnly
                                        custom
                                    />
                                </Form.Group>
                                <Form.Group className='topicIdeasPage__formGroup topicIdeasPage__filterControls'>
                                    <Button className="topicIdeasPage__resetFilters" 
                                        onClick={clearFilters} 
                                        variant='outline-secondary'>
                                        Reset
                                    </Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <div className='topicIdeasPage__ideaBoard'>
                        <IdeaNoteBoard 
                            ideas={Object.values(ideasById)} 
                            onClickAddIdea={() => setIsAddingIdea(true)}
                            onClickEditIdea={idea => setEditIdeaStatus({idea})} 
                            addIdeaColour={ideaSearchRequest.colour || IdeaColour.YELLOW}
                            isFilteringOnTag={isFilteringOnTag}
                        />
                    </div>
                </div>
            </div>
            {isAddingIdea && <IdeaNoteFormModal 
                isOpen={topic && isAddingIdea} 
                onClose={() => setIsAddingIdea(false)}
                onSubmit={onSaveIdea}
                values={{
                    summary: "",
                    description: "",
                    colour: ideaSearchRequest.colour || IdeaColour.YELLOW,
                    tags: []
                }}
                autoFocusOnFirstInput
            />}
            {!!editIdeaStatus.idea && <IdeaNoteFormModal
                isOpen={!!editIdeaStatus.idea}
                onClose={() => setEditIdeaStatus({idea: undefined})}
                values={editIdeaStatus.idea}
                onSubmit={onEditIdea}
            />}
        </>
    );
};

TopicIdeasPage.defaultProps = {
    isAddingIdea: false
}

export default TopicIdeasPage;