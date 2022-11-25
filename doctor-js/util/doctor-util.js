const getSettings = async settings => {
  const results = await chrome.storage.sync.get(settings);
  return results;
};

const saveSettings = async (name, settings) => {
  const obj = {[name]: settings};
  console.log(obj);
  await chrome.storage.sync.set(obj, () =>
    console.log('Value is set to ' + obj)
  );
};

const getPrevUrl = url => url.replace(/(?<=p=)\d+/, num => +num - 1);

const getNextUrl = url => url.replace(/(?<=p=)\d+/, num => +num + 1);

const getPageSegments = page => {
  const posts = Array.from(
    page.querySelectorAll(`article[id^='post'].elementor-post`)
  );

  const segmentsData = posts.map((post, idx) => {
    const segmentId = post.id;
    const bookId = Array.from(post.classList)
      .join(' ')
      .match(/category-(\d+)/)[1];
    const bookUrl = `https://rasaif.com/?cat=${bookId}`;
    const arText =
      post.querySelector('.text-right p')?.textContent.trim() || '';
    const frnText =
      post.querySelector('.left-text p')?.textContent.trim() || '';
    const arTitle = post.querySelector(
      '.elementor-inner-section:nth-child(1) .elementor-inner-column:nth-child(1) .jet-listing-dynamic-terms__link'
    )?.textContent;
    const frnTitle = post.querySelector(
      '.elementor-inner-section:nth-child(1) .elementor-inner-column:nth-child(2) .jet-listing-dynamic-terms__link'
    )?.textContent;

    const segmentUrl = post.querySelector('.make-column-clickable-elementor')
      .dataset.columnClickable;

    return {
      id: segmentId,
      arText,
      frnText,
      arTitle,
      frnTitle,
      segmentUrl,
      bookUrl,
      prevUrl: getPrevUrl(segmentUrl),
      nextUrl: getNextUrl(segmentUrl),
      // translator: ,
      // transLang: ,
    };
  });

  return segmentsData;
};

const resultsNumSentence = num =>
  arabizeCount(num, {
    sng: 'نتيجة',
    pair: 'نتيجتين',
    plr: 'نتائج',
    zero: 'ما وجدنا في الرصائف من شيء.',
    isPlrVaried: false,
    before: 'وجدنا <strong>',
    after: '</strong> في الرصائف.',
  });

const hasMissing = text => /^\s*(سقطمنالنسخة)?\s*$/.test(text);

/**
 * CARD
 */

const copySegmentContent = (copyBtn, segmentCard, results) => {
  const copyClass = copyBtn.classList[1];
  const segmentId = segmentCard?.dataset.id;
  const {arText = '', frnText = ''} = results.find(
    result => result.id === segmentId
  );
  const tooltipEl = copyBtn.querySelector('.tooltip');
  const tooltipTextEl = copyBtn.querySelector('.tooltiptext');
  tooltipTextEl.classList.add('active');
  copyClass.replace(/copy-(\w+)/, (m, m1) => {
    const toCopy =
      m1 === 'segment'
        ? [frnText, arText]
        : m1 === 'source'
        ? [arText]
        : [frnText];
    copy(toCopy);

    const tooltiptext =
      m1 === 'segment' ? 'الخلية' : m1 === 'source' ? 'الأصل' : 'الترجمة';
    tooltipTextEl.textContent = `نسخنا لك ${tooltiptext}`;
  });

  setTimeout(() => tooltipEl.blur(), 1000);
};

const restoreCopyTooltip = copyBtn => {
  const copyClass = copyBtn.classList[1];
  const tooltipTextEl = copyBtn.querySelector('.tooltiptext');
  tooltipTextEl.classList.remove('active');
  copyClass.replace(/copy-(\w+)/, (m, m1) => {
    const tooltiptext =
      m1 === 'segment' ? 'الخلية' : m1 === 'source' ? 'الأصل' : 'الترجمة';
    tooltipTextEl.textContent = `انسخ ${tooltiptext}`;
  });
};

const getQueryRegex = ({
  query,
  exactMatch = false,
  matchWholeWord = false,
  matchCase = false,
  matchDiacs = false,
  matchKashida = false,
  matchAlif = false,
  useRegex = false,
}) => {
  // CONSIDER REGEX
  // query = useRegex ? query : escapeRegex(query);

  let flags = 'gu';

  // CASE SENSITIVITY
  flags += !matchCase ? 'i' : '';

  let queryPattern = exactMatch
    ? // EXACT MATCH AND WHOLE WORD
      matchWholeWord
      ? `(?<!\\p{L})${query}(?!\\p{L})`
      : // ONLY EXACT MATCH
        `(\\p{L}|\\p{M})*${query}(\\p{L}|\\p{M})*`
    : query
        .split(' ')
        .map(word =>
          // ONLY WHOLE WORD
          matchWholeWord
            ? `(?<!\\p{L})${word}(?!\\p{L})`
            : // NO RESTRICTIONS
              `(\\p{L}|\\p{M})*${word}(\\p{L}|\\p{M})*`
        )
        .join('|');

  // ARABIC OPTIONS
  queryPattern = RGX.arLtr.test(queryPattern)
    ? arRgxEnrich(queryPattern, {
        diacs: matchDiacs,
        kashida: matchKashida,
        alif: matchAlif,
      })
    : queryPattern;

  return new RegExp(queryPattern, flags);
};

const renderSegments = (
  segments,
  container,
  {query = '', matchWholeWord = false, matchCase = false} = {}
) => {
  container.innerHTML = segments
    .map(
      ({
        id,
        arText,
        frnText,
        arTitle,
        frnTitle,
        segmentUrl,
        bookUrl = '',
        arHtml,
        frnHtml,
      }) => {
        const segmentText = `«${arText}» — «${frnText}»\n${arTitle} — ${frnTitle}`;

        if (query) {
          arText = arHtml;
          frnText = frnHtml;
        }

        const PrevNav = NavSegmentHTML('prev', getPrevUrl(segmentUrl));
        const NextNav = NavSegmentHTML('next', getNextUrl(segmentUrl));
        const CopyButtons = `
        ${CopyButton('copy-source', 'انسخ الخلية')}
        ${CopyButton('copy-segment', 'انسخ الأصل')}
        ${CopyButton('copy-target', 'انسخ الترجمة')}
      `;
        const ShareButtons = `
        ${ShareButton('facebook', segmentUrl, segmentText, 'انشر في فسبك')}
        ${ShareButton('twitter', segmentUrl, segmentText, 'انشر في تويتر')}
        ${ShareButton('linkedin', segmentUrl, segmentText, 'انشر في لنكدن')}
        ${ShareButton('whatsapp', segmentUrl, segmentText, 'انشر في وتساب')}
        ${ShareButton('telegram', segmentUrl, segmentText, 'انشر في تلجرام')}
      `;

        return segmentCard({
          id,
          arText,
          frnText,
          arTitle,
          frnTitle,
          segmentUrl,
          bookUrl,
          PrevNav,
          NextNav,
          CopyButtons,
          ShareButtons,
        });
      }
    )
    .join('');
};
