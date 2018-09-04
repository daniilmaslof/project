/**
 *  type User use in state.
 */
export type Data = {
  editor: Editor;
  outputHtml: string;
  variables: Map<string, string>;
};
export type Editor = {
  html: string;
};

/**
 *  Create user.
 */
export function createUser({editor = {html: ''}, outputHtml = '', variables = new Map()}: Partial<Data>): Data {
  return {
    editor,
    outputHtml,
    variables,
  } as Data;
}
