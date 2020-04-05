/**
 * @prettier
 */

import * as React from "react";
import "./ProfileImage.scss";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";

interface ProfileImageProps {
  imageUrl?: string;
  containerClassName?: string;
  username: string;
  size: "xs" | "sm" | "lg" | "2x";
}

//https://fontawesome.com/how-to-use/on-the-web/styling/sizing-icons
const FONT_AWESEOME_DIMENSIONS = {
  xs: "0.75em",
  sm: "0.875em",
  lg: "1.33em",
  "2x": "2em"
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  containerClassName,
  username,
  size
}) => {
  let content;
  if (imageUrl) {
    const dimensions = {
      width: FONT_AWESEOME_DIMENSIONS[size],
      height: FONT_AWESEOME_DIMENSIONS[size]
    };
    content = <img src={imageUrl} style={dimensions} title={username} alt=""
        //@ts-ignore
        loading="lazy" 
    />;
  } else {
    content = <FontAwesomeIcon icon={faUserCircle} title={username} size={size} />;
  }

  return <div className={cn("profileImage", containerClassName)}>{content}</div>;
};

export default ProfileImage;
