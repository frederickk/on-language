import {NAME, VERSION} from '../globals';

const STYLE = {
  default: 'background-color:black;border-radius:1em;white;font-weight:700;padding:0 1ch;',
  error: 'background-color:red;border-radius:1em;white;font-weight:700;padding:0 1ch;',
  warning: 'background-color:yellow;border-radius:1em;black;font-weight:700;padding:0 1ch;',
};

/**
 * Groups console log messages.
 */
export const group = (title?: any, message?: any) => {
  console.groupCollapsed(title);
  if (Array.isArray(message)) {
    message.forEach((m: any) => log(m));
  } else {
    log(message);
  }
  console.groupEnd();
};

/**
 * Console log error messages with stylized app name.
 */
export const error = (message?: any) => {
  console.error(`%c${NAME} v${VERSION}`, STYLE.error, message);
};

/**
 * Console log messages with stylized app name.
 */
export const log = (message?: any) => {
  console.log(`%c${NAME} v${VERSION}`, STYLE.default, message);
};

/**
 * Console log warning messages with stylized app name.
 */
export const warn = (message?: any) => {
  console.warn(`%c${NAME} v${VERSION}`, STYLE.warning, message);
};
