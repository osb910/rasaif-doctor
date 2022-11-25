import {
  getCurrentTab,
  getSettings,
  saveSettings,
  genMatchStyle,
} from './util.js';

/**
 * VARIABLES
 */

const highlightInput = document.querySelector('#highlight-color');
const hideMissingOption = document.querySelector('#hideMissing');

/**
 * FUNCTIONS
 */

const initiate = async () => {
  const highlightColor =
    (await getSettings(['highlightColor'])).highlightColor || '#aa8c3c';
  const hideMissing = (await getSettings(['hideMissing'])).hideMissing;

  highlightInput.value = highlightColor;
  hideMissing && hideMissingOption.setAttribute('checked', 'true');
};

const changeInputColor = async color => {
  const tab = await getCurrentTab();
  const highlightColor =
    (await getSettings(['highlightColor'])).highlightColor || '#aa8c3c';

  chrome.scripting.removeCSS({
    target: {tabId: tab.id},
    css: genMatchStyle(highlightColor),
  });

  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    css: genMatchStyle(color),
  });

  saveSettings('highlightColor', color);
};

const changeSearchSettings = async state => {
  saveSettings('hideMissing', state);
};

/**
 * EVENT LISTENERS
 */

highlightInput.addEventListener('input', evt => {
  const newColor = evt.target.value;
  changeInputColor(newColor);
});

hideMissingOption.addEventListener('change', evt => {
  changeSearchSettings(evt.target.checked);
});

window.onload = initiate;
