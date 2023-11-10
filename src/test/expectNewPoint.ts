import axios from "axios";
import { expect } from "vitest";

export default function expectNewPoint(point: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(axios.post).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining(point)
  );
}
