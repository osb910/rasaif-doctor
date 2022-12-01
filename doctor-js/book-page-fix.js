const ALL_SEGMENTS = [];
const page = document.querySelector('#content');
const cards = Array.from(page.querySelectorAll(`.jet-listing-grid__item`));
const segmentsContainer = document.querySelector('.jet-listing-grid__items');
const fnResizersContainer = document.querySelector('.elementor-section-boxed');
const paginationNumbers = document.querySelectorAll(
  '.jet-filters-pagination__link'
);

window.addEventListener('load', evt => {
  segmentsContainer.classList.add('size0');

  fnResizersContainer.innerHTML = `
    <section class='doctor-results-page-elements'>
      ${FontResizers()}
    </section`;
  const currentSegments = getBookPageSegments(cards);
  ALL_SEGMENTS.push(...currentSegments);
  renderSegments(ALL_SEGMENTS, segmentsContainer);

  const callback = (mutations, observer) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        observer.disconnect();
        const [, ...newCards] = mutation.addedNodes;
        const newSegments = getBookPageSegments(newCards);
        ALL_SEGMENTS.push(...newSegments);
        renderSegments(ALL_SEGMENTS, segmentsContainer);
        observer.observe(segmentsContainer, {
          attributes: true,
          childList: true,
        });
      }
    });
  };
  const observer = new MutationObserver(callback);
  observer.observe(segmentsContainer, {
    attributes: true,
    childList: true,
  });
  // .jet-filters-loading // loading class
  paginationNumbers.forEach(
    el =>
      (el.textContent = el.textContent.replace(
        /\d+/,
        m => +m.toLocaleString('ar-EG')
      ))
  );
});

window.addEventListener('DOMContentLoaded', evt => {});

document.body.addEventListener('click', evt => {
  const clicked = evt.target;
  const copyButton = clicked.closest(`.copy-button`);
  if (clicked.closest('.font-resizers')) {
    evt.preventDefault();
    const fontResizerMinus = clicked.closest('.font_resizer_minus');
    const fontResizerAdd = clicked.closest('.font_resizer_add');
    segmentsContainer.className = segmentsContainer.className.replace(
      /size(-?\d)/,
      (_, num) => {
        return fontResizerMinus
          ? +num <= -2
            ? `size${num}`
            : `size${+num - 1}`
          : fontResizerAdd
          ? +num >= 2
            ? `size${num}`
            : `size${+num + 1}`
          : 'size0';
      }
    );
  }

  if (copyButton) {
    const segmentCard = copyButton.closest('article');
    copySegmentContent(copyButton, segmentCard, ALL_SEGMENTS);
  }
});

document.body.addEventListener('mouseout', evt => {
  const mouseouted = evt.target;
  const copyButton = mouseouted.closest(`.copy-button`);
  if (copyButton) {
    restoreCopyTooltip(copyButton);
  }
});

document.body.addEventListener('focusout', evt => {
  const focusouted = evt.target;
  const copyButton = focusouted.closest('.copy-button');
  if (copyButton) {
    restoreCopyTooltip(copyButton);
  }
});

document.body.addEventListener('keydown', evt => {
  if (evt.key === 'Enter') {
    const focused = document.activeElement;
    const copyButton = focused.closest('.copy-button');
    if (copyButton) {
      const segmentCard = copyButton.closest('article');
      copySegmentContent(copyButton, segmentCard, ALL_SEGMENTS);
    }
  }
});
