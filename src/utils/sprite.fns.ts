import IdleDownRight from "../assets/images/Character_Idle_Right_Down.png";
import IdleRightUp from "../assets/images/Character_Idle_Right_Up.png";
import IdleLeftUp from "../assets/images/Character_Idle_Left_Up.png";
import IdleLeftDown from "../assets/images/Character_Idle_Left_Down.png";
import IdleUp from "../assets/images/Character_Idle_Up.png";
import IdleDown from "../assets/images/Character_Idle_Down.png";
import WalkDownRight from "../assets/images/Character_Walk_Right_Down.png";
import WalkUpRight from "../assets/images/Character_Walk_Right_Up.png";
import WalkDownLeft from "../assets/images/Character_Walk_Left_Down.png";
import WalkUpLeft from "../assets/images/Character_Walk_Left_Up.png";
import WalkUp from "../assets/images/Character_Walk_Up.png";
import WalkDown from "../assets/images/Character_Walk_Down.png";
import RunDownRight from "../assets/images/Character_Dash_Right_Down.png";
import RunUpRight from "../assets/images/Character_Dash_Right_Up.png";
import RunDownLeft from "../assets/images/Character_Dash_Left_Down.png";
import RunUpLeft from "../assets/images/Character_Dash_Left_Up.png";
import RunUp from "../assets/images/Character_Dash_Up.png";
import RunDown from "../assets/images/Character_Dash_Down.png";

export const getIdleSprite = (direction: string): string => {
  return (
    {
      "down-right": IdleDownRight,
      "up-right": IdleRightUp,
      "up-left": IdleLeftUp,
      "down-left": IdleLeftDown,
      up: IdleUp,
      down: IdleDown,
    }[direction] || IdleDownRight
  );
};

export const getRunningSprite = (direction: string): string => {
  return (
    {
      "down-right": WalkDownRight,
      "up-right": WalkUpRight,
      "down-left": WalkDownLeft,
      "up-left": WalkUpLeft,
      up: WalkUp,
      down: WalkDown,
    }[direction] || WalkDownRight
  );
};

export const getDashingSprite = (direction: string): string => {
  return (
    {
      "down-right": RunDownRight,
      "up-right": RunUpRight,
      "down-left": RunDownLeft,
      "up-left": RunUpLeft,
      up: RunUp,
      down: RunDown,
    }[direction] || RunDownRight
  );
};
