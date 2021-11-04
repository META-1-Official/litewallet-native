export type RuleFn = (
  text: string,
  lable: string,
  state: { [k: string]: string },
) => string | null;

const rule = (cond: boolean, errorMsg: string) => (cond ? null : errorMsg);

export const required: RuleFn = (text, name) => rule(text.length > 0, `${name} is required`);

export const same: (cmp: string) => RuleFn = cmp => (text, name, state) =>
  text === state[cmp]
    ? null
    : `${name} is Should match ${cmp.charAt(0).toUpperCase() + cmp.slice(1)}`;
