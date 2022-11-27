const SEARCH_RESULTS = [];

const runUrlSearch = async ({search: query, queryLang, exactMatch}) => {
  console.log({query});
  const {pageId, p_asid, termsetType} =
    queryLang === 'frnText'
      ? {pageId: '4095', p_asid: '5', termsetType: 'books'}
      : {pageId: '17509', p_asid: '4', termsetType: 'category'};
  const encodedQuery = query.replace(/\s+/g, '+');
  const exactOption = exactMatch ? '&asp_gen[2]=exact' : '';

  const newUrl = decodeURIComponent(window.location.href)
    .replace(/page=\d+&/, '')
    .replace(/(page_id=)\d+/, `$1${pageId}`)
    .replace(/(asp_ls=)[^&]+/, `$1${encodedQuery}`)
    .replace(/(p_asid=)\d/, `$1${p_asid}`)
    .replaceAll(
      /&termset\[(books|category)\](\[\d*\])=(\d+)/g,
      (_, oldDir, idx, oldId) => {
        const newId =
          termsetType === oldDir
            ? oldId
            : termsetType === 'books'
            ? +oldId + 1
            : +oldId - 1;

        return `&termset[${termsetType}]${idx}=${newId}`;
      }
    )
    .replace(
      /(&asp_gen\[1?\]=content)(?:&asp_gen\[2?\]=exact)?/,
      `$1${exactOption}`
    );

  // `termset[books][${idx}]=${bookId}`
  // const composedUrl = `https://rasaif.com?page_id=${pageId}&asp_ls=${encodedQuery}&asp_active=1&p_asid=${pageId === '4095' ? '5' : '4'}&p_asp_data=1&${books}&customset[0]=post&asp_gen[0]=excerpt&asp_gen[1]=content&filters_initial=1&filters_changed=0&qtranslate_lang=0&current_page_id=1207`;

  console.log(newUrl);
  window.location.href = newUrl;
};

const filterResults = (
  results,
  {query, queryLang, exactMatch, hideMissing, matchCase = false}
) => {
  const queryRgx = getQueryRegex({query, exactMatch, matchCase});

  const filtered = results.reduce((acc, seg) => {
    const {arText, frnText} = seg;
    if (
      (hideMissing && (hasMissing(arText) || hasMissing(frnText))) ||
      !seg[queryLang].match(queryRgx)
    ) {
      return acc;
    } else {
      const html = seg[queryLang].replace(
        queryRgx,
        `<mark class='rasaif-match'>$&</mark>`
      );
      const arHtml = queryLang === 'arText' ? html : arText;
      const frnHtml = queryLang === 'frnText' ? html : frnText;
      acc.push({...seg, arHtml, frnHtml});
      return acc;
    }
  }, []);

  return filtered;
};

const getSearchSettings = async () => {
  let searchSettings = await getSettings(['hideMissing']);
  const paramsRgx =
    /page_id=(4095|17509)&asp_ls=([^&]+).+(?:asp_gen\[\d?\]=(exact|content))/;
  const [paramsMatch, pageId, rawQuery, matchAccuracy] = decodeURI(
    window.location.search
  ).match(paramsRgx);
  const query = decodeURIComponent(rawQuery).replace(/\+/g, ' ');
  const queryLang = pageId === '4095' ? 'frnText' : 'arText';
  const exactMatch = matchAccuracy === 'exact';

  searchSettings = {...searchSettings, query, queryLang, exactMatch};
  console.log(searchSettings);
  return searchSettings;
};

/**
 * VARIABLES
 */

const page = document.querySelector('#main');
const segmentsContainer = document.querySelector('.ecs-posts');
const paginationNav = document.querySelector('.elementor-pagination');
const pageNumberEls = document.querySelectorAll('.page-numbers');
const fnResizersContainer = document
  .querySelector('.zeno_font_resizer_container')
  .closest('.elementor-section');

fnResizersContainer.style.display = 'none';

const pagesNum =
  Array.from(pageNumberEls).at(-1)?.textContent.match(/\d+/)[0] ?? 1;

pageNumberEls.forEach(el => {
  el.innerHTML = el.innerHTML.replace(/\d+/g, num =>
    Number(num).toLocaleString('ar-EG')
  );
});

const calculateSegmentsCount = async (searchSettings, page1Filtered) => {
  if (pagesNum === 1) return;
  const lastPageUrl = window.location.search.replace(
    /^\?(page=\d+&)?/,
    `?page=${pagesNum}&`
  );
  const dom = await getHTMLPage(lastPageUrl);
  const lastPageSegments = filterResults(getPageSegments(dom), searchSettings);
  const segmentsCount =
    (+pagesNum - 2) * 10 + lastPageSegments.length + page1Filtered.length;
  updateInnerHTML(
    '.doctor-results-count',
    `${resultsNumSentence(segmentsCount)}`
  );
};

