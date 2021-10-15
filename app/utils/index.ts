export function getRadomByteArray(len: number) {
  return Array.from(new Uint8Array(len), () => Math.floor(Math.random() * 256));
}

export function getRadomBytes(len: number) {
  return getRadomByteArray(len).reduce((acc, cv) => (acc += cv.toString(16)), '');
}

export function getRandomAddress() {
  return `0x${getRadomBytes(20)}`;
}
export type ValueOf<T> = T[keyof T];

export function getObjectSetter<T>(obj: any) {
  return function <K extends keyof T>(k: K, v: ValueOf<T>) {
    obj[k] = v;
  };
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
  if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
          return;
      }
      seen.add(value);
  }
  return value;
  };
};

export const lazy = (x: any) => {
  return (() => x)()
}  

export function unsafe_cast<T>(x: any) {
  return (x as any) as T;
}
export const shadow = {
  D3: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  D1: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
};
