import getWeekDates from "src/lib/getWeekDates.js";
import { createDatapoint } from "src/services/beeminder.js";
import { DatapointInput } from "src/services/beeminder.types.js";
import makeDaystamp from "src/lib/makeDaystamp.js";

type Options<T> = {
  user: string;
  goal: string;
  getSharedData: () => Promise<T> | T;
  getDateUpdate: (date: Date, sharedData: T) => Promise<DatapointInput>;
};

export function makeUpdater<T>({
  getSharedData,
  getDateUpdate,
  user,
  goal,
}: Options<T>) {
  return async function update() {
    const dates = getWeekDates();
    const shared = await getSharedData();
    const points = await Promise.all(
      dates.map(async (d) => {
        const point = await getDateUpdate(d, shared);
        const daystamp = makeDaystamp(d);
        return {
          ...point,
          requestid: daystamp,
          daystamp,
        };
      })
    );

    await Promise.all(points.map((p) => createDatapoint(user, goal, p)));
  };
}
