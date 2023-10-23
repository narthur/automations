// https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get
export type SearchInput = {
  query: string;
  idBoards?: string;
  idOrganizations?: string;
  idCards?: string;
  modelTypes?: string;
  board_fields?: string;
  boards_limit?: number;
  board_organization?: boolean;
  card_fields?: string;
  cards_limit?: number;
  cards_page?: number;
  card_board?: boolean;
  card_list?: boolean;
  card_members?: boolean;
  card_stickers?: boolean;
  card_attachments?: string;
  organization_fields?: string;
  organizations_limit?: number;
  member_fields?: string;
  members_limit?: number;
  partial?: boolean;
};
