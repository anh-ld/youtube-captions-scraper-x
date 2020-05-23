## About

Fetch *original* or fallback to *auto-generated* **Youtube** captions.
Based on the original [youtube-captions-scraper](https://github.com/algolia/youtube-captions-scraper), I made a little change to make it supports not only *user-submitted* but also the *original* captions.

## Installation

* `npm i youtube-captions-scraper-x`

## Usage

```js
import { getSubtitles } from 'youtube-captions-scraper';

getSubtitles({ videoID: 'mw5VIEIvuMI', lang: 'ja' })
  .then(captions => {
    console.log(captions);
  });
```

Captions will be an array of object of this format:

```js
{
  "start": Number,
  "duration": Number,
  "text": String
}
```
