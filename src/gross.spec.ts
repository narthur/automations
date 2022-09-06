import { describe, it, expect, vi, beforeEach } from "vitest";
import axios, { __loadResponse } from "axios";
import gross from "./gross";
import { setEnv } from "../vitest.setup";
import expectNewPoint from "./lib/test/expectNewPoint";

vi.mock("axios");

describe("gross", () => {
  beforeEach(() => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    __loadResponse({
      method: ["get", "post"],
      payload: { data: [] },
    });
  });

  it("uses Toggl API token", async () => {
    await gross();

    const expected = Buffer.from(
      `${process.env.TOGGL_API_TOKEN}:api_token`
    ).toString("base64");

    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Basic ${expected}`,
        }) as unknown,
      })
    );
  });

  it("sets daystamp", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    await gross();

    expectNewPoint({ daystamp: "2022-08-10" });
  });

  it("sets requestid to date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    await gross();

    expectNewPoint({ requestid: "toggl-1-2022-08-10" });
  });

  it("posts to beeminder goal url", async () => {
    await gross();

    const s =
      "https://www.beeminder.com/api/v1/users/the_username/goals/gross/datapoints.json";

    expect(axios.post).toHaveBeenCalledWith(s, expect.anything());
  });

  it("uses Beeminder auth token", async () => {
    await gross();

    expectNewPoint({ auth_token: process.env.AUTH_TOKEN });
  });

  it("ignores duplicate request errors", async () => {
    __loadResponse({
      url: /beeminder/,
      method: "post",
      payload: {
        response: {
          status: 422,
          data: {
            error: "Duplicate datapoint",
          },
        },
      },
      ok: false,
    });

    await gross();

    expect(axios.post).toHaveBeenCalled();
  });

  it("rethrows errors", async () => {
    __loadResponse({
      url: /beeminder/,
      method: "post",
      payload: {
        response: {
          status: 500,
          data: {
            error: "Internal Server Error",
          },
        },
      },
      ok: false,
    });

    await expect(gross()).rejects.toThrowError();

    expect(axios.post).toHaveBeenCalled();
  });

  it("throws if id and rate counts do not match", async () => {
    setEnv({
      GROSS_TOGGL_PROJECTS: "1,2",
      GROSS_TOGGL_RATES: "1",
    });

    await expect(gross()).rejects.toThrowError();
  });

  it("throws if label count does not match project count", async () => {
    setEnv({
      GROSS_TOGGL_LABELS: "1",
      GROSS_TOGGL_PROJECTS: "1,2",
    });

    await expect(gross()).rejects.toThrowError();
  });
});
