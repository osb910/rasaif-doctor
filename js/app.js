import {getSettings, genMatchStyle} from './util.js';

export const fixMainPage = tabId => {
  try {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/main-page-fix.css'],
    });

    chrome.scripting.executeScript({
      target: {tabId},
      files: ['./doctor-js/controllers/main-page-fix.js'],
    });
  } catch (err) {
    console.log(err);
  }
};

export const fixAboutPage = tabId => {
  try {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/about-page-fix.css'],
    });

    chrome.scripting.executeScript({
      target: {tabId},
      files: ['./doctor-js/controllers/about-page-fix.js'],
    });
  } catch (err) {
    console.log(err);
  }
};

export const fixContactPage = tabId => {
  try {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/contact-page-fix.css'],
    });
  } catch (err) {
    console.log(err);
  }
};

export const fixLataifPage = tabId => {
  try {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/lataif-page-fix.css'],
    });
  } catch (err) {
    console.log(err);
  }
};

export const fixSearchResults = async tabId => {
  try {
    const highlightColor =
      (await getSettings(['highlightColor'])).highlightColor || '#aa8c3c';
    console.log(highlightColor);
    chrome.scripting.insertCSS({
      target: {tabId},
      files: [
        './doctor-css/results-page-fix.css',
        './doctor-css/segment-card-fix.css',
      ],
    });

    chrome.scripting.insertCSS({
      target: {tabId},
      css: genMatchStyle(highlightColor),
    });

    chrome.scripting.executeScript({
      target: {tabId},
      files: [
        // views
        './doctor-js/views/segment.js',
        './doctor-js/views/search.js',
        // util
        './doctor-js/util/arabizeCount.js',
        // controllers
        './doctor-js/controllers/results-page-fix.js',
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

export const fixSingleSegmentPage = tabId => {
  try {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/segment-card-fix.css'],
    });

    chrome.scripting.executeScript({
      target: {tabId},
      files: [
        // views
        './doctor-js/views/segment.js',
        // controllers
        './doctor-js/controllers/single-segment-page-fix.js',
      ],
    });
  } catch (err) {
    console.log(err);
  }
};
