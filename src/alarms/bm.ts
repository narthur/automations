import getGoals from "src/services/beeminder/getGoals.js";

import { createAlarmTrigger } from "./index.js";

export const send = createAlarmTrigger({
  id: "bm",
  getItems: async () => {
    const goals = await getGoals();
    return goals.map((g) => ({
      name: g.slug,
      timestamp: g.losedate,
    }));
  },
});

export default {
  send,
};
