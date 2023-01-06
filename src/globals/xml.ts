/**
 * @fileoverview XML Utility methods.
 */

import {XMLParser} from 'fast-xml-parser';
import xmlFormat from 'xml-formatter';
import * as log from './log';

/** Prettifies string of XML markup. */
export const formatXML = (xml: string, elem: HTMLTextAreaElement) => {
  const formattedXML = xmlFormat(xml, {
    indentation: '  ',
    filter: (node) => node.type !== 'Comment',
    collapseContent: true,
    lineSeparator: '\n'
  });
  elem.dataset.data = formattedXML;
  elem.value = formattedXML;
};

/** Parses XML into JSON. */
export const parseXML = (xml: string, options: any = {}): any => {
  const parser = new XMLParser(options);
  return parser.parse(xml);
}

/** Converts XML markup into a valid JSON object. */
export const XMLtoJSON = (xml: string) => {
  let data: any = {};
  try {
    data = parseXML(xml);
    log.log(data);
  } catch (err) {
    log.warn(err);
  }

  return data;
}
