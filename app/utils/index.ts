export function getRadomByteArray(len: number) {
  return Array.from(new Uint8Array(len), () => Math.floor(Math.random() * 256));
}

export function getRadomBytes(len: number) {
  return getRadomByteArray(len).reduce((acc, cv) => (acc += cv.toString(16)), '');
}

export function getRandomAddress() {
  return `0x${getRadomBytes(20)}`;
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
