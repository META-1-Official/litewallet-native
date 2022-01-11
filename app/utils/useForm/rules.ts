//@ts-ignore
import is from 'is_js';

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

export const includes =
  (str: string): RuleFn =>
  (text, name) =>
    rule(text.includes(str), `${name} should include '${str}'`);
export const includeOr =
  (a: string, b: string): RuleFn =>
  (text, name) =>
    rule(text.includes(a) || text.includes(b), `${name} should include '${a}' or '${b}'`);

export const email: RuleFn = (text, name) => rule(is.email(text), `${name} is not a valid email`);
