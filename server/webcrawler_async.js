'use strict';
const _array = require('lodash/array');
const async = require('async');
const Scraper = require('./scraper');

class AsyncWebCrawler {

  constructor(maxPages,maxRequests) {
    this.hyperlinks = [];
    this.hyperlinks_crawled = {};
    this.totalSizeCrawled = 0;
    this.refIndexChunk = 0;
    this.maxPages = maxPages;
    this.maxRequests = maxRequests;
  }

  crawl(url,callback) {
    async.waterfall([
      cb => this.crawlEach(url, cb),
      cb => this.divideAndCrawl(cb),
    ], err => {
      if (err) return callback(err);
      return callback(null,{ hyperlinks: this.hyperlinks, hyperlinks_crawled: this.hyperlinks_crawled });
    });
  }
  crawlEach(url,callback) {
    const isMediumLink = url.startsWith('https://medium.com');
    if (this.hyperlinks_crawled[url] || this.totalSizeCrawled >= this.maxPages || !isMediumLink) {
      return callback();
    }
    async.waterfall([
      cb => Scraper.getAllHyperlinks(url, cb),
      (urlObjects, cb) => {
        this.hyperlinks_crawled[url] = true;
        this.totalSizeCrawled++;
        this.hyperlinks = this.hyperlinks.concat(urlObjects);
        cb();
      },
    ], err => callback(err));
    return undefined;
  }
  divideAndCrawl(cb) {
    const chunks = _array.chunk(this.hyperlinks, this.maxRequests);
    if (this.refIndexChunk >= chunks.length) return cb(null, undefined);

    async.map(chunks[this.refIndexChunk++],(item, callback) => this.crawlEach(item.link, callback),
      err => {
        if (err) return cb(err);
        return this.divideAndCrawl(cb);
      }
    );
  }

}

module.exports = AsyncWebCrawler;
