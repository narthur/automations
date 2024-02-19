import { makeUpdater } from "./index.js";

export const update = makeUpdater({
  user: "narthur",
  goal: "gross",
  getDateUpdate: () => {
    return {
      value: 0,
      comment: "TODO: Implement this.",
    };
  },
});
