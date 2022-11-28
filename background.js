import {
  fixAboutPage,
  fixMainPage,
  fixContactPage,
  fixLataifPage,
  fixBookPage,
  fixSearchResults,
  fixSingleSegmentPage,
} from './js/app.js';

// "icons": {
//   "16": "icon16.png",
//   "32": "icon32.png",
//   "48": "icon48.png",
//   "128": "icon128.png"
// },

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const {hostname, search} = new URL(tab.url);
  const isRasaif = hostname === 'rasaif.com';
  const isMainPage = search === '';
  const isSearchResults = /page_id=(?:4095|17509)/.test(search);
  const isAboutPage = /page_id=4074/.test(search);
  const isContactPage = /page_id=4077/.test(search);
  const isLataifPage = /page_id=40194/.test(search);
  const isBookPage = /cat=\d+/.test(search);
  const isSingleSegment = /p=\d+/.test(search);
  console.log(`loading status: ${changeInfo.status}`);

  if (!isRasaif) return;

  if (changeInfo.status === 'loading') {
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['./doctor-css/general-fix.css'],
    });

    chrome.scripting.executeScript({
      target: {tabId},
      files: [
        './doctor-js/util/general-util.js',
        './doctor-js/util/doctor-util.js',
        './doctor-js/general-fix.js',
      ],
    });

    isMainPage && fixMainPage(tabId);

    isAboutPage && fixAboutPage(tabId);

    isContactPage && fixContactPage(tabId);

    isLataifPage && fixLataifPage(tabId);

    isBookPage && fixBookPage(tabId);

    isSearchResults && fixSearchResults(tabId);

    isSingleSegment && fixSingleSegmentPage(tabId);
  }
});

chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'https://rasaif.com',
    });
  }
});
