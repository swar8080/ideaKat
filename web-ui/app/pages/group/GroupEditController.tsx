/**
 * @prettier
 */

import * as React from "react";
import { Group } from "../../model/group";
import GroupRepository from "../../repository/GroupRepository";
import useTabTitle from "../../routing/useTabTitle";
import { GroupEditForm } from "./GroupForms";
import { GroupEditValues } from "./model";

interface GroupEditControllerProps {
    groupId: number;
}

const GroupEditController: React.FC<GroupEditControllerProps> = ({ groupId }) => {
    const [group, setGroup] = React.useState<Group>();
    const [errorMessage, setErrorMessage] = React.useState<string>();
    useTabTitle("Edit Group");

    React.useEffect(() => {
        GroupRepository.getById(groupId).then(g => setGroup(g));
    }, []);

    const handleFormSubmit = async (values: GroupEditValues) => {
        try {
            const response = await GroupRepository.editGroup(groupId, values);
            if (response.successful) {
                window.location.reload();
            } else if (response.hasErrors) {
                return response.errors;
            } else {
                setErrorMessage(response.responseMessage);
            }
        } catch (error) {
            setErrorMessage("Error editing group");
        }
    };

    if (!group) {
        return null;
    }

    return (
        <div className="ideakat-form">
            <div className="ideakat-form-header">Edit Group</div>
            <GroupEditForm
                initialValues={{
                    groupName: group.groupName,
                    description: group.description
                }}
                initialGroupImageUrl={group.imageUrl}
                handleSubmit={handleFormSubmit}
            />
            <div className="ideakat-form-error-message">{errorMessage}</div>
        </div>
    );
};

export default GroupEditController;
