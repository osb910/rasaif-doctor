export const genMatchStyle = color => `
  .rasaif-match {
    background-color: ${color}90;
  }
`;

export const getCurrentTab = async () => {
  let queryOptions = {
    active: true,
    currentWindow: true,
  };
  try {
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  } catch (err) {
    console.log(err);
  }
};

export const getSettings = async settings => {
  const results = await chrome.storage.sync.get(settings);
  return results;
};

export const saveSettings = (name, settings) => {
  const obj = {[name]: settings};
  chrome.storage.sync.set(obj, () => console.log('Value is set to ' + obj));
};
