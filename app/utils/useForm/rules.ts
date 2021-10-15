export type RuleFn = (text: string, lable?: string) => string | null;

const rule = (cond: boolean, errorMsg: string) => (cond ? null : errorMsg);

export const required: RuleFn = (text, name) => rule(text.length > 0, `${name} is required`);
