/**
 * @prettier
 */

import { Group } from "../model/group";
import { TopicValues, TopicCardWithEditability } from "../model/topic";
import { apiUrl } from "../routing/apiroutes";
import { APIResponse } from "./APIResponse";
import {
  getJsonResponse,
  postJsonWithJsonResponse,
  deleteWithFormdataAndJsonResponse
} from "./fetchUtil";

interface TopicRepository {
  getById: (topicId: number) => Promise<TopicValues>;
  saveTopic: (group: Group, values: TopicValues) => Promise<TopicCardWithEditability>;
  updateTopic: (topicId: Number, newValues: TopicValues) => Promise<TopicCardWithEditability>;
  deleteTopic: (topicId: number) => Promise<APIResponse<void, void>>;
}

const TopicRepositoryImpl: TopicRepository = {
  getById: (topicId: number) => {
    return getJsonResponse(apiUrl(`/topic/${topicId}`));
  },
  saveTopic: (group: Group, values: TopicValues) => {
    const body = {
      groupId: group.id,
      values
    };

    return postJsonWithJsonResponse(apiUrl("/topic/create"), body);
  },
  updateTopic: (topicId: number, values: TopicValues) => {
    const body = {
      topicId,
      values
    };

    return postJsonWithJsonResponse(apiUrl("/topic/update"), body);
  },
  deleteTopic: (topicId: number) => {
    const formData = new FormData();
    formData.append("topicId", topicId.toString());

    return deleteWithFormdataAndJsonResponse(apiUrl("/topic/delete"), formData);
  }
};

export default TopicRepositoryImpl;
