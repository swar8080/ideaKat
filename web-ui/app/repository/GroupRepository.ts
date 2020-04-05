/**
 * @prettier
 */

import { Group } from "../model/group";
import { TopicCardWithEditability } from "../model/topic";
import { apiUrl } from "../routing/apiroutes";
import { getJsonResponse, postFormdataJsonResponse, muiltipartJson } from "./fetchUtil";
import { GroupCreationValue, GroupEditValues, GroupPageGroup } from "../pages/group/model";
import { APIResponse } from "./APIResponse";

interface GroupRepository {
    getById(groupId: number): Promise<Group | undefined>;
    getGroupsOrderedByActivityCount(): Promise<GroupPageGroup[]>;
    getGroupTopics(groupId: number): Promise<TopicCardWithEditability[] | undefined>;
    createGroup(values: GroupCreationValue): Promise<APIResponse<number, GroupCreationValue>>;
    editGroup(groupId: number, values: GroupEditValues): Promise<APIResponse<void, GroupCreationValue>>
}

const GroupRepository: GroupRepository = {
    getById(groupId: number): Promise<Group | undefined> {
        return getJsonResponse(apiUrl(`/group/${groupId}`));
    },
    getGroupsOrderedByActivityCount() {
        return getJsonResponse(apiUrl(`group/byactivity`));
    },
    getGroupTopics(groupId: number): Promise<TopicCardWithEditability[] | undefined> {
        const formData = new FormData();
        formData.append("groupId", groupId.toString());

        return postFormdataJsonResponse(apiUrl(`/topic/bygroup`), formData);
    },
    createGroup(values: GroupCreationValue) {
      const formData = new FormData();
  
      formData.append("groupDetails", muiltipartJson({
        groupName: values.groupName,
        description: values.description
      }));
  
      formData.append("groupImage", values.groupImage);

      return postFormdataJsonResponse(apiUrl(`/group/create`), formData);
    },
    editGroup(groupId: number, values: GroupEditValues){
        const formData = new FormData();
        
        formData.append("editGroupDetails", muiltipartJson({
            groupId,
            values: {
                groupName: values.groupName,
                description: values.description
            },
            clearingGroupImage: values.clearingImage 
        }));
        formData.append("groupImage", values.groupImage);

        return postFormdataJsonResponse(apiUrl(`/group/edit`), formData);
    }
};

export default GroupRepository;
