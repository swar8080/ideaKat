export interface GroupCreationValue {
    groupName: string,
    description?: string,
    groupImage?: File
}


export interface GroupEditValues extends GroupCreationValue {
    clearingImage: boolean
}

export interface GroupPageGroup  {
    groupId: number,
    groupName: string,
    description: string,
    imageUrl?: string,
    activityCount: number,
    isEditable: boolean
}