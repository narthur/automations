import { createTask } from "src/services/taskratchet";
import { getProject } from "src/services/toggl/getProject";
import event from "src/services/toggl/zod/event";
import validateSignature from "src/services/toggl/validateSignature";
import { beforeEach, describe, expect, it, vi } from "vitest";
import waitForExpect from "wait-for-expect";
import { createFixture } from "zod-fixture";

import { POST } from "./toggl";

vi.mock("../../services/toggl/validateSignature");

const eventFixture = createFixture(event, {
  seed: 1,
});

describe("hooks/toggl", () => {
  beforeEach(() => {
    vi.mocked(validateSignature).mockResolvedValue(true);
    vi.mocked(getProject).mockResolvedValue({
      name: "the_project_name",
    } as any);
  });

  it("returns validation code", async () => {
    const request = new Request("https://example.com/hooks/toggl", {
      method: "POST",
      body: JSON.stringify({
        validation_code: "1234567890",
      }),
    });

    const response = await POST({ request } as any);

    expect(await response.json()).toEqual({
      validation_code: "1234567890",
    });
  });

  it("creates summary task", async () => {
    const request = new Request("https://example.com/hooks/toggl", {
      method: "POST",
      body: JSON.stringify({
        ...eventFixture,
        metadata: {
          ...eventFixture.metadata,
          model: "time_entry",
        },
        payload: {
          ...eventFixture.payload,
          stop: "2021-08-01T00:00:00Z",
        },
      }),
    });

    await POST({ request } as any);

    await waitForExpect(() => {
      expect(createTask).toHaveBeenCalled();
    });
  });

  it("never calls json", async () => {
    const request = new Request("https://example.com/hooks/toggl", {
      method: "POST",
      body: JSON.stringify({
        ...eventFixture,
        metadata: {
          ...eventFixture.metadata,
          model: "time_entry",
        },
        payload: {
          ...eventFixture.payload,
          stop: "2021-08-01T00:00:00Z",
        },
      }),
    });

    request.json = vi.fn();

    await POST({ request } as any);

    expect(request.json).not.toHaveBeenCalled();
  });

  it("only calls text once", async () => {
    const request = new Request("https://example.com/hooks/toggl", {
      method: "POST",
      body: JSON.stringify({
        ...eventFixture,
        metadata: {
          ...eventFixture.metadata,
          model: "time_entry",
        },
        payload: {
          ...eventFixture.payload,
          stop: "2021-08-01T00:00:00Z",
        },
      }),
    });

    request.text = vi.fn(() => Promise.resolve("{}"));

    await POST({ request } as any);

    expect(request.text).toHaveBeenCalledTimes(1);
  });
});
