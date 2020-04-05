/**
 * @prettier
 */

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Group } from "../../model/group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";

import "./GroupSelector.scss";

interface GroupSelectorProps {
  group?: Group;
  isViewingGroup: boolean;
  isLoadingGroup: boolean;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ group, isViewingGroup, isLoadingGroup }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownSearchInput = useRef(null);

  let text: string;
  let groupImage;

  if (isViewingGroup) {
    if (isLoadingGroup) {
      groupImage = null;
      text = "Loading...";
    } else if (group) {
      groupImage = <img src={group.imageUrl} width={40} height={40} />;
      text = group.groupName;
    }
  } else {
    groupImage = null;
    text = "Select a group";
  }

  function onDropdownArrowClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  useEffect(() => {
    if (isDropdownOpen) {
      dropdownSearchInput.current.focus();
    }
  }, [isDropdownOpen]);

  return (
    <div className="groupSelector">
      <div className="groupSelector__header">
        <div className="groupSelector__image">{groupImage}</div>
        <div className="groupSelector__text">{text}</div>
        <div className="groupSelector__dropdown_arrow" onClick={onDropdownArrowClick}>
          <FontAwesomeIcon icon={isDropdownOpen ? faCaretUp : faCaretDown} size="2x" />
        </div>
      </div>
      <div
        className="groupSelector__dropdown"
        style={{ display: isDropdownOpen ? "block" : "none" }}
      >
        <input type="text" placeholder="Group Name" ref={dropdownSearchInput}></input>
      </div>
    </div>
  );
};

//

export default GroupSelector;
