const segmentContainer = document.querySelector('main .post');
const segmentId = Array.from(segmentContainer?.classList)
  ?.join(' ')
  .match(/post-(\d+)/)[0];
const arTitleEl = document.querySelector('a.jet-listing-dynamic-terms__link');
const frnTitleEl = document.querySelector(
  'span.jet-listing-dynamic-terms__link'
);
const arTextEl = document.querySelector(
  '.elementor-widget-theme-post-excerpt .elementor-widget-container'
);
const frnTextEl = document.querySelector(
  '.elementor-widget-theme-post-content .elementor-widget-container p'
);

const bookUrl = arTitleEl.href;

const segmentUrl = window.location.href;

window.addEventListener('load', evt => {
  renderSegments(
    [
      {
        id: segmentId,
        arText: arTextEl.textContent,
        frnText: frnTextEl.textContent,
        arTitle: arTitleEl.textContent,
        frnTitle: frnTitleEl.textContent,
        segmentUrl,
        bookUrl,
        prevUrl: getPrevUrl(segmentUrl),
        nextUrl: getNextUrl(segmentUrl),
      },
    ],
    segmentContainer
  );
});
