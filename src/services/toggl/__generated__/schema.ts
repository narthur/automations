import type * as Types from "../../../__generated__/graphql";
export namespace TogglModule {
  interface DefinedFields {
    TimeEntry: 'at' | 'billable' | 'description' | 'duration' | 'duronly' | 'id' | 'pid' | 'projectId' | 'serverDeletedAt' | 'start' | 'stop' | 'tagIds' | 'tags' | 'taskId' | 'tid' | 'uid' | 'userId' | 'wid' | 'workspaceId';
    Me: 'apiToken' | 'at' | 'beginningOfWeek' | 'countryId' | 'createdAt' | 'defaultWorkspaceId' | 'email' | 'fullname' | 'hasPassword' | 'id' | 'imageUrl' | 'intercomHash' | 'oauthProviders' | 'openidEmail' | 'openidEnabled' | 'timezone' | 'togglAccountsId' | 'updatedAt';
    Query: 'togglMe' | 'togglTimeEntries';
  };
  
  export type TimeEntry = Pick<Types.TimeEntry, DefinedFields['TimeEntry']>;
  export type Me = Pick<Types.Me, DefinedFields['Me']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  
  export type TimeEntryResolvers = Pick<Types.TimeEntryResolvers, DefinedFields['TimeEntry'] | '__isTypeOf'>;
  export type MeResolvers = Pick<Types.MeResolvers, DefinedFields['Me'] | '__isTypeOf'>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  
  export interface Resolvers {
    TimeEntry?: TimeEntryResolvers;
    Me?: MeResolvers;
    Query?: QueryResolvers;
  };
}