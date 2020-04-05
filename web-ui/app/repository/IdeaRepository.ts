/**
 * @prettier
 */

import { apiUrl } from "../routing/apiroutes";
import { IdeaSearch, IdeaTag, IdeaValues, IdeaWithEditability } from "../model/idea";
import { APIResponse } from "./APIResponse";
import { postFormdataJsonResponse, postJsonWithJsonResponse } from "./fetchUtil";

interface IdeaRepository {
  getIdeasForTopic: (topicId: number) => Promise<IdeaWithEditability[]>;
  searchForIdeas: (searchRequest: IdeaSearch) => Promise<IdeaWithEditability[]>;
  createIdea: (
    topicId: number,
    values: IdeaValues
  ) => Promise<APIResponse<IdeaWithEditability, any>>;
  editIdea: (ideaId: number, values: IdeaValues) => Promise<APIResponse<IdeaWithEditability, any>>;
  getTagsForTopic: (topicId: number) => Promise<IdeaTag[]>;
}

const IdeaRepositoryImpl: IdeaRepository = {
  getIdeasForTopic: (topicId: number) => {
    const formData = new FormData();
    formData.append("topicId", topicId.toString());

    return postFormdataJsonResponse(apiUrl(`/idea/bytopic`), formData);
  },
  searchForIdeas: (searchRequest: IdeaSearch) => {
    return postJsonWithJsonResponse(apiUrl(`/idea/search`), searchRequest);
  },
  createIdea: (topicId: number, values: IdeaValues) => {
    const body = {
      topicId: topicId.toString(),
      values
    };

    return postJsonWithJsonResponse(apiUrl(`/idea/create`), body);
  },
  editIdea: (ideaId: number, values: IdeaValues) => {
    const body = {
      ideaId: ideaId.toString(),
      values
    };

    return postJsonWithJsonResponse(apiUrl(`/idea/edit`), body);
  },
  getTagsForTopic: (topicId: number) => {
    const formData = new FormData();
    formData.append("topicId", topicId.toString());

    return postFormdataJsonResponse(apiUrl(`/idea/tagsForTopic`), formData);
  }
};

export default IdeaRepositoryImpl;
