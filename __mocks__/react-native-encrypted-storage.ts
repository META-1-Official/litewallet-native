/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

type StateStorage = {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
};

export default {
  getItem: function (name) {
    return Promise.resolve('');
  },

  setItem: function (name) {
    return Promise.resolve();
  },
} as StateStorage;
