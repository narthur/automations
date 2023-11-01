export type Datapoint = {
  /**
   * A unique ID, used to identify a datapoint when deleting or editing it.
   */
  id: string;

  /**
   * The unix time (in seconds) of the datapoint.
   */
  timestamp: number;

  /**
   * The date of the datapoint (e.g., "20150831"). Sometimes timestamps are surprising due to goal deadlines, so if you're looking at Beeminder data, you're probably interested in the daystamp.
   */
  daystamp: string;

  /**
   * The value, e.g., how much you weighed on the day indicated by the timestamp.
   */
  value: number;

  /**
   * An optional comment about the datapoint.
   */
  comment?: string;

  /**
   * The unix time that this datapoint was entered or last updated.
   */
  updated_at: number;

  /**
   * If a datapoint was created via the API and this parameter was included, it will be echoed back.
   */
  requestid?: string;
};
