import * as React from "react";
import { storiesOf } from "@storybook/react";
import { GroupPageComponent } from "../GroupPage";
import "./GroupPage.stories.scss";
import { HashRouter } from "react-router-dom";
import { GroupPageGroup } from "../model";

let groupId = 0;
let imageIndex = 0;
const imageUrls = [
  "https://www.zooplus.co.uk/magazine/wp-content/uploads/2018/05/Cockatiels-1024x1024.jpg",
  "https://icons.iconarchive.com/icons/sonya/swarm/256/Pizza-icon.png",
  "https://www.veeva.com/wp-content/uploads/2018/04/Veeva-logo-Social-1200.png"
];
const randomGroupActivity = () => Math.floor(3 * Math.random() - 0.25)

storiesOf("GroupPage", module).add("Multiple Types of Groups", () => {
  let groups: GroupPageGroup[] = [
    {
      groupId: groupId++,
      groupName: "Regular Group",
      description: "Regular group description",
      imageUrl: imageUrls[imageIndex++ % 3],
      activityCount: randomGroupActivity(),
      isEditable: true
    },
    {
        groupId: groupId++,
        groupName: "Group without image",
        description: "Regular group description",
        activityCount: randomGroupActivity(),
        isEditable: true
    },
    {
        groupId: groupId++,
        groupName: "Group without activity",
        description: "Regular group description",
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: 0,
        isEditable: true
      },
      {
        groupId: groupId++,
        groupName: "Group with a lot of activity",
        description: "Regular group description",
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: 123,
        isEditable: true
      },
      {
        groupId: groupId++,
        groupName: "Group not editable",
        description: "Regular group description",
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: 1,
        isEditable: false
      },
      {
        groupId: groupId++,
        groupName: "Group not editable or with activity",
        description: "Regular group description",
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: randomGroupActivity(),
        isEditable: false
      },
      {
        groupId: groupId++,
        groupName: "Group with long group name ".repeat(5).substring(0, 50),
        description: "Regular group description",
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: randomGroupActivity(),
        isEditable: true
      },
      {
        groupId: groupId++,
        groupName: "Group with long description",
        description: "Long description ".repeat(10).substring(0, 150),
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: randomGroupActivity(),
        isEditable: false
      },
      {
        groupId: groupId++,
        groupName: "sm",
        description: "Long description ".repeat(10).substring(0, 150),
        imageUrl: imageUrls[imageIndex++ % 3],
        activityCount: randomGroupActivity(),
        isEditable: false
      },
  ].sort((a, b) => -(a.activityCount - b.activityCount))

  return (
    <HashRouter>
      <GroupPageComponent groups={groups} />
    </HashRouter>
  );
});

storiesOf("GroupPage", module).add("Too many groups to show on page", () => {
    let groups: GroupPageGroup[] = [];
    for (let i = 0; i < 100; i++){
        groups.push({
            groupId: groupId++,
            groupName: "Regular Group",
            description: "Regular group description",
            imageUrl: imageUrls[imageIndex++ % 3],
            activityCount: randomGroupActivity(),
            isEditable: true
        })
    }

    return (
        <HashRouter>
          <GroupPageComponent groups={groups} />
        </HashRouter>
      );
})
