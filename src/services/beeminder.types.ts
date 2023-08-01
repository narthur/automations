// https://tsdoc.org/

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

export type Goal = {
  /**
   * The final part of the URL of the goal, used as an identifier. E.g., if user
   * "alice" has a goal at beeminder.com/alice/weight then the goal's slug is
   * "weight".
   */
  slug: string;

  /**
   * Unix timestamp of the last time this goal was updated.
   */
  updated_at: number;

  /**
   * The title that the user specified for the goal. E.g., "Weight Loss".
   */
  title: string;

  /**
   * The user-provided description of what exactly they are committing to.
   */
  fineprint: string;

  /**
   * The label for the y-axis of the graph. E.g., "Cumulative total hours".
   */
  yaxis: string;

  /**
   * Unix timestamp (in seconds) of the goal date.
   */
  goaldate: number;

  /**
   * Goal value — the number the bright red line will eventually reach. E.g., 70 kilograms.
   */
  goalval: number;

  /**
   * The slope of the (final section of the) bright red line. You must also consider runits to fully specify the rate.
   */
  rate: number;

  /**
   * Rate units. One of y, m, w, d, h indicating that the rate of the bright red line is yearly, monthly, weekly, daily, or hourly.
   */
  runits: "y" | "m" | "w" | "d" | "h";

  /**
   * URL for the goal's graph svg. E.g., "http://static.beeminder.com/alice/weight.svg".
   */
  svg_url: string;

  /**
   * URL for the goal's graph image. E.g., "http://static.beeminder.com/alice/weight.png".
   */
  graph_url: string;

  /**
   * URL for the goal's graph thumbnail image. E.g., "http://static.beeminder.com/alice/weight-thumb.png".
   */
  thumb_url: string;

  /**
   * The name of automatic data source, if this goal has one. Will be null for manual goals.
   */
  autodata: string | null;

  /**
   * One of the following symbols:
   *
   * - hustler: Do More
   * - biker: Odometer
   * - fatloser: Weight loss
   * - gainer: Gain Weight
   * - inboxer: Inbox Fewer
   * - drinker: Do Less
   * - custom: Full access to the underlying goal parameters
   */
  goal_type:
    | "hustler"
    | "biker"
    | "fatloser"
    | "gainer"
    | "inboxer"
    | "drinker"
    | "custom";

  /**
   * Unix timestamp of derailment. When you'll cross the bright red line if nothing is reported.
   */
  losedate: number;

  /**
   * Whether the graph is currently being updated to reflect new data.
   */
  queued: boolean;

  /**
   * Whether you have to be logged in as owner of the goal to view it. Default: false.
   */
  secret: boolean;

  /**
   * Whether you have to be logged in as the owner of the goal to view the datapoints. Default: false.
   */
  datapublic: boolean;

  /**
   * The datapoints for this goal.
   */
  datapoints: Datapoint[];

  /**
   * Number of datapoints.
   */
  numpts: number;

  /**
   * Amount pledged (USD) on the goal.
   */
  pledge: number;

  /**
   * Unix timestamp (in seconds) of the start of the bright red line.
   */
  initday: number;

  /**
   * The y-value of the start of the bright red line.
   */
  initval: number;

  /**
   * Unix timestamp (in seconds) of the end of the bright red line, i.e., the most recent (inferred) datapoint.
   */
  curday: number;

  /**
   * The value of the most recent datapoint.
   */
  curval: number;

  /**
   * Unix timestamp (in seconds) of the last (explicitly entered) datapoint.
   */
  lastday: number;

  /**
   * Good side of the bright red line. I.e., the side of the line (+1/-1 = above/below) that makes you say "yay".
   */
  yaw: 1 | -1;

  /**
   * Direction the bright red line is sloping, usually the same as yaw.
   */
  dir: 1 | -1;

  /**
   * @deprecated See losedate and safebuf.
   */
  lane: number;

  /**
   * The goaldate, goalval, and rate — all filled in. (The commitment dial specifies 2 out of 3 and you can check this if you want Beeminder to do the math for you on inferring the third one.)
   */
  mathishard: [number, number, number];

  /**
   * @deprecated Summary text blurb saying how much safety buffer you have.
   */
  headsum: string;

  /**
   * Summary of what you need to do to eke by, e.g., "+2 within 1 day".
   */
  limsum: string;

  /**
   * Cumulative; plot values as the sum of all those entered so far, aka auto-summing.
   */
  kyoom: boolean;

  /**
   * Treat zeros as accidental odometer resets.
   */
  odom: boolean;

  /**
   * How to aggregate points on the same day, eg, min/max/mean.
   */
  aggday:
    | "last"
    | "first"
    | "min"
    | "max"
    | "trueman"
    | "mean"
    | "uniqmean"
    | "median"
    | "mode"
    | "trimmean"
    | "sum"
    | "binary"
    | "nonzero"
    | "triangle"
    | "square"
    | "clocky"
    | "count"
    | "skatesum"
    | "cap1";

  /**
   * Join dots with purple steppy-style line.
   */
  steppy: boolean;

  /**
   * Show the rose-colored dots and connecting line.
   */
  rosy: boolean;

  /**
   * Show moving average line superimposed on the data.
   */
  movingav: boolean;

  /**
   * Show turquoise swath, aka blue-green aura.
   */
  aura: boolean;

  /**
   * Whether the goal is currently frozen and therefore must be restarted before continuing to accept data.
   */
  frozen: boolean;

  /**
   * Whether the goal has been successfully completed.
   */
  won: boolean;

  /**
   * Whether the goal is currently off track.
   */
  lost: boolean;

  /**
   * Max daily fluctuation for weight goals. Used as an absolute buffer amount on recommit. Also shown on the graph as a thick guiding line.
   */
  maxflux: number;

  /**
   * Dictionary with two attributes. amount is the amount at risk on the contract, and stepdown_at is a Unix timestamp of when the contract is scheduled to revert to the next lowest pledge amount. null indicates that it is not scheduled to revert.
   */
  contract: {
    amount: number;
    stepdown_at: number | null;
  };

  /**
   * Array of tuples that can be used to construct the Bright Red Line (formerly "Yellow Brick Road"). This field is also known as the graph matrix. Each tuple specifies 2 out of 3 of [time, goal, rate]. To construct road, start with a known starting point (time, value) and then each row of the graph matrix specifies 2 out of 3 of {t,v,r} which gives the segment ending at time t. You can walk forward filling in the missing 1-out-of-3 from the (time, value) in the previous row.
   */
  road: [number | null, number | null, number | null][];

  /**
   * Like road but with an additional initial row consisting of [initday, initval, null] and an additional final row consisting of [goaldate, goalval, rate].
   */
  roadall: [number | null, number | null, number | null][];

  /**
   * Like roadall but with the nulls filled in.
   */
  fullroad: [number, number, number][];

  /**
   * Red line value (y-value of the bright red line) at the akrasia horizon (today plus one week).
   */
  rah: number;

  /**
   * Distance from the bright red line to today's datapoint (curval).
   */
  delta: number;

  /**
   * @deprecated
   */
  delta_text: string;

  /**
   * The integer number of safe days. If it's a beemergency this will be zero.
   */
  safebuf: number;

  /**
   * The absolute y-axis number you need to reach to get one additional day of safety buffer.
   */
  safebump: number;

  /**
   * We prefer using user/slug as the goal identifier, however, since we began allowing users to change slugs, this id is useful!
   */
  id: string;

  /**
   * Callback URL, as discussed in the forum. WARNING: If different apps change this they'll step on each other's toes.
   */
  callback_url: string;

  /**
   * @deprecated User-supplied description of goal (listed in sidebar of graph page as "Goal Statement").
   */
  description: string;

  /**
   * @deprecated Text summary of the graph, not used in the web UI anymore.
   */
  graphsum: string;

  /**
   * @deprecated Now always zero.
   */
  lanewidth: number;

  /**
   * Seconds by which your deadline differs from midnight. Negative is before midnight, positive is after midnight. Allowed range is -17*3600 to 6*3600 (7am to 6am).
   */
  deadline: number;

  /**
   * Days before derailing we start sending you reminders. Zero means we start sending them on the beemergency day, when you will derail later that day.
   */
  leadtime: number;

  /**
   * Seconds after midnight that we start sending you reminders (on the day that you're scheduled to start getting them, see leadtime above).
   */
  alertstart: number;

  /**
   * Whether to plot all the datapoints, or only the aggday'd one. So if false then only the official datapoint that's counted is plotted.
   */
  plotall: boolean;

  /**
   * The last datapoint entered for this goal.
   */
  last_datapoint: Datapoint;

  /**
   * Assume that the units must be integer values. Used for things like limsum.
   */
  integery: boolean;

  /**
   * Goal units, like "hours" or "pushups" or "pages".
   */
  gunits: string;

  /**
   * Whether to show data in a "timey" way, with colons. For example, this would make a 1.5 show up as 1:30.
   */
  hhmmformat: boolean;

  /**
   * Whether there are any datapoints for today
   */
  todayta: boolean;

  /**
   *  If the goal has weekends automatically scheduled.
   */
  weekends_off: boolean;

  /**
   * Lower bound on x-axis; don't show data before this date; using yyyy-mm-dd date format. (In Graph Settings this is 'X-min')
   */
  tmin: string;

  /**
   * Upper bound on x-axis; don't show data after this date; using yyyy-mm-dd date format. (In Graph Settings this is 'X-max')
   */
  tmax: string;

  /**
   * A list of the goal's tags.
   */
  tags: string[];
};

export type DatapointInput = {
  value: number;
  comment?: string;
  daystamp?: string;
  requestid?: string;
};

export type ServerError = {
  response: {
    status: number;
  };
};
