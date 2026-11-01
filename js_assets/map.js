/* map.js — interactive outlet map using Leaflet with OpenStreetMap tiles.
   Leaflet Contributors (2026) for the API; OpenStreetMap contributors for map data.
   Coordinates are approximate: check them against Google Maps and adjust. */
(function () {
  'use strict';
  var mapEl = document.getElementById('map');
  if (!mapEl || !window.L) return;

  var outlets = {
    madabani: { name: 'Main Store: Madabani Village', coords: [-22.9526, 30.4946], zoom: 14, hours: 'Mon–Sat, 10:00–20:00', phone: '076 498 5798' },
    erica: { name: 'Second Outlet: Erica Flat', coords: [-25.7523, 28.2092], zoom: 16, hours: 'Mon–Sat, 10:00–20:00', phone: '079 321 9299' }
  };

  var map = L.map(mapEl, { scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markers = {};
  Object.keys(outlets).forEach(function (key) {
    var o = outlets[key];
    var popup = document.createElement('div');
    var title = document.createElement('strong');
    title.textContent = o.name;
    popup.appendChild(title);
    popup.appendChild(document.createElement('br'));
    popup.appendChild(document.createTextNode(o.hours));
    popup.appendChild(document.createElement('br'));
    popup.appendChild(document.createTextNode(o.phone));
    markers[key] = L.marker(o.coords, { title: o.name }).addTo(map).bindPopup(popup);
  });

  function show(key) {
    if (key === 'both') {
      map.flyToBounds(L.latLngBounds([outlets.madabani.coords, outlets.erica.coords]), { padding: [40, 40] });
      return;
    }
    var o = outlets[key];
    map.flyTo(o.coords, o.zoom);
    markers[key].openPopup();
  }

  document.querySelectorAll('[data-outlet]').forEach(function (btn) {
    btn.addEventListener('click', function () { show(btn.getAttribute('data-outlet')); });
  });

  map.on('click', function () { map.scrollWheelZoom.enable(); }); // wheel zoom only after the visitor clicks the map
  map.fitBounds([outlets.madabani.coords, outlets.erica.coords], { padding: [40, 40] });
})();