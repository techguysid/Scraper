const _array = require('lodash/array');
const spider = require('./webcrawler');
//use require('./webcrawler_async') above to run asyncly
const convert = require('./convert-to-csv');
const config = require('./config/dev-config')

const TARGET_URL = config.targetURL;
const MAX_CONCURRENT_REQUESTS = config.maxConcurrency;
const PAGES_TO_CRAWL = config.targetPages;
const OUTPUT_CSV_FILE = config.outputFile;

const s = new spider(PAGES_TO_CRAWL, MAX_CONCURRENT_REQUESTS); //invoke Spider constructor and set pre-configured values
console.log("Crawling starts");


//comment line 17-26 while running asyncly
s.crawl(TARGET_URL) //call crawl method defined in Spider class

//on promise resolve  //using arrow functions as defined in ES6
.then((result) => {
  const links = { crawledUrls: result.hyperlinks_crawled };
  links.hyperlinks = _array.uniqBy(result.hyperlinks, 'link');
  return links;
 })
 //finally generate the csv
 .then(result => convert.writeToFile(OUTPUT_CSV_FILE, result.hyperlinks));


// un-comment this code to run asyncly
// s.crawl(TARGET_URL, (err, result) => {
//   const links = { crawledUrls: result.hyperlinks_crawled };
//   links.hyperlinks = _array.uniqBy(result.hyperlinks, 'link');
//   convert.writeToFile(OUTPUT_CSV_FILE, result.hyperlinks);
// });
