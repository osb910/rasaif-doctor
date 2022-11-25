/**
 * HEAD
 */

// const faScript = document.createElement('script');
// faScript.setAttribute('src', 'https://kit.fontawesome.com/109728983b.js');
// faScript.setAttribute('crossorigin', 'anonymous');

const googleApisLink = document.createElement('link');
googleApisLink.setAttribute('rel', 'preconnect');
googleApisLink.setAttribute('href', 'https://fonts.googleapis.com');

const googleFontsLink = document.createElement('link');
googleFontsLink.setAttribute('rel', 'stylesheet');
googleFontsLink.setAttribute(
  'href',
  'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Source+Serif+Pro:wght@300;400;600;700;900&display=swap'
);

document.head.append(googleApisLink, googleFontsLink);

/**
 * HEADER
 */

const currentPageLink = window.location.href;
const menuLinks = Array.from(
  document.querySelectorAll('header nav .menu-link')
);
const currentMenuLink = menuLinks.find(link => link.href === currentPageLink);
menuLinks[0].querySelector('.menu-text').textContent = 'الرئيسة';
currentMenuLink?.classList.add('active-link');
currentMenuLink?.addEventListener('click', evt => {
  evt.preventDefault();
});

/**
 * FOOTER
 */
// .site-below-footer-inner-wrap
const footer = document.querySelector('footer');

footer.innerHTML = `
  <p>${getTodayGeorgianHijri()}</p>
  <p>جميع الحقوق محفوظة © الرصائف الفصاح للتراجم الصحاح</p>
  <p>برمجة&nbsp;
    <a href="http://lvlupksa.com/" target="_blank" rel="noreferrer">
      lvlupksa
    </a>
  </p>
  <p>صيانة&nbsp;
    <a href="https://twitter.com/osb910" target="_blank" rel="noreferrer">
      عُمر
    </a>
  </p>
`;

/**
 * 404
 */

(() => {
  const notFoundTitle = document.querySelector('.error-404 .page-title');
  const notFoundSubTitle = document.querySelector('.error-404 .page-sub-title');

  if (!notFoundTitle || !notFoundSubTitle) {
    return;
  }

  notFoundTitle.textContent = `ذهب الخادوم يبحث عن الصفحة ورجع بخُفَّي حُنين`;

  notFoundSubTitle.textContent =
    'جرِّب أن تُعيد البحث، أو إن شئت فارجع إلى الرئيسة.';
})();

// [
//   {
//     value: '134',
//     name: 'English-translated',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '126',
//     name: 'A Muslim Manual of War',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '69',
//     name: 'Al-Nawawi’s Forty Hadith',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '93',
//     name: 'Avarice and the Avaricious',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '105',
//     name: 'Contemplation',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '90',
//     name: 'Diseases of the Hearts and Their Cures',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '80',
//     name: 'Ḥayy ibn Yaqẓān',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '77',
//     name: "Kitab al-I'tibar",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '95',
//     name: 'Knowledge Mandates Action',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '82',
//     name: 'Morals and Behaviour',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '72',
//     name: 'Nahj al-Balagha',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '120',
//     name: 'The Book of Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '118',
//     name: 'The Canon Of Medicine of Avicenna',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '108',
//     name: 'The Epistle on Legal Theory',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '99',
//     name: 'The Heavenly Dispute',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '84',
//     name: 'The Islamic Conquest of Syria',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '103',
//     name: 'The Journey of the Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '132',
//     name: 'The Key to Medicine and a Guide for Students',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '86',
//     name: 'The Muqaddimah: An Introduction to History',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '88',
//     name: 'The Optics of Ibn Al-Haytham',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '122',
//     name: 'The Rare and Excellent History of Saladin',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '75',
//     name: 'The Ring of the Dove',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '100',
//     name: 'The Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '124',
//     name: 'The Travels Of Ibn Battuta 1325 – 1354',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '136',
//     name: 'French-translated',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '114',
//     name: 'Hayy Ibn Yaqdhân',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '128',
//     name: "L'accord de la religion et de la philosophie",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '130',
//     name: 'L’anthologie du renoncement',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '116',
//     name: 'Le préservatif de l’erreur',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '110',
//     name: "Les colliers d'or: Allocutions morales",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '111',
//     name: 'Les Quarante Hadiths de l’imam An-Nawawi',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '134',
//     name: 'English-translated',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '126',
//     name: 'A Muslim Manual of War',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '69',
//     name: 'Al-Nawawi’s Forty Hadith',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '93',
//     name: 'Avarice and the Avaricious',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '105',
//     name: 'Contemplation',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '90',
//     name: 'Diseases of the Hearts and Their Cures',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '80',
//     name: 'Ḥayy ibn Yaqẓān',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '77',
//     name: "Kitab al-I'tibar",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '95',
//     name: 'Knowledge Mandates Action',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '82',
//     name: 'Morals and Behaviour',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '72',
//     name: 'Nahj al-Balagha',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '120',
//     name: 'The Book of Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '118',
//     name: 'The Canon Of Medicine of Avicenna',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '108',
//     name: 'The Epistle on Legal Theory',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '99',
//     name: 'The Heavenly Dispute',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '84',
//     name: 'The Islamic Conquest of Syria',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '103',
//     name: 'The Journey of the Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '132',
//     name: 'The Key to Medicine and a Guide for Students',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '86',
//     name: 'The Muqaddimah: An Introduction to History',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '88',
//     name: 'The Optics of Ibn Al-Haytham',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '122',
//     name: 'The Rare and Excellent History of Saladin',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '75',
//     name: 'The Ring of the Dove',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '100',
//     name: 'The Strangers',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '124',
//     name: 'The Travels Of Ibn Battuta 1325 – 1354',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '136',
//     name: 'French-translated',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '114',
//     name: 'Hayy Ibn Yaqdhân',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '128',
//     name: "L'accord de la religion et de la philosophie",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '130',
//     name: 'L’anthologie du renoncement',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '116',
//     name: 'Le préservatif de l’erreur',
//     termset: 'termset[books][]',
//   },
//   {
//     value: '110',
//     name: "Les colliers d'or: Allocutions morales",
//     termset: 'termset[books][]',
//   },
//   {
//     value: '111',
//     name: 'Les Quarante Hadiths de l’imam An-Nawawi',
//     termset: 'termset[books][]',
//   },
// ];
