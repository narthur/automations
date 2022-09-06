import { expect } from "vitest";
import axios from "axios";

export default function expectNewPoint(point: Record<string, unknown>) {
  expect(axios.post).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining(point)
  );
}
