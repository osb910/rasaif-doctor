const RGX = {
  arAnyChar: /\p{Script_Extensions=Arabic}/gu,
  $arAnyChar: '\\p{Script_Extensions=Arabic}',
  arChar: /(?=\p{Script_Extensions=Arabic})[^\p{N}\p{P}]/gu,
  $arChar: '(?=\\p{Script_Extensions=Arabic})[^\\p{N}\\p{P}]',
  // arChar: /(?=\p{Script_Extensions=Arabic})[\p{L}\p{M}]/gu,
  // $arChar: '(?=\\p{Script_Extensions=Arabic})[\\p{L}\\p{M}]',
  arLtr: /(?=\p{Script=Arabic})\p{L}/gu,
  $arLtr: '(?=\\p{Script=Arabic})\\p{L}',
  arDiac: /(?=\p{Script_Extensions=Arabic})\p{Mn}/gu,
  $arDiac: '(?=\\p{Script_Extensions=Arabic})\\p{Mn}',
  wholeLtr:
    /((?=\p{Script=Arabic})\p{L})((?=\p{Script_Extensions=Arabic})\p{Mn}{0,4})/gu,
  $wholeLtr:
    '((?=\\p{Script=Arabic})\\p{L})((?=\\p{Script_Extensions=Arabic})\\p{Mn}{0,4})',
  UalifVar:
    '\\u0627\\u0656\\u0670\\u0671\\u08AD\\uFB50\\uFB51\\uFC63\\uFD3C\\uFD3D\\uFE8D\\uFE8E',
  nunationAlif: /([\u064B\u0657\u08F0]|\u064E\u06E2)(\u0627)/g,
  $nunationAlif: '([\\u064B\\u0657\\u08F0]|\\u064E\\u06E2)(\\u0627)',
  alifNunation: /(\u0627)([\u064B\u0657\u08F0]|\u064E\u06E2)/g,
  $alifNunation: '(\\u0627)([\\u064B\\u0657\\u08F0]|\\u064E\\u06E2)',
  hamzas: /[\u0621-\u0626]/g,
  Uhamzas: '\\u0621-\\u0626',
};

const alifForms =
  '[\\u0622\\u0623\\u0625\\u0627\\u0656\\u0670-\\u0675\\u08AD\\uFB50\\uFB51\\uFBEA\\uFBEB\\uFC63\\uFD3C\\uFD3D\\uFE81-\\uFE84\\uFE87\\uFE88\\uFE8D\\uFE8E\\uFEF5-\\uFEFC]';

const alifSounds =
  '[\\u0622\\u0627\\u0656\\u0670\\u0671\\u08AD\\uFB50\\uFB51\\uFBEA\\uFBEB\\uFC63\\uFD3C\\uFD3D\\uFE81\\uFE8D\\uFE8E\\uFEF5\\uFEF6\\uFEFB\\uFEFC]';

const arRgxEnrich = (
  s,
  {diacs = false, kashida = false, alif = false} = {}
) => {
  let optional = !diacs
    ? !kashida
      ? `\\u0640*${RGX.$arDiac}{0,4}\\u0640*`
      : `${RGX.$arDiac}{0,4}`
    : !kashida
    ? `\\u0640*`
    : '';

  return (
    s
      // Consider Holy Name ornament
      .replace(/(الله)/g, `($1|\\uFDF2)`)
      // Consider Muhammad ornament
      .replace(/(محمد)/g, `($1|\\uFDF4)`)
      // Consider salah ornament
      .replace(/(صلى الله عليه وسلم)/g, `($1|\\uFDFA)`)
      // Consider jalla jalaluhou ornament
      .replace(/(جل جلاله)/g, `($1|\\uFDFB)`)
      // Consider basmala ornament
      .replace(/(بسم الله الرحمن الرحيم)/g, `($1|\\uFDFD)`)
      // Consider 2 positions of fath nunation around alif
      .replace(RGX.nunationAlif, `($1$2|$2$1)`)
      .replace(RGX.alifNunation, `($1$2|$2$1)`)
      // Optional diacritics and/or kashida on choice
      .replace(RGX.wholeLtr, `$&${optional}`)
      // Consider hamza shapes
      .replace(
        /ء/g,
        `[\\u0621-\\u0626\\u0672-\\u0678\\uFBEA-\\uFBFB\\uFE80-\\uFE8C\\uFEF5-\\uFEFA]`
      )
      // Consider alif shapes w/ optional hamza on choice
      .replace(/ا/g, !alif ? `${alifForms}` : `${alifSounds}`)
      // Consider circle and rasKhaa of sukuun
      .replace(/\u0652/g, `[\\u0652\\u06E1\\uFE7E\\uFE7F]`)
      // Consider 3 shapes of fath nunation
      .replace(/\u064B/g, `([\\u064B\\u0657\\u08F0]|\\u064E\\u06E2)`)
      // Consider 3 shapes of damm nunation
      .replace(/\u064C/g, `([\\u064C\\u065E\\u08F1]|\\u064F\\u06E2)`)
      // Consider 3 shapes of kasr nunation
      .replace(/\u064D/g, `([\\u064D\\u0656\\u08F2]|\\u0650\\u06ED))`)
  );
};

const getUrlPromise = async url => {
  const res = await fetch(url);
  const data = await res.text();
  return data;
};

const getHTML = data => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');
  return dom;
};

const getHTMLPage = async url => {
  try {
    const data = await getUrlPromise(url); // PLAIN TEXT
    const dom = getHTML(data); // DOM TREE
    return dom;
  } catch (err) {
    console.error(err);
  }
};

const updateTextContent = (selector, text) => {
  const el = document.querySelector(selector);
  el.textContent = text;
};

const updateInnerHTML = (selector, html) => {
  const el = document.querySelector(selector);
  el.innerHTML = html;
};

const copy = texts => {
  const cleanText = texts.map(el => el.trim());
  navigator.clipboard.writeText(cleanText.join('\t'));
};

const getFacebookShareLink = (url, text = '') => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}&quote=${text}`;
};

const getTwitterShareLink = (url, text = '') =>
  `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
    text
  )}&related=@rasaif&url=${encodeURIComponent(url)}`;

const getLinkedInShareLink = (url, text = '') => {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    url
  )}&title=&summary=&source=Rasaif`;
};

const getWhatsappShareLink = (url, text = '') =>
  `https://api.whatsapp.com/send?&text=${encodeURIComponent(
    url
  )} \n${encodeURIComponent(text)}`;
const getTelegramShareLink = (url, text = '') =>
  `https://telegram.me/share/url?url=${encodeURIComponent(url)}`;

const getHijriGeorgianDate = date => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'};

  const hijriDate = date
    .toLocaleDateString('ar-SA', options)
    .replace(/محرم/, 'المحرم')
    .replace(/(?<=^[^١] )\p{L}+/u, 'من $&')
    .replace(/^١\s/, 'غُرَّة ');

  const georgianDate = date
    .toLocaleDateString('ar-EG', options)
    .replace(/\p{L}+/u, 'من $&')
    .replace(/^١\s/, 'الأول ');
  georgianDate + ' م';

  const weekday = date.toLocaleDateString('ar-EG', {weekday: 'long'});

  return `${weekday}، ${hijriDate}، الموافق ${georgianDate}`;
};
