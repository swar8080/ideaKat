/**
 * @prettier
 */

import * as React from 'react';
import useTabTitle from '../../routing/useTabTitle';
import EditProfileForm from './EditProfileForm';
import UserRepository from '../../repository/UserRepository';
import { EditProfileContract } from './model';
import { UserProfile } from '../../model/user';

interface EditProfileControllerProps {

}

const EditProfileController: React.FC<EditProfileControllerProps> = (props: EditProfileControllerProps) => {
    const [userProfile, setUserProfile] = React.useState<UserProfile>();
    useTabTitle("Edit Profile");

    React.useEffect(() => {
        UserRepository.getProfile().then(profile => setUserProfile(profile));
    }, []);

    const handleFormSubmit = (values: EditProfileContract) => {
        return UserRepository.editProfile(values).then((response) => {
            if (response.successful){
                window.location.reload();
            }
            else {
                return response.errors;
            }
        });
    };

    if (!userProfile){
        return null;
    }

    return (
        <div className='ideakat-form'>
            <div className='ideakat-form-header'>Edit Profile</div>
            <EditProfileForm
                displayName={userProfile.displayName}
                profileImageUrl={userProfile.imageUrl}
                handleSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default EditProfileController;