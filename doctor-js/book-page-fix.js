const ALL_SEGMENTS = [];
const page = document.querySelector('#content');
const segmentsContainer = document.querySelector('.jet-listing-grid__items');
const fnResizersContainer = document.querySelector('.elementor-section-boxed');

window.addEventListener('load', evt => {
  segmentsContainer.classList.add('size0');

  fnResizersContainer.innerHTML = `
    <section class='doctor-results-page-elements'>
      ${FontResizers()}
    </section`;
  const currentSegments = getBookPageSegments(page);
  ALL_SEGMENTS.push(...currentSegments);
  renderSegments(ALL_SEGMENTS, segmentsContainer);
  // const resizeObserver = new ResizeObserver(entries => {
  //   console.log(entries);
  //   console.log('rerender');
  // });
  // setTimeout(() => resizeObserver.observe(document.body), 2000);
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
