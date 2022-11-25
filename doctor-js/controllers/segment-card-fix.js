const highlight = (query, el) => {
  const decodedQueryPattern = RGX.arLtr.test(query)
    ? arRgxEnrich(query)
    : query;

  el.innerHTML = el.textContent.replace(
    RegExp(`\\p{L}*${decodedQueryPattern}\\p{L}*`, 'giu'),
    '<mark class="rasaif-match">$&</mark>'
  );
};

/**
 * Fix Segment Card in Search Results
 */

const cards = document.querySelectorAll(
  `article[id^='post'] .elementor-row .make-column-clickable-elementor`
);

cards.forEach(card => {
  const queryRgx = /page_id=(?:4095|17509)&asp_ls=([^&]+)/;
  const hasSearchQuery = /&asp_ls=[^&]+/.test(window.location.search);

  const cells = card
    .querySelectorAll('section')[1]
    .querySelectorAll('.elementor-row .elementor-column p');
  const socialBtns = card.querySelector('ul.ha-share-buttons');

  const segmentUrl = card.dataset.columnClickable;
  const prevUrl = getPrevUrl(segmentUrl);
  const nextUrl = getNextUrl(segmentUrl);
  const prevSegmentHTML = NavSegmentHTML('prev', prevUrl);
  const nextSegmentHTML = NavSegmentHTML('next', nextUrl);
  const copySegmentHTML = CopyButton('copy-segment', 'انسخ الخلية');
  const copySourceHTML = CopyButton('copy-source', 'انسخ الأصل');
  const copyTargetHTML = CopyButton('copy-target', 'انسخ الترجمة');

  card.removeAttribute('style');
  card.removeAttribute('data-column-clickable');
  card.removeAttribute('data-column-clickable-blank');

  cells.forEach(cell => {
    if (hasSearchQuery) {
      const rawQuery = window.location.search.match(queryRgx)[1];
      const decodedQuery = decodeURI(rawQuery).replace(/\+/g, ' ');
      highlight(decodedQuery, cell);
    }

    cell.innerHTML = `
      <a class='doctor-segment-link' href=${segmentUrl} target='_blank' rel='noreferrer'>
        ${cell.innerHTML}
      </a>
    `;
  });

  /**
   * Fix Icons in Search Results
   */

  const emailIcon = card.querySelectorAll('.ha-share-button a')[2];
  emailIcon.dataset.sharer = 'linkedin';

  const icons = card.querySelectorAll('i.fab');
  icons.forEach(icon => {
    icon.classList.remove('fab');
    icon.classList.add('fa');
  });

  emailIcon.innerHTML = `<i class="fa fa-linkedin" aria-hidden="true"></i>`;

  socialBtns.insertAdjacentHTML(
    'afterend',
    `
      <div class='doctor-segment-buttons'>
        ${prevSegmentHTML}            
        ${copySourceHTML}
        ${copySegmentHTML}
        ${copyTargetHTML}
        ${nextSegmentHTML}
      </div>
     `
  );
});
