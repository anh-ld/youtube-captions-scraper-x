## About

> Fetch youtube captions or fallback to auto-generated captions

> Based on [youtube-captions-scraper](https://github.com/algolia/youtube-captions-scraper), I made a little change to make it now supports both **original** and **user-submitted caption**

## Installation

* `> npm install -S youtube-captions-scraper` OR
* `> yarn add youtube-captions-scraper`

## Usage

```js
// ES6 / TypeScript
import { getSubtitles } from 'youtube-captions-scraper';

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(captions => {
  console.log(captions);
});

// ES5
var getSubtitles = require('youtube-captions-scraper').getSubtitles;

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(function(captions) {
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
