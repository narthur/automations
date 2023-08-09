export default function getWeekDates() {
  return [...Array(7).keys()].map((i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });
}
