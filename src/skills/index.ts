export * from "./MagicMissile";
export * from "./Skill";

import { MagicMissile } from "./MagicMissile";
import { Skill } from "./Skill";

export const skillList:Set<typeof Skill> = new Set([
    MagicMissile
]);
export default skillList;