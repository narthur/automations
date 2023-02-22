/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResponse {
  error: ErrorDetail;
}

export interface ErrorDetail {
  id: string;
  name: string;
  detail: string;
}

export interface UserResponse {
  data: {
    user: User;
  };
}

export interface User {
  /** @format uuid */
  id: string;
}

/** The date format setting for the budget.  In some cases the format will not be available and will be specified as null. */
export interface DateFormat {
  format: string;
}

/** The currency format setting for the budget.  In some cases the format will not be available and will be specified as null. */
export interface CurrencyFormat {
  iso_code: string;
  example_format: string;
  /** @format int32 */
  decimal_digits: number;
  decimal_separator: string;
  symbol_first: boolean;
  group_separator: string;
  currency_symbol: string;
  display_symbol: boolean;
}

export interface BudgetSummaryResponse {
  data: {
    budgets: BudgetSummary[];
    /** The default budget, if the associated application is configured to support specifying it */
    default_budget?: BudgetSummary;
  };
}

export interface BudgetSummary {
  /** @format uuid */
  id: string;
  name: string;
  /**
   * The last time any changes were made to the budget from either a web or mobile client
   * @format date-time
   */
  last_modified_on?: string;
  /**
   * The earliest budget month
   * @format date
   */
  first_month?: string;
  /**
   * The latest budget month
   * @format date
   */
  last_month?: string;
  /** The date format setting for the budget.  In some cases the format will not be available and will be specified as null. */
  date_format?: DateFormat;
  /** The currency format setting for the budget.  In some cases the format will not be available and will be specified as null. */
  currency_format?: CurrencyFormat;
  /** The budget accounts (only included if `include_accounts=true` specified as query parameter) */
  accounts?: Account[];
}

