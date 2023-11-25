import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Toggl me */
export type Me = {
  __typename?: 'Me';
  apiToken: Maybe<Scalars['String']['output']>;
  at: Maybe<Scalars['String']['output']>;
  beginningOfWeek: Maybe<Scalars['Int']['output']>;
  countryId: Maybe<Scalars['Int']['output']>;
  createdAt: Maybe<Scalars['String']['output']>;
  defaultWorkspaceId: Maybe<Scalars['Int']['output']>;
  email: Maybe<Scalars['String']['output']>;
  fullname: Maybe<Scalars['String']['output']>;
  hasPassword: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  intercomHash: Maybe<Scalars['String']['output']>;
  oauthProviders: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  openidEmail: Maybe<Scalars['String']['output']>;
  openidEnabled: Maybe<Scalars['Boolean']['output']>;
  timezone: Maybe<Scalars['String']['output']>;
  togglAccountsId: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['String']['output']>;
};

/** Toggl queries */
export type Query = {
  __typename?: 'Query';
  togglMe: Maybe<Me>;
  togglTimeEntries: Array<TimeEntry>;
};

/**
 * Toggl time entry
 * https://developers.track.toggl.com/docs/api/time_entries
 */
export type TimeEntry = {
  __typename?: 'TimeEntry';
  at: Scalars['String']['output'];
  billable: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  /** In seconds. Time entry duration. For running entries should be negative, preferable -1 */
  duration: Scalars['Int']['output'];
  duronly: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** Project ID, legacy field */
  pid: Scalars['Int']['output'];
  /** Project ID. Can be null if project was not provided or project was later deleted */
  projectId: Maybe<Scalars['Int']['output']>;
  serverDeletedAt: Scalars['String']['output'];
  /** Start time in UTC */
  start: Scalars['String']['output'];
  /** Stop time in UTC, can be null if it's still running or created with "duration" and "duronly" fields */
  stop: Maybe<Scalars['String']['output']>;
  tagIds: Array<Scalars['Int']['output']>;
  tags: Array<Scalars['String']['output']>;
  taskId: Scalars['Int']['output'];
  tid: Scalars['Int']['output'];
  uid: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
  wid: Scalars['Int']['output'];
  workspaceId: Scalars['Int']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Me: ResolverTypeWrapper<Me>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TimeEntry: ResolverTypeWrapper<TimeEntry>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Me: Me;
  Query: {};
  String: Scalars['String']['output'];
  TimeEntry: TimeEntry;
};

export type MeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  apiToken: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  at: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  beginningOfWeek: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  countryId: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  defaultWorkspaceId: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullname: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasPassword: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  intercomHash: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oauthProviders: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  openidEmail: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  openidEnabled: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  timezone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  togglAccountsId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  togglMe: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  togglTimeEntries: Resolver<Array<ResolversTypes['TimeEntry']>, ParentType, ContextType>;
};

export type TimeEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeEntry'] = ResolversParentTypes['TimeEntry']> = {
  at: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  billable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  duronly: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pid: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serverDeletedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  start: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stop: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tagIds: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  tags: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  taskId: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tid: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uid: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wid: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  workspaceId: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Me: MeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  TimeEntry: TimeEntryResolvers<ContextType>;
};

