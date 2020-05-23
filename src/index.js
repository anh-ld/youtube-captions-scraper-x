/* @flow */

import he from 'he';
import striptags from 'striptags';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

type SubtitleOption = {
  videoID: string,
  lang: 'en' | 'de' | 'fr' | void,
};

export async function getSubtitles({ videoID, lang = 'en' }: SubtitleOption) {
  const dom = await JSDOM.fromURL(
    `https://youtube.com/watch?v=${videoID}&persist_app=1&app=m`
  );

  const serializedDom = dom.serialize();

  // * ensure we have access to captions data
  if (!serializedDom.includes('captionTracks'))
    throw new Error(`Could not find captions for video: ${videoID}`);

  const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
  const [match] = regex.exec(serializedDom);
  const { captionTracks } = JSON.parse(`${match}}`);

  const subtitle =
    captionTracks.find(cap => cap.vssId && cap.vssId === `.${lang}`) ||
    captionTracks.find(cap => cap.vssId && cap.vssId === `a.${lang}`) ||
    captionTracks.find(cap => cap.vssId && cap.vssId.match(`.${lang}`));

  // * ensure we have found the correct subtitle lang
  if (!subtitle || (subtitle && !subtitle.baseUrl))
    throw new Error(`Could not find ${lang} captions for ${videoID}`);

  const xmlData = await fetch(`https://www.youtube.com${subtitle.baseUrl}`);
  const transcript = await xmlData.text();

  const lines = transcript
    .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
    .replace('</transcript>', '')
    .split('</text>')
    .filter(line => line && line.trim())
    .map(line => {
      const startRegex = /start="([\d.]+)"/;
      const durationRegex = /dur="([\d.]+)"/;

      const [, start] = startRegex.exec(line);
      const [, duration] = durationRegex.exec(line);

      const htmlText = line
        .replace(/<text.+>/, '')
        .replace(/&amp;/gi, '&')
        .replace(/<\/?[^>]+(>|$)/g, '');

      const decodedText = he.decode(htmlText);
      const text = striptags(decodedText);

      return { start, duration, text };
    });

  return lines;
}
