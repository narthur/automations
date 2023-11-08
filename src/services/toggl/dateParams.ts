import makeDaystamp from "src/lib/makeDaystamp.js";

export default function dateParams(date?: Date) {
  if (!date) return {};

  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    start_date: makeDaystamp(date),
    end_date: makeDaystamp(tomorrow),
  };
}
