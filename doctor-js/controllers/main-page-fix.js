const searchTitles = document.querySelectorAll('h2.elementor-heading-title');
searchTitles[0].textContent = 'ابحث في كتب العرب';
searchTitles[1].textContent = 'Search the foreign translations';
searchTitles[1].classList.add('eng');

const searchInputs = document.querySelectorAll(`input[type='search']`);
searchInputs.forEach(input => input.setAttribute('dir', 'auto'));
