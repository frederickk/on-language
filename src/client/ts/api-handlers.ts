/**
 * @fileoverview Handlers for events.
 */

import * as log from '../../globals/log';

/**
 * Fetches requests from given endpoint of ChatGPTAPI intermediate server.
 * @param endpoint  endpoint for request type
 * @param message   optional body message
 */
export const chatAPIFetch = async (endpoint: string, message: string = ''):
    Promise<Response | undefined> => {
  return await fetch(`http://localhost:3000/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    }),
  });
};

/**
 * Handles message responses from intermediate ChatGPTAPI server.
 * @param endpoint  endpoint for request type
 * @param message   body message
 */
export const chatAPIResponseHandler = async (endpoint: string, message: string):
    Promise<string | null> => {
  log.group(`awaiting response... ${endpoint}`, `"${message}"`);

  const chat = await chatAPIFetch(endpoint, message)
    .catch((error) => {
      log.warn(error);
    });
  const json = await chat?.json();

  return json?.response;
};

