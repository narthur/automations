export default function isNotificationDue({
  due,
  now,
  window,
}: {
  due: number;
  now: number;
  window: number;
}): boolean {
  const zenoSchedule = zeno(window);

  let next = zenoSchedule.next().value;

  while (due - next >= now) {
    if (due - next >= now && due - next < now + window) return true;
    next = zenoSchedule.next().value;
  }

  return false;
}

function* zeno(window: number): Generator<number, number> {
  yield 0;
  let i = 0;
  while (true) {
    yield window * 2 ** i;
    i++;
  }
}
