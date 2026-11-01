/* menu.js — menu data plus dynamic rendering, search, filter and sort.
   The menu cards on products.html are built here with DOM methods
   (createElement / textContent), not typed into the HTML, so prices and
   items live in one place. enquiries.html reuses the same data for its
   quote calculator via window.KOTA_MENU. (MDN Web Docs, 2026a) */
(function () {
  'use strict';

  var MENU = [
    { no: 1, id: 'starter',  category: 'kota',  name: 'The Starter',         price: 18, desc: 'Fries, polony and lettuce.' },
    { no: 2, id: 'classic',  category: 'kota',  name: 'The Classic',         price: 20, desc: 'Fries, polony, vienna and lettuce.' },
    { no: 3, id: 'cheesy',   category: 'kota',  name: 'The Cheesy',          price: 25, desc: 'Fries, polony, vienna, cheese and lettuce.' },
    { no: 4, id: 'russian',  category: 'kota',  name: 'The Russian Special', price: 30, desc: 'Fries, polony, vienna, full Russian, cheese and lettuce.' },
    { no: 5, id: 'patty',    category: 'kota',  name: 'The Patty Stack',     price: 35, desc: 'Fries, polony, vienna, beef patty, cheese, egg and lettuce.' },
    { no: 6, id: 'half',     category: 'kota',  name: 'The Half King',       price: 40, desc: 'Fries, polony, vienna, beef patty, half Russian, cheese, egg and lettuce.' },
    { no: 7, id: 'king',     category: 'kota',  name: 'The Kota King',       price: 45, desc: 'Fries, polony, vienna, beef patty, full Russian, cheese, egg and lettuce.', featured: true },
    { id: 'x-vienna',  category: 'extra', name: 'Extra vienna',  price: 6,  desc: 'Add a vienna to any kota.' },
    { id: 'x-russian', category: 'extra', name: 'Extra Russian', price: 10, desc: 'Add a Russian to any kota.' },
    { id: 'x-egg',     category: 'extra', name: 'Extra egg',     price: 5,  desc: 'Add a fried egg to any kota.' },
    { id: 'c-medium',  category: 'chips', name: 'Chips, medium', price: 20, desc: 'A medium portion of chips on the side.' },
    { id: 'c-large',   category: 'chips', name: 'Chips, large',  price: 30, desc: 'A large portion of chips on the side.' }
  ];

  window.KOTA_MENU = MENU;

  var list = document.getElementById('menu-list');
  if (!list) return; // other pages only need the data above

  var search = document.getElementById('menu-search');
  var category = document.getElementById('menu-category');
  var sort = document.getElementById('menu-sort');
  var count = document.getElementById('menu-count');
  var empty = document.getElementById('menu-empty');
  var reset = document.getElementById('menu-reset');
  var controls = document.querySelector('.menu-controls');

  function buildCard(item) {
    var card = document.createElement('article');
    card.className = 'card row-between menu-item' + (item.featured ? ' card-featured' : '');
    card.setAttribute('data-category', item.category);

    var text = document.createElement('div');
    var title = document.createElement('h3');
    title.textContent = (item.no ? item.no + '. ' : '') + item.name;
    if (item.featured) {
      var tag = document.createElement('span');
      tag.className = 'tag-loaded';
      tag.textContent = 'Loaded';
      title.appendChild(document.createTextNode(' '));
      title.appendChild(tag);
    }
    var desc = document.createElement('p');
    desc.textContent = item.desc;
    text.appendChild(title);
    text.appendChild(desc);

    var price = document.createElement('span');
    price.className = 'price';
    price.textContent = 'R' + item.price;

    card.appendChild(text);
    card.appendChild(price);
    return card;
  }

  function currentItems() {
    var term = search.value.trim().toLowerCase();
    var cat = category.value;
    var items = MENU.filter(function (item) {
      var inCategory = cat === 'all' || item.category === cat;
      var matches = !term || (item.name + ' ' + item.desc).toLowerCase().indexOf(term) !== -1;
      return inCategory && matches;
    });
    var mode = sort.value;
    if (mode === 'price-asc') items.sort(function (a, b) { return a.price - b.price; });
    if (mode === 'price-desc') items.sort(function (a, b) { return b.price - a.price; });
    if (mode === 'name') items.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return items;
  }

  function render() {
    var items = currentItems();
    list.textContent = '';
    var frag = document.createDocumentFragment();
    items.forEach(function (item) { frag.appendChild(buildCard(item)); });
    list.appendChild(frag);
    empty.hidden = items.length > 0;
    count.textContent = 'Showing ' + items.length + ' of ' + MENU.length + ' items';
  }

  search.addEventListener('input', render);
  category.addEventListener('change', render);
  sort.addEventListener('change', render);
  if (controls) controls.addEventListener('submit', function (e) { e.preventDefault(); });
  reset.addEventListener('click', function () {
    search.value = '';
    category.value = 'all';
    sort.value = 'default';
    render();
    search.focus();
  });

  render();
})();