const getAllSegments = searchSettings => {
  if (pagesNum === 1) return;
  const urls = [];
  for (let i = 2; i <= +pagesNum; i++) {
    const pageUrl = window.location.search.replace(
      /^\?(page=\d+&)?/,
      `?page=${i}&`
    );
    urls.push(pageUrl);
  }
  console.log({urls});

  return;

  const urlsPromises = urls.map(async (url, idx) => {
    const dom = await getHTMLPage(url);
    const pageSegments = getPageSegments(dom);
    const filteredSegments = filterResults(pageSegments, searchSettings);
    SEARCH_RESULTS.push(...filteredSegments);
    console.log({page: `${idx + 2}`, SEARCH_RESULTS});
    updateInnerHTML(
      '.doctor-results-count',
      `${resultsNumSentence(SEARCH_RESULTS.length)}`
    );
    return pageSegments;
  });

  Promise.allSettled(urlsPromises).then(values => {
    console.log(values);
    console.log('DONE');
    renderSegments(SEARCH_RESULTS, segmentsContainer, searchSettings);
  });
};

const insertDoctorElements = searchSettings => {
  page.insertAdjacentHTML(
    'afterbegin',
    `
      <section class='doctor-results-page-elements'>
        <h2 class='doctor-query-title ${
          !!searchSettings.query.match(RGX.arLtr) && 'ar'
        }' dir='auto'>${searchSettings.query}</h2>
        <p class='doctor-results-count'>${resultsNumSentence(
          SEARCH_RESULTS.length
        )}</p>
        ${doctorSearchForm(searchSettings)}
        ${paginationNav?.outerHTML || ''}
        <div class='font-resizers'>
          <a href="#" class="font_resizer_minus" title="صغِّر الخط" style="font-size: 0.9em;">ض<span class="screen-reader-text">صغِّر الخط.</span></a>
          <a href="#" class="font_resizer_reset" title="استرجع الأصل" style="font-size: 1.2em;">ض<span class="screen-reader-text">استرجع الأصل</span></a>
          <a href="#" class="font_resizer_add" title="كبِّر الخط" style="font-size: 1.5em;">ض<span class="screen-reader-text">كبِّر الخط</span></a>
        </div>
      </section>
    `
  );
};

/**
 * Doctor Search Engine
 */

const doctorSubmit = target => {
  const formData = new FormData(target);
  const formProps = Object.fromEntries(formData);
  console.log(formProps);
  runUrlSearch(formProps);
};

/**
 * EVENT LISTENERS
 */

window.addEventListener('load', async evt => {
  // return;
  const searchSettings = await getSearchSettings();
  document.title = `نتائج البحث — ${searchSettings.query}`;
  const currentSegments = getPageSegments(page);
  const page1Filtered = filterResults(currentSegments, searchSettings);
  SEARCH_RESULTS.push(...page1Filtered);
  renderSegments(page1Filtered, segmentsContainer, searchSettings);
  insertDoctorElements(searchSettings);
  segmentsContainer.classList.add('size0');
  const docSearchForm = document.querySelector('#doctor-search');
  docSearchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    doctorSubmit(evt.target);
  });
  const searchInput = document.querySelector('.doctor-search-input');
  searchInput.focus();
  await calculateSegmentsCount(searchSettings, page1Filtered);
  getAllSegments(searchSettings);
});

document.body.addEventListener('click', evt => {
  const clicked = evt.target;
  const copyButton = clicked.closest(`.copy-button`);
  if (clicked.closest('.font-resizers')) {
    evt.preventDefault();
    const fontResizerMinus = clicked.closest('.font_resizer_minus');
    const fontResizerReset = clicked.closest('.font_resizer_reset');
    const fontResizerAdd = clicked.closest('.font_resizer_add');
    segmentsContainer.className = segmentsContainer.className.replace(
      /size(-?\d)/,
      (_, num) => {
        if (fontResizerMinus) {
          return +num <= -2 ? `size${num}` : `size${+num - 1}`;
        }

        if (fontResizerReset) {
          return `size0`;
        }

        if (fontResizerAdd) {
          return +num >= 2 ? `size${num}` : `size${+num + 1}`;
        }
      }
    );
  }

  if (copyButton) {
    const segmentCard = copyButton.closest('article');
    copySegmentContent(copyButton, segmentCard, SEARCH_RESULTS);
  }
});

document.body.addEventListener('mouseout', evt => {
  const mouseouted = evt.target;
  const copyButton = mouseouted.closest(`.copy-button`);
  if (copyButton) {
    restoreCopyTooltip(copyButton);
  }
});

document.body.addEventListener('keydown', evt => {
  if (evt.key === 'Enter') {
    const focused = document.activeElement;
    focused.tagName === 'LABEL' && focused.click();
    const copyButton = focused.closest('.copy-button');
    if (copyButton) {
      const segmentCard = copyButton.closest('article');
      copySegmentContent(copyButton, segmentCard, SEARCH_RESULTS);
    }
  }
});

document.body.addEventListener('focusout', evt => {
  const focusouted = evt.target;
  const copyButton = focusouted.closest('.copy-button');
  if (copyButton) {
    restoreCopyTooltip(copyButton);
  }
});

