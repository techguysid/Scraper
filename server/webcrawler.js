'use strict';
const Promise = require('bluebird');
const Scraper = require('./scraper');
const _array = require('lodash/array');

/**
 * Spider Class Definition
 */
class WebCrawler {
  constructor(maxPages,maxRequests) {
    this.hyperlinks = [];
    this.hyperlinks_crawled = {};
    this.totalSizeCrawled = 0;
    this.refIndexChunk = 0;
    this.maxPages = maxPages;
    this.maxRequests = maxRequests;
  }

  crawl(url) {

    return this.crawlEach(url)
      .then(() => this.divideAndCrawl())
      .then(() => ({ hyperlinks: this.hyperlinks, hyperlinks_crawled: this.hyperlinks_crawled }));
  }

  crawlEach(url) {
    const isMediumLink = url.startsWith('https://medium.com');
    if (this.hyperlinks_crawled[url] || this.totalSizeCrawled >= this.maxPages
      || !isMediumLink) {
      return Promise.resolve([]);
    }
    return Scraper.getAllHyperlinks(url)
      .tap(() => this.hyperlinks_crawled[url] = true)
      .tap(() => this.totalSizeCrawled++)
      .then(urlObjects => this.hyperlinks = this.hyperlinks.concat(urlObjects))
  }
  //divide all the hyperlinks and then crawl them
  divideAndCrawl() {
    const chunks = _array.chunk(this.hyperlinks, this.maxRequests);
    if (this.refIndexChunk >= chunks.length) return Promise.resolve();
    return Promise.map(chunks[this.refIndexChunk++], item => this.crawlEach(item.link))
      .then(() => this.divideAndCrawl());
  }

}

module.exports = WebCrawler;
