
const mediumJSONFeed = require('medium-json-feed');

mediumJSONFeed('free-code-camp/latest')
  .then(data => {
    console.log(JSON.stringify(data))
  })
  .catch(data => {
    console.log(JSON.stringify(data))
  });