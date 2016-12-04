'use strict';
const Promise = require('bluebird');
const scraperjs = require('scraperjs');  // to implement the scraping part, scraping thr webpage to find links
const _array = require('lodash/array');
const _string = require('lodash/string');


class Scraper {
  //function to find all the links on a given page
  static getAllHyperlinks(url) {
    return Promise.resolve(
      scraperjs.StaticScraper
        .create(url)
        .scrape(Scraper.extractHyperlink)
    )
      .then(data => _array.uniqBy(data, 'link'));
  }
  //extracting the link part using jquery : jquery object ($)
  static extractHyperlink($) {
    return $('a').map(function extractLink() {
      const link = Scraper.prefixUrl($(this).attr('href'));
      return { link, text: $(this).text() };
    }).get();
  }

  static prefixUrl(url) {
    const prefix = url.startsWith('//') ? `https:${url}` : url;  //add a https: prefix to url if it doesnt have one
    //console.log(prefix); //for debugging
    const noHash = prefix.split('#')[0];
    return _string.trimEnd(noHash, '/');
  }

}

module.exports = Scraper;
