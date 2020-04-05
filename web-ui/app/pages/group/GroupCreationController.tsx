/**
 * @prettier
 */

import * as React from "react";
import { GroupCreationForm } from "./GroupForms";
import "../../style/ideakat-form.scss";
import { GroupCreationValue } from "./model";
import GroupRepository from "../../repository/GroupRepository";
import { APIResponse } from "../../repository/APIResponse";
import { makeGroupTopicsPath } from "../../routing/uiroutes";
import { useHistory } from "react-router-dom";
import useTabTitle from "../../routing/useTabTitle";

interface GroupCreationControllerProps {}

const DEFAULT_ERROR_MSG = "Error creating group";

const GroupCreationController: React.FC<GroupCreationControllerProps> = (
    props: GroupCreationControllerProps
) => {
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const history = useHistory();
    useTabTitle("Create Group");

    const createGroup = async (values: GroupCreationValue) => {
        try {
            const result: APIResponse<
                number,
                GroupCreationValue
            > = await GroupRepository.createGroup(values);
            if (result.successful) {
                const newGroupId: number = result.data;
                const newGroupUrl = makeGroupTopicsPath(newGroupId);
                history.replace(newGroupUrl);
            } else if (result.hasErrors) {
                return result.errors;
            } else {
                setErrorMessage(result.responseMessage || DEFAULT_ERROR_MSG);
            }
        } catch (err) {
            setErrorMessage(DEFAULT_ERROR_MSG);
        }
    };

    return (
        <div className="groupCreationPage ideakat-form">
            <div className="ideakat-form-header">Create Group</div>
            <GroupCreationForm handleSubmit={createGroup} />
            {errorMessage && <div className="ideakat-form-error-message">{errorMessage}</div>}
        </div>
    );
};

export default GroupCreationController;
