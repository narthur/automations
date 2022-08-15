import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import gross from "./gross";

vi.mock("axios");

const mockGet = vi.spyOn(axios, "get");
const mockPost = vi.spyOn(axios, "post");

function loadGetData(data: unknown) {
  vi.mocked(mockGet).mockResolvedValue({ data });
}

function loadPostResponse({
  bmResponse,
  otcResponse,
  bmSuccess = true,
  otcSuccess = true,
}: Record<string, unknown> = {}) {
  vi.mocked(mockPost).mockImplementation((url: string) => {
    // if url contains 'beeminder'
    if (url.indexOf("beeminder") !== -1) {
      return bmSuccess
        ? Promise.resolve(bmResponse)
        : Promise.reject(bmResponse);
    }

    // if url contains 'opentimeclock'
    if (url.indexOf("opentimeclock") !== -1) {
      return otcSuccess
        ? Promise.resolve(otcResponse)
        : Promise.reject(otcResponse);
    }

    throw new Error("unexpected url");
  });
}

function loadPostData({ bmData, otcData = [] }: Record<string, unknown> = {}) {
  loadPostResponse({
    bmResponse: {
      data: bmData,
    },
    otcResponse: {
      data: otcData,
    },
  });
}

function pointContaining(data: Record<string, unknown>) {
  return expect.objectContaining({
    ...data,
  }) as unknown;
}

const PROJECTS = [
  {
    id: 0,
    rate: 10,
    label: "Project 0",
  },
  {
    id: 1,
    rate: 20,
    label: "Project 1",
  },
];

describe("gross", () => {
  beforeEach(() => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");
    loadGetData([]);
    loadPostData();
    process.env = {
      ...process.env,
      GROSS_TOGGL_LABELS: PROJECTS.map(p => p.label).join(","),
      GROSS_TOGGL_PROJECTS: PROJECTS.map((p) => p.id).join(","),
      GROSS_TOGGL_RATES: PROJECTS.map((p) => p.rate).join(","),
      TOGGL_API_TOKEN: "the_token",
      USERNAME: "the_username",
      AUTH_TOKEN: "the_auth_token",
    };
  });

  it("posts day sum", async () => {
    loadGetData([
      {
        project_id: PROJECTS[0].id,
        duration: 3600,
        start: "2022-08-10T16:50:07+00:00",
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        value: 10,
      })
    );
  });

  it("handles ongoing timers", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadGetData([
      {
        project_id: PROJECTS[0].id,
        duration: -1660150207,
        start: "2022-08-10T16:50:07+00:00",
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        value: 10,
      })
    );
  });

  it("includes comment", async () => {
    loadGetData([
      {
        project_id: PROJECTS[0].id,
        duration: 3600,
        start: "2022-08-10T16:50:07+00:00",
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        comment: "Toggl: Project 0: 1hrs",
      })
    );
  });

  it("filters by project id", async () => {
    loadGetData([
      {
        project_id: "wrong_id",
        duration: 3600,
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        value: 0,
      })
    );
  });

  it("uses Toggl API token", async () => {
    await gross();

    const expected = Buffer.from(
      `${process.env.TOGGL_API_TOKEN}:api_token`
    ).toString("base64");

    expect(mockGet).toHaveBeenCalledWith(
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

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        daystamp: "2022-08-10",
      })
    );
  });

  it("sets requestid to date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        requestid: "toggl-1-2022-08-10",
      })
    );
  });

  it("filters by date", async () => {
    vi.setSystemTime("2022-08-10T17:50:07+00:00");

    loadGetData([
      {
        project_id: PROJECTS[0].id,
        duration: 3600,
        start: "2022-08-09T16:50:07+00:00",
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        value: 0,
      })
    );
  });

  it("posts to beeminder goal url", async () => {
    await gross();

    const expected =
      "https://www.beeminder.com/api/v1/users/the_username/goals/gross/datapoints.json";

    expect(mockPost).toHaveBeenCalledWith(expected, expect.anything());
  });

  it("uses Beeminder auth token", async () => {
    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        auth_token: process.env.AUTH_TOKEN,
      })
    );
  });

  it("ignores duplicate request errors", async () => {
    loadPostResponse({
      bmResponse: {
        response: {
          status: 422,
          data: {
            error: "Duplicate datapoint",
          },
        },
      },
      bmSuccess: false,
      otcResponse: {
        data: [],
      },
    });

    await gross();

    expect(mockPost).toHaveBeenCalled();
  });

  it("rethrows errors", async () => {
    loadPostResponse({
      bmResponse: {
        response: {
          status: 500,
          data: {
            error: "Internal Server Error",
          },
        },
      },
      bmSuccess: false,
      otcResponse: {
        data: [],
      },
    });

    await expect(gross()).rejects.toThrowError();

    expect(mockPost).toHaveBeenCalled();
  });

  it("maps rates to projects", async () => {
    loadGetData([
      {
        project_id: PROJECTS[1].id,
        duration: 3600,
        start: "2022-08-10T16:50:07+00:00",
      },
    ]);

    await gross();

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      pointContaining({
        value: 20,
      })
    );
  });

  it("throws if id and rate counts do not match", async () => {
    process.env = {
      ...process.env,
      GROSS_TOGGL_PROJECTS: "1,2",
      GROSS_TOGGL_RATES: "1",
      TOGGL_API_TOKEN: "the_token",
      USERNAME: "the_username",
      AUTH_TOKEN: "the_auth_token",
    };

    await expect(gross()).rejects.toThrowError();
  });

  it('throws if label count does not match project count', async () => {
    process.env = {
      ...process.env,
      GROSS_TOGGL_LABELS: "1",
      GROSS_TOGGL_PROJECTS: "1,2",
      GROSS_TOGGL_RATES: "1,2",
      TOGGL_API_TOKEN: "the_token",
      USERNAME: "the_username",
      AUTH_TOKEN: "the_auth_token",
    };

    await expect(gross()).rejects.toThrowError();
  })
});
