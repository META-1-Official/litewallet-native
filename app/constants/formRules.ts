//@ts-ignore
import is from 'is_js';

export type RuleFn = (text: string) => string | true | Promise<string | true>;

export const rule = (cond: boolean, errorMsg: string) => (cond ? true : errorMsg);

export const asyncRule = async (fn: () => Promise<boolean>, errorMsg: string) =>
  (await fn()) ? null : errorMsg;

export const required = 'This field is required';

export const lettersOnly: RuleFn = text =>
  rule(/^[a-zA-Z]+$/.test(text), 'This field could contain only english letters');

export const includes =
  (str: string): RuleFn =>
  text =>
    rule(text.includes(str), `This field should include '${str}'`);

export const includeOr =
  (a: string, b: string): RuleFn =>
  text =>
    rule(text.includes(a) || text.includes(b), `This field should include '${a}' or '${b}'`);

export const email = (val: string) => rule(is.email(val), 'This is not a valid email');

const SPECIAL_CHARS_RE = /_|[^.,'"\d\w]/;
export const hasSpecialChars: RuleFn = text =>
  rule(SPECIAL_CHARS_RE.test(text), 'This field should include special characters');

export const minLen =
  (min: number): RuleFn =>
  text =>
    rule(text.length >= min, `This field should be at least ${min} characters long`);

function noRepeatImpl(t: string) {
  const { substrs } = [...t].reduce(
    (acc, cv) => {
      if (acc.prev === cv) {
        acc.substrs[acc.substrs.length - 1] += cv;
      } else {
        acc.substrs.push(cv);
      }
      acc.prev = cv;
      return acc;
    },
    {
      prev: '',
      substrs: [] as string[],
    },
  );

  const aboveThreshold = substrs.filter(e => e.length > 2);

  return aboveThreshold.length !== 1;
}

export const noRepeat: RuleFn = t =>
  rule(noRepeatImpl(t), 'This field should not have repeating characters');

const UPPERCASE_RE = /[A-Z]/;
const LOWERCASE_RE = /[a-z]/;
export const upperAndLowerCase: RuleFn = t =>
  rule(
    UPPERCASE_RE.test(t) && LOWERCASE_RE.test(t),
    'This field should have both upper and lower case letters',
  );
export const noSpace: RuleFn = t =>
  rule(t.indexOf(' ') === -1, 'This field should not have any spaces');
