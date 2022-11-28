const CopyButton = (cls, text) => `
  <li class="copy-button ${cls} ha-share-button">
    <a tabindex='0' class='tooltip sharer ha-share-network'>
      <span class="tooltiptext">${text}</span>
      <i class="fa fa-clone" aria-hidden="true"></i>
    </a>
  </li>
`;

const NavSegmentHTML = (dir, url) => `
  <a href="${url}" rel="${dir}" target='_blank'>
    <span class="elementor-post-navigation__link__${dir}">
      <span class="post-navigation__${dir}--label">${
  dir === 'next' ? 'التالية' : 'السابقة'
}</span>
  </span>
  <span class="post-navigation__arrow-wrapper post-navigation__arrow-${dir}">
    <i class="fa fa-angle-double-${
      dir === 'next' ? 'left' : 'right'
    }" aria-hidden="true"></i>
    <span class="elementor-screen-only">${
      dir === 'next' ? 'التالية' : 'السابقة'
    }</span>
    </span>
  </a>
`;

const ShareButton = (platform, url, text, tooltiptext) => {
  const platformsMap = {
    facebook: () => getFacebookShareLink(url, text),
    twitter: () => getTwitterShareLink(url, text),
    linkedin: () => getLinkedInShareLink(url, text),
    whatsapp: () => getWhatsappShareLink(url, text),
    telegram: () => getTelegramShareLink(url, text),
  };
  const shareUrl = platformsMap[platform](url);
  return `
      <li class='share-button'>
        <a class='tooltip' href='${shareUrl}' target="_blank">
          <span class="tooltiptext">${tooltiptext}</span>
          <i class='fa fa-${platform}'></i>
        </a>
      </li>
  `;
};

const segmentCard = ({
  id,
  arText,
  frnText,
  arTitle,
  frnTitle,
  segmentUrl = false,
  bookUrl = false,
  PrevNav = false,
  NextNav = false,
  CopyButtons,
  ShareButtons,
}) => {
  const arTitleHtml = `<h3 class='ar-title rtl'>${arTitle}</h3>`;
  const frnTitleHtml = `<h3 class='frn-title ltr'>${frnTitle}</h3>`;

  return `
  <article data-id=${id} dir='rtl' class='segment'>
    <section class='book-title'>
      <a href=${bookUrl} target='_blank' rel='noreferrer'>${arTitleHtml}</a>
      <a href=${bookUrl} target='_blank' rel='noreferrer'>${frnTitleHtml}</a>
    </section>
    <section class='segment-text'>
      <a href=${segmentUrl} target='_blank' rel='noreferrer'><p class='ar-text rtl'>${arText}</p></a>
      <a href=${segmentUrl} target='_blank' rel='noreferrer'><p class='frn-text ltr'>${frnText}</p></a>
    </section>
    <section class='segment-buttons'>
      <ul class='nav-buttons'>
        <li class='nav-button prev-segment'>${PrevNav}</li>
        ${CopyButtons}
        <li class='nav-button next-segment'>${NextNav}</li>
      </ul>
      <ul class='share-buttons'>
        ${ShareButtons}
      </ul>
    </section>
  </article>
`;
};
