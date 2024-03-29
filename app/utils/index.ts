import assert from 'assert';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertType,
  Dimensions,
  ImageStyle,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import prompt from 'react-native-prompt-android';
import * as Sentry from '@sentry/react-native';
import { ErrorParser, isError } from './errorUtils';

export function getRadomByteArray(len: number) {
  return Array.from(new Uint8Array(len), () => Math.floor(Math.random() * 256));
}

export function getRadomBytes(len: number) {
  return getRadomByteArray(len).reduce((acc, cv) => (acc += cv.toString(16)), '');
}

export function getRandomAddress() {
  return `0x${getRadomBytes(20)}`;
}

export function getObjectSetter<T>(obj: any) {
  return function <K extends keyof T>(k: K, v: ValueOf<T>) {
    obj[k] = v;
  };
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const dumpObjInterface = (_obj: any) => {
  const _dumpObjIface = (obj: any): string => {
    if (obj === null) {
      console.error('Not an object');
      return 'null';
    }
    const keys = Object.keys(obj);
    console.log('keys', keys, obj);
    let lines = [];

    const arrayDump = (k: string, v: any[]): any => {
      const target = v;

      if (!target.length) {
        return;
      }

      const baseT = typeof target[0];
      const isTypeUniform = target
        .map(e => typeof e)
        .map((e, _, arr) => arr.reduce((acc, cv) => e === cv && acc, true))
        .reduce((acc, cv) => acc && cv);

      if (!isTypeUniform) {
        // Will fuck up on non uniform objects, but who cares
        lines.push(`  ${k}: any[]; // Nonuniformly typed array`);
        return;
      }

      switch (baseT) {
        case 'object':
          lines.push(`  ${k}: ${_dumpObjIface(v)}[];`);
          return;
        case 'string':
          lines.push(`  ${k}: ${baseT}[];`);
          return;

        case 'number':
          lines.push(`  ${k}: ${baseT}[];`);
          return;

        case 'boolean':
          lines.push(`  ${k}: ${baseT}[];`);
          return;

        default:
          lines.push(`  ${k}: any[];`);
          return;
      }
    };

    for (const k of keys) {
      console.log('kkkkkk', k);
      switch (typeof obj[k]) {
        case 'object':
          if (Array.isArray(obj[k])) {
            arrayDump(k, obj[k] as any[]);
          } else {
            lines.push(`  ${k}: ${_dumpObjIface(obj[k])};`);
          }
          break;
        case 'symbol':
          lines.push(`  ${k}: any; // typeof returned Symbol`);
          break;
        case 'function':
          lines.push(`  ${k}: (...args: any[]) => any; // Generic Fn`);
          break;
        default:
          lines.push(`  ${k}: ${typeof obj[k]};`);
          break;
      }
    }

    return `{\n${lines.join('\n')}\n}`;
  };

  return `interface XXXX ${_dumpObjIface(_obj)}`;
};

export const lazy = (x: any) => {
  return (() => x)();
};

export function unsafe_cast<T>(x: any) {
  return x as any as T;
}

export function ensure<T>(argument: T | undefined | null): T {
  assert(argument !== undefined, 'Expected value, got undefined');
  assert(argument !== null, 'Expected value, got null');
  return argument;
}

export type ValueOf<T> = T[keyof T];
export type ArrayMap<K, V> = [K, V][];

export function join<A, B>(a: A[], b: B[]): (A & B)[] {
  assert(a.length === b.length);

  return a.map((_, i) => ({ ...a[i], ...b[i] }));
}

// Ghetto polyfiling array at
// eslint-disable-next-line no-extend-native
Array.prototype.at = function (index: number) {
  if (this.length < index || this.length === 0) {
    return undefined;
  }

  if (index < 0) {
    const i = this.length - index;
    if (i < 0 || i < this.length) {
      return undefined;
    }
  }

  return this[index];
};
export const inFuture = (d: Date | string) => {
  if (typeof d === 'string') {
    d = new Date(d);
  }
  return d.getTime() > new Date().getTime();
};

export const Timeout = (fn: Promise<any>, message: string) =>
  Promise.race([
    fn,
    new Promise((resolve, reject) =>
      setTimeout(() => reject('Promise timeout: ' + message), 30000),
    ),
  ]);

/** Not exactly deepEquals but good enought */
export const jsonEquals = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

type params = {
  anyway?: () => void;
  onErr?: (e: unknown) => void;
  errorMiddleware?: (e: any) => any;
};
// Jank
export const catchError = async (fn: () => void, params?: params) => {
  const { anyway, onErr, errorMiddleware } = params || {};
  try {
    await fn();
  } catch (e) {
    const oErr = e;
    console.log('oError', oErr);

    if (isError(e)) {
      if (onErr?.(e)) {
        return anyway?.();
      }

      let err = ErrorParser(e);

      if (errorMiddleware) {
        err = errorMiddleware(e);
      }

      Sentry.setTag('isExpected', true);
      Sentry.addBreadcrumb({
        category: 'expected',
        message: (e as any).message,
        level: Sentry.Severity.Info,
      });
      Sentry.captureException(oErr);

      console.error(err);
      Alert.alert('Error', err.message);
    } else {
      Alert.alert('Error', 'Something went wrong');
      onErr?.({ message: 'Unknown error', originalError: e });
      Sentry.captureException(e);
    }
  }
  anyway?.();
};

export const promptPromise = (
  title: string,
  msg: string,
  type?: AlertType,
): Promise<string | null> =>
  new Promise((resolve, reject) => {
    prompt(
      title,
      msg,
      [
        { text: 'Cancel', onPress: () => resolve(null) },
        { text: 'Ok', onPress: t => (t ? resolve(t) : reject(new Error('Password is required'))) },
      ],
      { type },
    );
  });

type AllStyles = ViewStyle | TextStyle | ImageStyle;
interface PlatformSpecific {
  ios?: AllStyles;
  android?: AllStyles;
}
export const style = (common: AllStyles, specific: PlatformSpecific) => {
  if (Platform.OS === 'ios') {
    return { ...common, ...(specific.ios || {}) };
  } else if (Platform.OS === 'android') {
    return { ...common, ...(specific.android || {}) };
  }
  return {};
};

export const excludeIndex = <T>(arr: T[], idx: number) =>
  arr.reduce<T[]>((r, v, i) => (i === idx ? r : [...r, v]), []);

export const useScroll = (noKeyboardEvents = false) => {
  const onLayout: (_: LayoutChangeEvent) => void = _layout => {
    const { height, fontScale } = Dimensions.get('window');
    if (height < 700) {
      setScrollEnabled(true);
      setOld(true);
    } else if (Platform.OS === 'android' && fontScale > 1) {
      setScrollEnabled(true);
      setOld(true);
    }
  };

  const ref = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [old, setOld] = useState(false);

  useEffect(() => {
    if (noKeyboardEvents) {
      return;
    }

    const listeners = [
      Keyboard.addListener('keyboardDidShow', () => {
        setOld(scrollEnabled);
        setScrollEnabled(true);
      }),
      Keyboard.addListener('keyboardDidHide', () => {
        setScrollEnabled(old);
        if (!old) {
          const scv = ref.current! as ScrollView;
          scv.scrollTo({
            x: 0,
            y: 0,
            animated: true,
          });
        }
      }),
    ];

    return () => listeners.forEach(e => e.remove());
  }, [old, scrollEnabled]);

  return {
    onLayout,
    scrollEnabled,
    ref: ref as any,
    contentContainerStyle: {
      paddingBottom: 200,
    },
  };
};

export const tid = (_s: string) =>
  (s => ({ testID: s, accessibilityLabel: s }))(_s.replace(/\s+/gm, '_'));

export const getPassword = async () =>
  await promptPromise('Enter password', 'Password is required for this operation', 'secure-text');

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
    // background color must be set
    backgroundColor: '#0000', // invisible color
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
    // background color must be set
    backgroundColor: '#0000', // invisible color
  },
};
