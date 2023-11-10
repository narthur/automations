export default function isNotificationDue({
  due,
  now,
  window,
}: {
  due: number;
  now: number;
  window: number;
}): boolean {
  const z = zeno(window);

  let next = z.next().value;

  while (due - next >= now) {
    const afterStart = due - next >= now;
    const beforeEnd = due - next < now + window;

    if (afterStart && beforeEnd) return true;

    next = z.next().value;
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
