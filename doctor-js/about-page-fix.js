const ps = Array.from(document.querySelectorAll('.elementor-text-editor p'));

ps.forEach(p => (p.outerHTML = `<p>${p.textContent}</p>`));

const resizers = document.querySelector('section');
undefined;
resizers.style.display = 'none';
