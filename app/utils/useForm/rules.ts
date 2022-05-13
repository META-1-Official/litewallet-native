//@ts-ignore
import is from 'is_js';

export type RuleFn = (
  text: string,
  lable: string,
  state: { [k: string]: string },
) => string | null | Promise<string | null>;

export const rule = (cond: boolean, errorMsg: string) => (cond ? null : errorMsg);

export const asyncRule = async (fn: () => Promise<boolean>, errorMsg: string) =>
  (await fn()) ? null : errorMsg;

export const required: RuleFn = (text, name) => rule(text.length > 0, `${name} is required`);

export const lettersOnly: RuleFn = (text, name) =>
  rule(/^[a-zA-Z]+$/.test(text), `${name} could contain only english letters`);

export const same: (cmp: string) => RuleFn = cmp => (text, name, state) =>
  text === state[cmp]
    ? null
    : `${name} should match ${cmp.charAt(0).toUpperCase() + cmp.slice(1)}`;

export const includes =
  (str: string): RuleFn =>
  (text, name) =>
    rule(text.includes(str), `${name} should include '${str}'`);

export const includeOr =
  (a: string, b: string): RuleFn =>
  (text, name) =>
    rule(text.includes(a) || text.includes(b), `${name} should include '${a}' or '${b}'`);

export const email: RuleFn = (text, name) => rule(is.email(text), `${name} is not a valid email`);

const SPECIAL_CHARS_RE = /_|[^.,'"\d\w]/;
export const hasSpecialChars: RuleFn = (text, name) =>
  rule(SPECIAL_CHARS_RE.test(text), `${name} should include special characters`);

export const minLen =
  (min: number): RuleFn =>
  (text, name) =>
    rule(text.length >= min, `${name} should be at least ${min} characters long`);
