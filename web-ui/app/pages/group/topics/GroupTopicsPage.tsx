import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import * as React from "react";
import { useEffect, useState } from "react";
import PageBottomControl from "../../../common/buttons/PageBottomControl";
import { Group } from "../../../model/group";
import { TopicCardWithEditability, TopicValues } from "../../../model/topic";
import GroupRepository from "../../../repository/GroupRepository";
import TopicRepository from "../../../repository/TopicRepository";
import GroupTopicsList from "./GroupTopicsList";
import "./GroupTopicsPage.scss";
import GroupTopicFormModal, { TopicFormSaveResult } from "./topic/GroupTopicFormModal";
import useTabTitle from "../../../routing/useTabTitle";
import DeleteConfirmationModal from "../../../common/modal/DeleteConfirmationModal";


interface IProps {
  group: Group;
}

interface EditTopicStatus {
  isEditingTopic: boolean;
  card?: TopicCardWithEditability;
}

interface DeleteTopicStatus {
    isRequestingDelete: boolean,
    topicId?: number
}

interface TopicsById {
  [topicId: number]: TopicCardWithEditability;
}

const GroupTopicsPage: React.FC<IProps> = ({ group }) => {
  const [isLoadingInitialTopics, setIsLoadingInitialTopics] = useState(true);
  const [topicsById, setTopicsById] = useState<TopicsById>({});
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [editTopicStatus, setEditTopicStatus] = useState<EditTopicStatus>({
    isEditingTopic: false
  });
  const [deleteTopicStatus, setDeleteTopicStatus] = useState<DeleteTopicStatus>({
      isRequestingDelete: false
  });
  useTabTitle(`${group.groupName} - Discussions`)

  useEffect(() => {
    GroupRepository.getGroupTopics(group.id).then(topics => {
      const newTopicsById: TopicsById = {};
      setTopicsById(
        topics.reduce((idMap, topic) => {
          idMap[topic.model.id] = topic;
          return idMap;
        }, newTopicsById)
      );
      setIsLoadingInitialTopics(false);
    });
  }, [group.id]);

  function createTopic(inputs: TopicValues): Promise<TopicFormSaveResult> {
    return TopicRepository.saveTopic(group, inputs).then(newTopic => {
      setTopicsById(prev => ({
        ...prev,
        [newTopic.model.id]: newTopic
      }));
      setIsCreatingTopic(false);
      return {
        successful: true
      };
    });
  }

  function onClickEditTopic(topicId: number) {
    const topicToEdit = topicsById[topicId];
    if (topicToEdit && topicToEdit.isEditable) {
      setEditTopicStatus({
        isEditingTopic: true,
        card: topicToEdit
      });
    }
  }

  function saveExistingTopic(newInputs: TopicValues): Promise<TopicFormSaveResult> {
    return TopicRepository.updateTopic(editTopicStatus.card.model.id, newInputs).then(
      updatedTopic => {
        setTopicsById(prev => ({
          ...prev,
          [editTopicStatus.card.model.id]: updatedTopic
        }));
        setEditTopicStatus({ isEditingTopic: false });
        return {
          successful: true
        };
      }
    );
  }

  function onTogglePinnedTopic(topicId: number) {
    const topic = topicsById[topicId];
    if (topic && topic.isPinnable) {
      const newValues: TopicValues = {
        pinned: !topic.model.pinned,
        summary: topic.model.summary,
        description: topic.model.description,
        ideaContributionInstructions: topic.model.ideaContributionInstructions
      };

      TopicRepository.updateTopic(topic.model.id, newValues).then(updatedTopic => {
        setTopicsById(prev => ({
          ...prev,
          [topicId]: updatedTopic
        }));
      });
    }
  }

  function onClickDeleteTopic(topicId: number) {
    setDeleteTopicStatus({
        isRequestingDelete: true,
        topicId
    })
  }

  function onConfirmDeleteTopic(){
    TopicRepository.deleteTopic(deleteTopicStatus.topicId).then(response => {
        if (response.successful) {
          setTopicsById(prev => {
            const ids = { ...prev };
            delete ids[deleteTopicStatus.topicId];
            return ids;
          });
          resetDeleteTopicStatus();
        }
      });
  }

  function resetDeleteTopicStatus(){
    setDeleteTopicStatus({
        isRequestingDelete: false,
        topicId: null
    });
  }

  const pinnedTopics: TopicCardWithEditability[] = Object.values(topicsById)
    .filter(topic => topic.model.pinned)
    .sort((topicA, topicB) => -topicA.model.createDate.localeCompare(topicB.model.createDate));

  const unpinnedTopics: TopicCardWithEditability[] = Object.values(topicsById)
    .filter(topic => !topic.model.pinned)
    .sort((topicA, topicB) => -topicA.model.createDate.localeCompare(topicB.model.createDate))
    .reverse();

  const showPinnedTopics = pinnedTopics.length > 0;
  const showOtherTopics = unpinnedTopics.length > 0;
  const hasTopics = showPinnedTopics || showOtherTopics;
  const isShowingCreateModal = isCreatingTopic || (!isLoadingInitialTopics && !hasTopics);
  return (
    <div className="groupTopicPage">
      {hasTopics && (
        <div className="groupTopicPage__topicLists">
          {showPinnedTopics && (
            <GroupTopicsList
              listHeading={"Pinned Discussions"}
              topics={pinnedTopics}
              onClickEditTopic={onClickEditTopic}
              onClickPinnedIcon={onTogglePinnedTopic}
              onClickDeleteTopic={onClickDeleteTopic}
            />
          )}
          {showOtherTopics && (
            <GroupTopicsList
              listHeading={"Other Discussions"}
              topics={unpinnedTopics}
              onClickEditTopic={onClickEditTopic}
              onClickPinnedIcon={onTogglePinnedTopic}
              onClickDeleteTopic={onClickDeleteTopic}
            />
          )}
        </div>
      )}
      {!isLoadingInitialTopics && <PageBottomControl
        className="groupTopicPage__controls"
        text="Create Discussion"
        icon={faPlusCircle}
        onButtonClick={() => setIsCreatingTopic(true)}
      />}
      {isShowingCreateModal && (
        <GroupTopicFormModal
          modalTitle="Create Discussion"
          onSave={createTopic}
          onClose={() => setIsCreatingTopic(false)}
          isCloseable={hasTopics}
          isOpen
          autoFocusedOnFirstInput
        />
      )}
      {editTopicStatus.isEditingTopic && (
        <GroupTopicFormModal
          modalTitle="Edit Discussion"
          inputs={{
            summary: editTopicStatus.card.model.summary,
            description: editTopicStatus.card.model.description,
            pinned: editTopicStatus.card.model.pinned,
            ideaContributionInstructions: editTopicStatus.card.model.ideaContributionInstructions
          }}
          onSave={saveExistingTopic}
          onClose={() =>
            setEditTopicStatus({
              isEditingTopic: false,
              card: undefined
            })
          }
          isCloseable
          isOpen
        />
      )}
      {deleteTopicStatus.isRequestingDelete &&
        <DeleteConfirmationModal
            message='Are you sure you want to delete this discussion?'
            modalTitle={'Delete Discussion'} 
            onConfirmDelete={onConfirmDeleteTopic}
            onCancelDelete={resetDeleteTopicStatus}
            isOpen
        />
      }
    </div>
  );
};

export default GroupTopicsPage;
