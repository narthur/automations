export type ForceReply = {
  force_reply: true; // Shows reply interface to the user
  input_field_placeholder?: string; // Optional. The placeholder to be shown in the input field when the reply is active.
  selective?: boolean; // Optional. Use this parameter to force a reply from specific users only. Defaults to false.
};