// https://rasaif.com/?page=2&page_id=4095&asp_ls=test&asp_active=1&p_asid=5&p_asp_data=1&termset[books][0]=111&termset[books][1]=110&termset[books][2]=116&termset[books][3]=130&termset[books][4]=128&termset[books][5]=114&termset[books][6]=136&termset[books][7]=124&termset[books][8]=100&termset[books][9]=75&termset[books][10]=122&termset[books][11]=88&termset[books][12]=86&termset[books][13]=132&termset[books][14]=103&termset[books][15]=84&termset[books][16]=99&termset[books][17]=108&termset[books][18]=118&termset[books][19]=120&termset[books][20]=72&termset[books][21]=82&termset[books][22]=95&termset[books][23]=77&termset[books][24]=80&termset[books][25]=90&termset[books][26]=105&termset[books][27]=93&termset[books][28]=69&termset[books][29]=126&termset[books][30]=134&customset[0]=post&asp_gen[0]=excerpt&asp_gen[1]=content&filters_initial=1&filters_changed=0&qtranslate_lang=0&current_page_id=1207

// 'https://rasaif.com/?page_id=4095&asp_ls=test&asp_active=1&p_asid=5&p_asp_data=1&termset[books][]=124&termset[books][]=100&termset[books][]=75&termset[books][]=122&termset[books][]=88&termset[books][]=86&termset[books][]=132&termset[books][]=103&termset[books][]=84&termset[books][]=99&termset[books][]=108&termset[books][]=118&termset[books][]=120&termset[books][]=72&termset[books][]=82&termset[books][]=95&termset[books][]=77&termset[books][]=80&termset[books][]=90&termset[books][]=105&termset[books][]=93&termset[books][]=69&termset[books][]=126&termset[books][]=134&customset[]=post&asp_gen[]=excerpt&asp_gen[]=content&filters_initial=0&filters_changed=1&qtranslate_lang=0&current_page_id=1207'

// 'https://rasaif.com/?page=2&page_id=17509&asp_ls=test&asp_active=1&p_asid=4&p_asp_data=1&termset[category][0]=129&termset[category][1]=127&termset[category][2]=113&termset[category][3]=115&termset[category][4]=112&termset[category][5]=109&termset[category][6]=135&termset[category][7]=73&termset[category][8]=131&termset[category][9]=102&termset[category][10]=76&termset[category][11]=83&termset[category][12]=74&termset[category][13]=123&termset[category][14]=79&termset[category][15]=125&termset[category][16]=121&termset[category][17]=87&termset[category][18]=85&termset[category][19]=117&termset[category][20]=101&termset[category][21]=107&termset[category][22]=92&termset[category][23]=104&termset[category][24]=81&termset[category][25]=94&termset[category][26]=98&termset[category][27]=89&termset[category][28]=119&termset[category][29]=133&customset[0]=post&asp_gen[0]=excerpt&asp_gen[1]=content&filters_initial=1&filters_changed=0&qtranslate_lang=0&current_page_id=1207'

// arabic
// 'https://rasaif.com/?page_id=17509&asp_ls=%D8%A3%D9%88%D8%AD%D9%8A%D9%86%D8%A7&asp_active=1&p_asid=4&p_asp_data=1&termset[category][]=129&termset[category][]=127&termset[category][]=113&termset[category][]=115&termset[category][]=112&termset[category][]=109&termset[category][]=135&termset[category][]=73&termset[category][]=131&termset[category][]=102&termset[category][]=76&termset[category][]=83&termset[category][]=74&termset[category][]=123&termset[category][]=79&termset[category][]=125&termset[category][]=121&termset[category][]=87&termset[category][]=85&termset[category][]=117&termset[category][]=101&termset[category][]=107&termset[category][]=92&termset[category][]=104&termset[category][]=81&termset[category][]=94&termset[category][]=98&termset[category][]=89&termset[category][]=119&termset[category][]=133&customset[]=post&asp_gen[]=excerpt&asp_gen[]=content&filters_initial=1&filters_changed=0&qtranslate_lang=0&current_page_id=1207'

// arabic + exact match
// 'https://rasaif.com/?page_id=17509&asp_ls=%D8%A3%D9%88%D8%AD%D9%8A%D9%86%D8%A7&asp_active=1&p_asid=4&p_asp_data=1&termset[category][]=129&termset[category][]=127&termset[category][]=113&termset[category][]=115&termset[category][]=112&termset[category][]=109&termset[category][]=135&termset[category][]=73&termset[category][]=131&termset[category][]=102&termset[category][]=76&termset[category][]=83&termset[category][]=74&termset[category][]=123&termset[category][]=79&termset[category][]=125&termset[category][]=121&termset[category][]=87&termset[category][]=85&termset[category][]=117&termset[category][]=101&termset[category][]=107&termset[category][]=92&termset[category][]=104&termset[category][]=81&termset[category][]=94&termset[category][]=98&termset[category][]=89&termset[category][]=119&termset[category][]=133&customset[]=post&asp_gen[]=excerpt&asp_gen[]=content&asp_gen[]=exact&filters_initial=0&filters_changed=1&qtranslate_lang=0&current_page_id=1207';