export interface BudgetDetailResponse {
  data: {
    budget: BudgetDetail;
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export type BudgetDetail = BudgetSummary & {
  accounts?: Account[];
  payees?: Payee[];
  payee_locations?: PayeeLocation[];
  category_groups?: CategoryGroup[];
  categories?: Category[];
  months?: MonthDetail[];
  transactions?: TransactionSummary[];
  subtransactions?: SubTransaction[];
  scheduled_transactions?: ScheduledTransactionSummary[];
  scheduled_subtransactions?: ScheduledSubTransaction[];
};

export interface BudgetSettingsResponse {
  data: {
    settings: BudgetSettings;
  };
}

export interface BudgetSettings {
  /** The date format setting for the budget.  In some cases the format will not be available and will be specified as null. */
  date_format: DateFormat;
  /** The currency format setting for the budget.  In some cases the format will not be available and will be specified as null. */
  currency_format: CurrencyFormat;
}

export interface AccountsResponse {
  data: {
    accounts: Account[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface AccountResponse {
  data: {
    account: Account;
  };
}

export interface Account {
  /** @format uuid */
  id: string;
  name: string;
  /** The type of account */
  type: AccountType;
  /** Whether this account is on budget or not */
  on_budget: boolean;
  /** Whether this account is closed or not */
  closed: boolean;
  note?: string;
  /**
   * The current balance of the account in milliunits format
   * @format int64
   */
  balance: number;
  /**
   * The current cleared balance of the account in milliunits format
   * @format int64
   */
  cleared_balance: number;
  /**
   * The current uncleared balance of the account in milliunits format
   * @format int64
   */
  uncleared_balance: number;
  /**
   * The payee id which should be used when transferring to this account
   * @format uuid
   */
  transfer_payee_id: string;
  /** Whether or not the account is linked to a financial institution for automatic transaction import. */
  direct_import_linked?: boolean;
  /** If an account linked to a financial institution (direct_import_linked=true) and the linked connection is not in a healthy state, this will be true. */
  direct_import_in_error?: boolean;
  /** Whether or not the account has been deleted.  Deleted accounts will only be included in delta requests. */
  deleted: boolean;
}

export interface PostAccountWrapper {
  account: SaveAccount;
}

export interface SaveAccount {
  /** The name of the account */
  name: string;
  /** The type of account */
  type: AccountType;
  /**
   * The current balance of the account in milliunits format
   * @format int64
   */
  balance: number;
}

/** The type of account */
export enum AccountType {
  Checking = "checking",
  Savings = "savings",
  Cash = "cash",
  CreditCard = "creditCard",
  LineOfCredit = "lineOfCredit",
  OtherAsset = "otherAsset",
  OtherLiability = "otherLiability",
  Mortgage = "mortgage",
  AutoLoan = "autoLoan",
  StudentLoan = "studentLoan",
  PersonalLoan = "personalLoan",
  MedicalDebt = "medicalDebt",
  OtherDebt = "otherDebt",
}

export interface CategoriesResponse {
  data: {
    category_groups: CategoryGroupWithCategories[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface CategoryResponse {
  data: {
    category: Category;
  };
}

export type CategoryGroupWithCategories = CategoryGroup & {
  /** Category group categories.  Amounts (budgeted, activity, balance, etc.) are specific to the current budget month (UTC). */
  categories: Category[];
};

export interface CategoryGroup {
  /** @format uuid */
  id: string;
  name: string;
  /** Whether or not the category group is hidden */
  hidden: boolean;
  /** Whether or not the category group has been deleted.  Deleted category groups will only be included in delta requests. */
  deleted: boolean;
}

export interface Category {
  /** @format uuid */
  id: string;
  /** @format uuid */
  category_group_id: string;
  name: string;
  /** Whether or not the category is hidden */
  hidden: boolean;
  /**
   * If category is hidden this is the id of the category group it originally belonged to before it was hidden.
   * @format uuid
   */
  original_category_group_id?: string;
  note?: string;
  /**
   * Budgeted amount in milliunits format
   * @format int64
   */
  budgeted: number;
  /**
   * Activity amount in milliunits format
   * @format int64
   */
  activity: number;
  /**
   * Balance in milliunits format
   * @format int64
   */
  balance: number;
  /** The type of goal, if the category has a goal (TB='Target Category Balance', TBD='Target Category Balance by Date', MF='Monthly Funding', NEED='Plan Your Spending') */
  goal_type?: "TB" | "TBD" | "MF" | "NEED" | "DEBT" | "undefined";
  /**
   * The month a goal was created
   * @format date
   */
  goal_creation_month?: string;
  /**
   * The goal target amount in milliunits
   * @format int64
   */
  goal_target?: number;
  /**
   * The original target month for the goal to be completed.  Only some goal types specify this date.
   * @format date
   */
  goal_target_month?: string;
  /**
   * The percentage completion of the goal
   * @format int32
   */
  goal_percentage_complete?: number;
  /**
   * The number of months, including the current month, left in the current goal period.
   * @format int32
   */
  goal_months_to_budget?: number;
  /**
   * The amount of funding still needed in the current month to stay on track towards completing the goal within the current goal period.  This amount will generally correspond to the 'Underfunded' amount in the web and mobile clients except when viewing a category with a Needed for Spending Goal in a future month.  The web and mobile clients will ignore any funding from a prior goal period when viewing category with a Needed for Spending Goal in a future month.
   * @format int64
   */
  goal_under_funded?: number;
  /**
   * The total amount funded towards the goal within the current goal period.
   * @format int64
   */
  goal_overall_funded?: number;
  /**
   * The amount of funding still needed to complete the goal within the current goal period.
   * @format int64
   */
  goal_overall_left?: number;
  /** Whether or not the category has been deleted.  Deleted categories will only be included in delta requests. */
  deleted: boolean;
}

export interface SaveCategoryResponse {
  data: {
    category: Category;
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface PayeesResponse {
  data: {
    payees: Payee[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface PayeeResponse {
  data: {
    payee: Payee;
  };
}

export interface Payee {
  /** @format uuid */
  id: string;
  name: string;
  /** If a transfer payee, the `account_id` to which this payee transfers to */
  transfer_account_id?: string;
  /** Whether or not the payee has been deleted.  Deleted payees will only be included in delta requests. */
  deleted: boolean;
}

export interface PayeeLocationsResponse {
  data: {
    payee_locations: PayeeLocation[];
  };
}

export interface PayeeLocationResponse {
  data: {
    payee_location: PayeeLocation;
  };
}

export interface PayeeLocation {
  /** @format uuid */
  id: string;
  /** @format uuid */
  payee_id: string;
  latitude: string;
  longitude: string;
  /** Whether or not the payee location has been deleted.  Deleted payee locations will only be included in delta requests. */
  deleted: boolean;
}

export interface TransactionsResponse {
  data: {
    transactions: TransactionDetail[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface HybridTransactionsResponse {
  data: {
    transactions: HybridTransaction[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge?: number;
  };
}

export interface PutTransactionWrapper {
  transaction: SaveTransaction;
}

export interface PostTransactionsWrapper {
  transaction?: SaveTransaction;
  transactions?: SaveTransaction[];
}

export type SaveTransaction = SaveTransactionWithOptionalFields;

export interface PatchTransactionsWrapper {
  transactions: SaveTransactionWithId[];
}

export type SaveTransactionWithId = {
  id?: string;
} & SaveTransactionWithOptionalFields;

export interface SaveTransactionWithOptionalFields {
  /** @format uuid */
  account_id?: string;
  /**
   * The transaction date in ISO format (e.g. 2016-12-01).  Future dates (scheduled transactions) are not permitted.  Split transaction dates cannot be changed and if a different date is supplied it will be ignored.
   * @format date
   */
  date?: string;
  /**
   * The transaction amount in milliunits format.  Split transaction amounts cannot be changed and if a different amount is supplied it will be ignored.
   * @format int64
   */
  amount?: number;
  /**
   * The payee for the transaction.  To create a transfer between two accounts, use the account transfer payee pointing to the target account.  Account transfer payees are specified as `tranfer_payee_id` on the account resource.
   * @format uuid
   */
  payee_id?: string;
  /**
   * The payee name.  If a `payee_name` value is provided and `payee_id` has a null value, the `payee_name` value will be used to resolve the payee by either (1) a matching payee rename rule (only if `import_id` is also specified) or (2) a payee with the same name or (3) creation of a new payee.
   * @maxLength 50
   */
  payee_name?: string;
  /**
   * The category for the transaction.  To configure a split transaction, you can specify null for `category_id` and provide a `subtransactions` array as part of the transaction object.  If an existing transaction is a split, the `category_id` cannot be changed.  Credit Card Payment categories are not permitted and will be ignored if supplied.
   * @format uuid
   */
  category_id?: string;
  /** @maxLength 200 */
  memo?: string;
  /** The cleared status of the transaction */
  cleared?: "cleared" | "uncleared" | "reconciled";
  /** Whether or not the transaction is approved.  If not supplied, transaction will be unapproved by default. */
  approved?: boolean;
  /** The transaction flag */
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "undefined";
  /**
   * If specified, the new transaction will be assigned this `import_id` and considered "imported".  We will also attempt to match this imported transaction to an existing "user-entered" transation on the same account, with the same amount, and with a date +/-10 days from the imported transaction date.<br><br>Transactions imported through File Based Import or Direct Import (not through the API) are assigned an import_id in the format: 'YNAB:[milliunit_amount]:[iso_date]:[occurrence]'. For example, a transaction dated 2015-12-30 in the amount of -$294.23 USD would have an import_id of 'YNAB:-294230:2015-12-30:1'.  If a second transaction on the same account was imported and had the same date and same amount, its import_id would be 'YNAB:-294230:2015-12-30:2'.  Using a consistent format will prevent duplicates through Direct Import and File Based Import.<br><br>If import_id is omitted or specified as null, the transaction will be treated as a "user-entered" transaction. As such, it will be eligible to be matched against transactions later being imported (via DI, FBI, or API).
   * @maxLength 36
   */
  import_id?: string;
  /** An array of subtransactions to configure a transaction as a split.  Updating `subtransactions` on an existing split transaction is not supported. */
  subtransactions?: SaveSubTransaction[];
}

export interface SaveSubTransaction {
  /**
   * The subtransaction amount in milliunits format.
   * @format int64
   */
  amount: number;
  /**
   * The payee for the subtransaction.
   * @format uuid
   */
  payee_id?: string;
  /**
   * The payee name.  If a `payee_name` value is provided and `payee_id` has a null value, the `payee_name` value will be used to resolve the payee by either (1) a matching payee rename rule (only if import_id is also specified on parent transaction) or (2) a payee with the same name or (3) creation of a new payee.
   * @maxLength 50
   */
  payee_name?: string;
  /**
   * The category for the subtransaction.  Credit Card Payment categories are not permitted and will be ignored if supplied.
   * @format uuid
   */
  category_id?: string;
  /** @maxLength 200 */
  memo?: string;
}

export interface SaveTransactionsResponse {
  data: {
    /** The transaction ids that were saved */
    transaction_ids: string[];
    /** If a single transaction was specified, the transaction that was saved */
    transaction?: TransactionDetail;
    /** If multiple transactions were specified, the transactions that were saved */
    transactions?: TransactionDetail[];
    /** If multiple transactions were specified, a list of import_ids that were not created because of an existing `import_id` found on the same account */
    duplicate_import_ids?: string[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface TransactionResponse {
  data: {
    transaction: TransactionDetail;
  };
}

export interface TransactionSummary {
  id: string;
  /**
   * The transaction date in ISO format (e.g. 2016-12-01)
   * @format date
   */
  date: string;
  /**
   * The transaction amount in milliunits format
   * @format int64
   */
  amount: number;
  memo?: string;
  /** The cleared status of the transaction */
  cleared: "cleared" | "uncleared" | "reconciled";
  /** Whether or not the transaction is approved */
  approved: boolean;
  /** The transaction flag */
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "undefined";
  /** @format uuid */
  account_id: string;
  /** @format uuid */
  payee_id?: string;
  /** @format uuid */
  category_id?: string;
  /**
   * If a transfer transaction, the account to which it transfers
   * @format uuid
   */
  transfer_account_id?: string;
  /** If a transfer transaction, the id of transaction on the other side of the transfer */
  transfer_transaction_id?: string;
  /** If transaction is matched, the id of the matched transaction */
  matched_transaction_id?: string;
  /** If the transaction was imported, this field is a unique (by account) import identifier.  If this transaction was imported through File Based Import or Direct Import and not through the API, the import_id will have the format: 'YNAB:[milliunit_amount]:[iso_date]:[occurrence]'.  For example, a transaction dated 2015-12-30 in the amount of -$294.23 USD would have an import_id of 'YNAB:-294230:2015-12-30:1'.  If a second transaction on the same account was imported and had the same date and same amount, its import_id would be 'YNAB:-294230:2015-12-30:2'. */
  import_id?: string;
  /**
   * If the transaction was imported, the payee name that was used when importing and before applying any payee rename rules
   * @maxLength 200
   */
  import_payee_name?: string;
  /**
   * If the transaction was imported, the original payee name as it appeared on the statement
   * @maxLength 200
   */
  import_payee_name_original?: string;
  /** Whether or not the transaction has been deleted.  Deleted transactions will only be included in delta requests. */
  deleted: boolean;
}

export type TransactionDetail = TransactionSummary & {
  account_name: string;
  payee_name?: string;
  category_name?: string;
  /** If a split transaction, the subtransactions. */
  subtransactions: SubTransaction[];
};

export type HybridTransaction = TransactionSummary & {
  /** Whether the hybrid transaction represents a regular transaction or a subtransaction */
  type: "transaction" | "subtransaction";
  /** For subtransaction types, this is the id of the parent transaction.  For transaction types, this id will be always be null. */
  parent_transaction_id?: string;
  account_name: string;
  payee_name?: string;
  category_name?: string;
};

export interface PatchMonthCategoryWrapper {
  category: SaveMonthCategory;
}

export interface SaveMonthCategory {
  /**
   * Budgeted amount in milliunits format
   * @format int64
   */
  budgeted: number;
}

export interface TransactionsImportResponse {
  data: {
    /** The list of transaction ids that were imported. */
    transaction_ids: string[];
  };
}

export interface BulkResponse {
  data: {
    bulk: {
      /** The list of Transaction ids that were created. */
      transaction_ids: string[];
      /** If any Transactions were not created because they had an `import_id` matching a transaction already on the same account, the specified import_id(s) will be included in this list. */
      duplicate_import_ids: string[];
    };
  };
}

export interface BulkTransactions {
  transactions: SaveTransaction[];
}

export interface SubTransaction {
  id: string;
  transaction_id: string;
  /**
   * The subtransaction amount in milliunits format
   * @format int64
   */
  amount: number;
  memo?: string;
  /** @format uuid */
  payee_id?: string;
  payee_name?: string;
  /** @format uuid */
  category_id?: string;
  category_name?: string;
  /**
   * If a transfer, the account_id which the subtransaction transfers to
   * @format uuid
   */
  transfer_account_id?: string;
  /** If a transfer, the id of transaction on the other side of the transfer */
  transfer_transaction_id?: string;
  /** Whether or not the subtransaction has been deleted.  Deleted subtransactions will only be included in delta requests. */
  deleted: boolean;
}

export interface ScheduledTransactionsResponse {
  data: {
    scheduled_transactions: ScheduledTransactionDetail[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface ScheduledTransactionResponse {
  data: {
    scheduled_transaction: ScheduledTransactionDetail;
  };
}

export interface ScheduledTransactionSummary {
  /** @format uuid */
  id: string;
  /**
   * The first date for which the Scheduled Transaction was scheduled.
   * @format date
   */
  date_first: string;
  /**
   * The next date for which the Scheduled Transaction is scheduled.
   * @format date
   */
  date_next: string;
  frequency:
    | "never"
    | "daily"
    | "weekly"
    | "everyOtherWeek"
    | "twiceAMonth"
    | "every4Weeks"
    | "monthly"
    | "everyOtherMonth"
    | "every3Months"
    | "every4Months"
    | "twiceAYear"
    | "yearly"
    | "everyOtherYear";
  /**
   * The scheduled transaction amount in milliunits format
   * @format int64
   */
  amount: number;
  memo?: string;
  /** The scheduled transaction flag */
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "undefined";
  /** @format uuid */
  account_id: string;
  /** @format uuid */
  payee_id?: string;
  /** @format uuid */
  category_id?: string;
  /**
   * If a transfer, the account_id which the scheduled transaction transfers to
   * @format uuid
   */
  transfer_account_id?: string;
  /** Whether or not the scheduled transaction has been deleted.  Deleted scheduled transactions will only be included in delta requests. */
  deleted: boolean;
}

export type ScheduledTransactionDetail = ScheduledTransactionSummary & {
  account_name: string;
  payee_name?: string;
  category_name?: string;
  /** If a split scheduled transaction, the subtransactions. */
  subtransactions: ScheduledSubTransaction[];
};

export interface ScheduledSubTransaction {
  /** @format uuid */
  id: string;
  /** @format uuid */
  scheduled_transaction_id: string;
  /**
   * The scheduled subtransaction amount in milliunits format
   * @format int64
   */
  amount: number;
  memo?: string;
  /** @format uuid */
  payee_id?: string;
  /** @format uuid */
  category_id?: string;
  /**
   * If a transfer, the account_id which the scheduled subtransaction transfers to
   * @format uuid
   */
  transfer_account_id?: string;
  /** Whether or not the scheduled subtransaction has been deleted.  Deleted scheduled subtransactions will only be included in delta requests. */
  deleted: boolean;
}

export interface MonthSummariesResponse {
  data: {
    months: MonthSummary[];
    /**
     * The knowledge of the server
     * @format int64
     */
    server_knowledge: number;
  };
}

export interface MonthDetailResponse {
  data: {
    month: MonthDetail;
  };
}

export interface MonthSummary {
  /** @format date */
  month: string;
  note?: string;
  /**
   * The total amount of transactions categorized to 'Inflow: Ready to Assign' in the month
   * @format int64
   */
  income: number;
  /**
   * The total amount budgeted in the month
   * @format int64
   */
  budgeted: number;
  /**
   * The total amount of transactions in the month, excluding those categorized to 'Inflow: Ready to Assign'
   * @format int64
   */
  activity: number;
  /**
   * The available amount for 'Ready to Assign'
   * @format int64
   */
  to_be_budgeted: number;
  /**
   * The Age of Money as of the month
   * @format int32
   */
  age_of_money?: number;
  /** Whether or not the month has been deleted.  Deleted months will only be included in delta requests. */
  deleted: boolean;
}

export type MonthDetail = MonthSummary & {
  /** The budget month categories.  Amounts (budgeted, activity, balance, etc.) are specific to the {month} parameter specified. */
  categories: Category[];
};

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.youneedabudget.com/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title YNAB API Endpoints
 * @version 1.0.0
 * @baseUrl https://api.youneedabudget.com/v1
 *
 * Our API uses a REST based design, leverages the JSON data format, and relies upon HTTPS for transport. We respond with meaningful HTTP response codes and if an error occurs, we include error details in the response body.  API Documentation is at https://api.youneedabudget.com
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * @description Returns authenticated user information
     *
     * @tags User
     * @name GetUser
     * @summary User info
     * @request GET:/user
     * @secure
     */
    getUser: (params: RequestParams = {}) =>
      this.request<UserResponse, ErrorResponse>({
        path: `/user`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  budgets = {
    /**
     * @description Returns budgets list with summary information
     *
     * @tags Budgets
     * @name GetBudgets
     * @summary List budgets
     * @request GET:/budgets
     * @secure
     */
    getBudgets: (
      query?: {
        /** Whether to include the list of budget accounts */
        include_accounts?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<BudgetSummaryResponse, ErrorResponse>({
        path: `/budgets`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single budget with all related entities.  This resource is effectively a full budget export.
     *
     * @tags Budgets
     * @name GetBudgetById
     * @summary Single budget
     * @request GET:/budgets/{budget_id}
     * @secure
     */
    getBudgetById: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BudgetDetailResponse, ErrorResponse>({
        path: `/budgets/${budgetId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns settings for a budget
     *
     * @tags Budgets
     * @name GetBudgetSettingsById
     * @summary Budget Settings
     * @request GET:/budgets/{budget_id}/settings
     * @secure
     */
    getBudgetSettingsById: (budgetId: string, params: RequestParams = {}) =>
      this.request<BudgetSettingsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/settings`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all accounts
     *
     * @tags Accounts
     * @name GetAccounts
     * @summary Account list
     * @request GET:/budgets/{budget_id}/accounts
     * @secure
     */
    getAccounts: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AccountsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/accounts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new account
     *
     * @tags Accounts
     * @name CreateAccount
     * @summary Create a new account
     * @request POST:/budgets/{budget_id}/accounts
     * @secure
     */
    createAccount: (budgetId: string, data: PostAccountWrapper, params: RequestParams = {}) =>
      this.request<AccountResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/accounts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single account
     *
     * @tags Accounts
     * @name GetAccountById
     * @summary Single account
     * @request GET:/budgets/{budget_id}/accounts/{account_id}
     * @secure
     */
    getAccountById: (budgetId: string, accountId: string, params: RequestParams = {}) =>
      this.request<AccountResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/accounts/${accountId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all categories grouped by category group.  Amounts (budgeted, activity, balance, etc.) are specific to the current budget month (UTC).
     *
     * @tags Categories
     * @name GetCategories
     * @summary List categories
     * @request GET:/budgets/{budget_id}/categories
     * @secure
     */
    getCategories: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CategoriesResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/categories`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single category.  Amounts (budgeted, activity, balance, etc.) are specific to the current budget month (UTC).
     *
     * @tags Categories
     * @name GetCategoryById
     * @summary Single category
     * @request GET:/budgets/{budget_id}/categories/{category_id}
     * @secure
     */
    getCategoryById: (budgetId: string, categoryId: string, params: RequestParams = {}) =>
      this.request<CategoryResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/categories/${categoryId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single category for a specific budget month.  Amounts (budgeted, activity, balance, etc.) are specific to the current budget month (UTC).
     *
     * @tags Categories
     * @name GetMonthCategoryById
     * @summary Single category for a specific budget month
     * @request GET:/budgets/{budget_id}/months/{month}/categories/{category_id}
     * @secure
     */
    getMonthCategoryById: (budgetId: string, month: string, categoryId: string, params: RequestParams = {}) =>
      this.request<CategoryResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/months/${month}/categories/${categoryId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a category for a specific month.  Only `budgeted` amount can be updated.
     *
     * @tags Categories
     * @name UpdateMonthCategory
     * @summary Update a category for a specific month
     * @request PATCH:/budgets/{budget_id}/months/{month}/categories/{category_id}
     * @secure
     */
    updateMonthCategory: (
      budgetId: string,
      month: string,
      categoryId: string,
      data: PatchMonthCategoryWrapper,
      params: RequestParams = {},
    ) =>
      this.request<SaveCategoryResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/months/${month}/categories/${categoryId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all payees
     *
     * @tags Payees
     * @name GetPayees
     * @summary List payees
     * @request GET:/budgets/{budget_id}/payees
     * @secure
     */
    getPayees: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PayeesResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payees`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single payee
     *
     * @tags Payees
     * @name GetPayeeById
     * @summary Single payee
     * @request GET:/budgets/{budget_id}/payees/{payee_id}
     * @secure
     */
    getPayeeById: (budgetId: string, payeeId: string, params: RequestParams = {}) =>
      this.request<PayeeResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payees/${payeeId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all payee locations
     *
     * @tags Payee Locations
     * @name GetPayeeLocations
     * @summary List payee locations
     * @request GET:/budgets/{budget_id}/payee_locations
     * @secure
     */
    getPayeeLocations: (budgetId: string, params: RequestParams = {}) =>
      this.request<PayeeLocationsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payee_locations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single payee location
     *
     * @tags Payee Locations
     * @name GetPayeeLocationById
     * @summary Single payee location
     * @request GET:/budgets/{budget_id}/payee_locations/{payee_location_id}
     * @secure
     */
    getPayeeLocationById: (budgetId: string, payeeLocationId: string, params: RequestParams = {}) =>
      this.request<PayeeLocationResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payee_locations/${payeeLocationId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all payee locations for a specified payee
     *
     * @tags Payee Locations
     * @name GetPayeeLocationsByPayee
     * @summary List locations for a payee
     * @request GET:/budgets/{budget_id}/payees/{payee_id}/payee_locations
     * @secure
     */
    getPayeeLocationsByPayee: (budgetId: string, payeeId: string, params: RequestParams = {}) =>
      this.request<PayeeLocationsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payees/${payeeId}/payee_locations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all budget months
     *
     * @tags Months
     * @name GetBudgetMonths
     * @summary List budget months
     * @request GET:/budgets/{budget_id}/months
     * @secure
     */
    getBudgetMonths: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MonthSummariesResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/months`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single budget month
     *
     * @tags Months
     * @name GetBudgetMonth
     * @summary Single budget month
     * @request GET:/budgets/{budget_id}/months/{month}
     * @secure
     */
    getBudgetMonth: (budgetId: string, month: string, params: RequestParams = {}) =>
      this.request<MonthDetailResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/months/${month}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns budget transactions
     *
     * @tags Transactions
     * @name GetTransactions
     * @summary List transactions
     * @request GET:/budgets/{budget_id}/transactions
     * @secure
     */
    getTransactions: (
      budgetId: string,
      query?: {
        /**
         * If specified, only transactions on or after this date will be included.  The date should be ISO formatted (e.g. 2016-12-30).
         * @format date
         */
        since_date?: string;
        /** If specified, only transactions of the specified type will be included. "uncategorized" and "unapproved" are currently supported. */
        type?: "uncategorized" | "unapproved";
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a single transaction or multiple transactions.  If you provide a body containing a `transaction` object, a single transaction will be created and if you provide a body containing a `transactions` array, multiple transactions will be created.  Scheduled transactions cannot be created on this endpoint.
     *
     * @tags Transactions
     * @name CreateTransaction
     * @summary Create a single transaction or multiple transactions
     * @request POST:/budgets/{budget_id}/transactions
     * @secure
     */
    createTransaction: (budgetId: string, data: PostTransactionsWrapper, params: RequestParams = {}) =>
      this.request<SaveTransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates multiple transactions, by `id` or `import_id`.
     *
     * @tags Transactions
     * @name UpdateTransactions
     * @summary Update multiple transactions
     * @request PATCH:/budgets/{budget_id}/transactions
     * @secure
     */
    updateTransactions: (budgetId: string, data: PatchTransactionsWrapper, params: RequestParams = {}) =>
      this.request<SaveTransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Imports available transactions on all linked accounts for the given budget.  Linked accounts allow transactions to be imported directly from a specified financial institution and this endpoint initiates that import.  Sending a request to this endpoint is the equivalent of clicking "Import" on each account in the web application or tapping the "New Transactions" banner in the mobile applications.  The response for this endpoint contains the transaction ids that have been imported.
     *
     * @tags Transactions
     * @name ImportTransactions
     * @summary Import transactions
     * @request POST:/budgets/{budget_id}/transactions/import
     * @secure
     */
    importTransactions: (budgetId: string, params: RequestParams = {}) =>
      this.request<TransactionsImportResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions/import`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single transaction
     *
     * @tags Transactions
     * @name GetTransactionById
     * @summary Single transaction
     * @request GET:/budgets/{budget_id}/transactions/{transaction_id}
     * @secure
     */
    getTransactionById: (budgetId: string, transactionId: string, params: RequestParams = {}) =>
      this.request<TransactionResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions/${transactionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates a single transaction
     *
     * @tags Transactions
     * @name UpdateTransaction
     * @summary Updates an existing transaction
     * @request PUT:/budgets/{budget_id}/transactions/{transaction_id}
     * @secure
     */
    updateTransaction: (
      budgetId: string,
      transactionId: string,
      data: PutTransactionWrapper,
      params: RequestParams = {},
    ) =>
      this.request<TransactionResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions/${transactionId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a transaction
     *
     * @tags Transactions
     * @name DeleteTransaction
     * @summary Deletes an existing transaction
     * @request DELETE:/budgets/{budget_id}/transactions/{transaction_id}
     * @secure
     */
    deleteTransaction: (budgetId: string, transactionId: string, params: RequestParams = {}) =>
      this.request<TransactionResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions/${transactionId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates multiple transactions.  Although this endpoint is still supported, it is recommended to use 'POST /budgets/{budget_id}/transactions' to create multiple transactions.
     *
     * @tags Deprecated
     * @name BulkCreateTransactions
     * @summary Bulk create transactions
     * @request POST:/budgets/{budget_id}/transactions/bulk
     * @secure
     */
    bulkCreateTransactions: (budgetId: string, transactions: BulkTransactions, params: RequestParams = {}) =>
      this.request<BulkResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/transactions/bulk`,
        method: "POST",
        body: transactions,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all transactions for a specified account
     *
     * @tags Transactions
     * @name GetTransactionsByAccount
     * @summary List account transactions
     * @request GET:/budgets/{budget_id}/accounts/{account_id}/transactions
     * @secure
     */
    getTransactionsByAccount: (
      budgetId: string,
      accountId: string,
      query?: {
        /**
         * If specified, only transactions on or after this date will be included.  The date should be ISO formatted (e.g. 2016-12-30).
         * @format date
         */
        since_date?: string;
        /** If specified, only transactions of the specified type will be included. "uncategorized" and "unapproved" are currently supported. */
        type?: "uncategorized" | "unapproved";
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/accounts/${accountId}/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all transactions for a specified category
     *
     * @tags Transactions
     * @name GetTransactionsByCategory
     * @summary List category transactions
     * @request GET:/budgets/{budget_id}/categories/{category_id}/transactions
     * @secure
     */
    getTransactionsByCategory: (
      budgetId: string,
      categoryId: string,
      query?: {
        /**
         * If specified, only transactions on or after this date will be included.  The date should be ISO formatted (e.g. 2016-12-30).
         * @format date
         */
        since_date?: string;
        /** If specified, only transactions of the specified type will be included. "uncategorized" and "unapproved" are currently supported. */
        type?: "uncategorized" | "unapproved";
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HybridTransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/categories/${categoryId}/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all transactions for a specified payee
     *
     * @tags Transactions
     * @name GetTransactionsByPayee
     * @summary List payee transactions
     * @request GET:/budgets/{budget_id}/payees/{payee_id}/transactions
     * @secure
     */
    getTransactionsByPayee: (
      budgetId: string,
      payeeId: string,
      query?: {
        /**
         * If specified, only transactions on or after this date will be included.  The date should be ISO formatted (e.g. 2016-12-30).
         * @format date
         */
        since_date?: string;
        /** If specified, only transactions of the specified type will be included. "uncategorized" and "unapproved" are currently supported. */
        type?: "uncategorized" | "unapproved";
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HybridTransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/payees/${payeeId}/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all scheduled transactions
     *
     * @tags Scheduled Transactions
     * @name GetScheduledTransactions
     * @summary List scheduled transactions
     * @request GET:/budgets/{budget_id}/scheduled_transactions
     * @secure
     */
    getScheduledTransactions: (
      budgetId: string,
      query?: {
        /**
         * The starting server knowledge.  If provided, only entities that have changed since `last_knowledge_of_server` will be included.
         * @format int64
         */
        last_knowledge_of_server?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ScheduledTransactionsResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/scheduled_transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single scheduled transaction
     *
     * @tags Scheduled Transactions
     * @name GetScheduledTransactionById
     * @summary Single scheduled transaction
     * @request GET:/budgets/{budget_id}/scheduled_transactions/{scheduled_transaction_id}
     * @secure
     */
    getScheduledTransactionById: (budgetId: string, scheduledTransactionId: string, params: RequestParams = {}) =>
      this.request<ScheduledTransactionResponse, ErrorResponse>({
        path: `/budgets/${budgetId}/scheduled_transactions/${scheduledTransactionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
