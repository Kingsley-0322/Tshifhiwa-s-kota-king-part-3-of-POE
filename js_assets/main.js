/* main.js — shared behaviour: mobile nav, accordion and image lightbox. */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (event) {
      var inside = links.contains(event.target) || toggle.contains(event.target);
      if (!inside && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Accordion (one panel open at a time) ----------
     Pattern based on the W3C WAI-ARIA Authoring Practices accordion (W3C, 2026). */
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    var items = accordion.querySelectorAll('.accordion-item');
    items.forEach(function (item) {
      var trigger = item.querySelector('.accordion-trigger');
      trigger.addEventListener('click', function () {
        var willOpen = !item.classList.contains('open');
        items.forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* ---------- Gallery lightbox (native <dialog>) ---------- */
  var images = Array.prototype.slice.call(document.querySelectorAll('img[data-lightbox]'));
  if (images.length && window.HTMLDialogElement) {
    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Image viewer');
    dialog.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<div class="lightbox-nav">' +
      '<button type="button" class="btn btn-outline" data-dir="-1">Previous</button>' +
      '<button type="button" class="btn btn-outline" data-dir="1">Next</button></div>';
    document.body.appendChild(dialog);

    var big = dialog.querySelector('img');
    var caption = dialog.querySelector('figcaption');
    var current = 0;
    var opener = null;

    function show(index) {
      current = (index + images.length) % images.length;
      big.src = images[current].currentSrc || images[current].src;
      big.alt = images[current].alt;
      caption.textContent = images[current].alt;
    }

    images.forEach(function (img, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'lightbox-trigger';
      button.setAttribute('aria-label', 'View larger: ' + img.alt);
      img.parentNode.insertBefore(button, img);
      button.appendChild(img);
      button.addEventListener('click', function () {
        opener = button;
        show(index);
        dialog.showModal();
      });
    });

    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelectorAll('[data-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () { show(current + Number(btn.getAttribute('data-dir'))); });
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
    dialog.addEventListener('close', function () { if (opener) opener.focus(); });
  }
});