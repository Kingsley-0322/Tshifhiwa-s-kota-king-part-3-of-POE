/* forms.js — client-side validation for the contact and enquiry forms.
   - contact.html: validates, then compiles the message into an email to RECIPIENT
     (opens the visitor's email app with the message ready to send).
   - enquiries.html: validates, works out a cost and availability response,
     and sends the enquiry in the background with fetch (AJAX).
   Validation approach adapted from MDN Web Docs (2026b). */
(function () {
  'use strict';

  var RECIPIENT = 'hello@kotaking.co.za'; // where contact-form emails are addressed
  var SHOP_PHONE = '076 498 5798';

  var PHONE_RE = /^(?:\+27|0)[1-8]\d{8}$/;               // South African numbers, spaces removed
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME_RE = /^[A-Za-z\u00C0-\u024F'\u2019\- ]{2,60}$/;

  /* ---------- helpers ---------- */
  function showError(el, msg) {
    var wrap = el.closest('.form-field');
    var err = wrap.querySelector('.form-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-error';
      err.id = el.id + '-error';
      wrap.appendChild(err);
    }
    err.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', err.id);
  }

  function clearError(el) {
    var err = el.closest('.form-field').querySelector('.form-error');
    if (err) err.remove();
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }

  function checkField(form, rules, id) {
    var el = form.querySelector('#' + id);
    if (!el) return null;
    var msg = rules[id](el.value.trim(), el, form);
    if (msg) { showError(el, msg); return el; }
    clearError(el);
    return null;
  }

  function validate(form, rules) {
    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
      var bad = checkField(form, rules, id);
      if (bad && !firstBad) firstBad = bad;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function validateOnBlur(form, rules) {
    form.addEventListener('focusout', function (e) {
      if (e.target.id && rules[e.target.id]) checkField(form, rules, e.target.id);
    });
    // Once a field is showing an error, re-check it as the visitor fixes it
    // (typing, or picking a different option in a dropdown).
    ['input', 'change'].forEach(function (type) {
      form.addEventListener(type, function (e) {
        if (e.target.id && rules[e.target.id] && e.target.getAttribute('aria-invalid') === 'true') {
          checkField(form, rules, e.target.id);
        }
      });
    });
  }

  function cleanPhone(v) { return v.replace(/[\s\-()]/g, ''); }

  function required(label) {
    return function (v) { return v ? '' : 'Enter ' + label + '.'; };
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function showPanel(panel, title, nodes) {
    panel.textContent = '';
    panel.appendChild(el('h3', '', title));
    nodes.forEach(function (n) { panel.appendChild(n); });
    panel.hidden = false;
    panel.focus();
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- contact form ---------- */
  var contact = document.getElementById('contact-form');
  if (contact) {
    var contactRules = {
      'c-name': function (v) {
        if (!v) return 'Enter your full name.';
        return NAME_RE.test(v) ? '' : 'Use letters only, between 2 and 60 characters.';
      },
      'c-phone': function (v) {
        if (!v) return 'Enter your phone number.';
        return PHONE_RE.test(cleanPhone(v)) ? '' : 'Enter a South African number, like 076 498 5798.';
      },
      'c-email': function (v) {
        if (!v) return 'Enter your email address.';
        return EMAIL_RE.test(v) ? '' : 'Enter an email address like name@example.com.';
      },
      'c-type': required('the type of message'),
      'c-message': function (v) {
        if (!v) return 'Type your message.';
        if (v.length < 10) return 'Write at least 10 characters so we can help.';
        return v.length > 1000 ? 'Keep the message under 1000 characters.' : '';
      }
    };
    validateOnBlur(contact, contactRules);

    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(contact, contactRules)) return;

      var typeSelect = contact.querySelector('#c-type');
      var typeLabel = typeSelect.options[typeSelect.selectedIndex].text;
      var name = contact.querySelector('#c-name').value.trim();
      var body = [
        'Name: ' + name,
        'Phone: ' + contact.querySelector('#c-phone').value.trim(),
        'Email: ' + contact.querySelector('#c-email').value.trim(),
        'Message type: ' + typeLabel,
        '',
        contact.querySelector('#c-message').value.trim()
      ].join('\r\n');
      var href = 'mailto:' + RECIPIENT +
        '?subject=' + encodeURIComponent(typeLabel + ' from ' + name) +
        '&body=' + encodeURIComponent(body);

      var link = el('a', 'btn btn-outline', 'Open the email again');
      link.href = href;
      showPanel(document.getElementById('contact-result'), 'Your email is ready to send', [
        el('p', '', 'Your email app should have opened with your message to ' + RECIPIENT + '. Press send there to finish.'),
        link
      ]);
      window.location.href = href;
    });
  }

  /* ---------- enquiry form ---------- */
  var enquiry = document.getElementById('enquiry-form');
  if (enquiry) {
    var menu = window.KOTA_MENU || [];
    var kotaSelect = enquiry.querySelector('#kota');
    menu.filter(function (m) { return m.category === 'kota'; }).forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.no + '. ' + m.name + ' (R' + m.price + ')';
      kotaSelect.appendChild(opt);
    });

    var dateInput = enquiry.querySelector('#pickup-date');
    function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
    function iso(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function parseDate(v) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function fmtDate(d) {
      return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    var today = startOfDay(new Date());
    dateInput.min = iso(today);

    var enquiryRules = {
      'fullname': contactRulesName,
      'phone': function (v) {
        if (!v) return 'Enter your phone number.';
        return PHONE_RE.test(cleanPhone(v)) ? '' : 'Enter a South African number, like 076 498 5798.';
      },
      'email': function (v) {
        return !v || EMAIL_RE.test(v) ? '' : 'Enter an email address like name@example.com, or leave it empty.';
      },
      'enquiry-type': required('the type of enquiry'),
      'kota': required('the kota you want'),
      'quantity': function (v) {
        if (!v) return 'Enter how many you need.';
        var n = Number(v);
        if (!Number.isInteger(n) || n < 1 || n > 200) return 'Enter a whole number from 1 to 200.';
        return '';
      },
      'pickup-date': function (v) {
        if (!v) return 'Choose the date you need your order.';
        return parseDate(v) < today ? 'Choose today or a later date.' : '';
      },
      'message': function (v) {
        if (!v) return '';
        if (v.length < 10) return 'Write at least 10 characters, or leave this empty.';
        return v.length > 500 ? 'Keep the message under 500 characters.' : '';
      }
    };
    function contactRulesName(v) {
      if (!v) return 'Enter your full name.';
      return NAME_RE.test(v) ? '' : 'Use letters only, between 2 and 60 characters.';
    }
    validateOnBlur(enquiry, enquiryRules);

    function buildQuote(item, qty) {
      var subtotal = item.price * qty;
      var discount = qty >= 20 ? subtotal * 0.1 : 0; // 10% off orders of 20 or more
      return { unit: item.price, subtotal: subtotal, discount: discount, total: subtotal - discount };
    }

    function nextOpenDay(from) {
      var d = new Date(from);
      do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0);
      return d;
    }

    function checkAvailability(date, qty) {
      if (date.getDay() === 0) {
        return { ok: false, text: 'We are closed on Sundays. The next day we can serve you is ' + fmtDate(nextOpenDay(date)) + '.' };
      }
      var tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      if (qty >= 20 && date < tomorrow) {
        var earliest = tomorrow.getDay() === 0 ? nextOpenDay(tomorrow) : tomorrow;
        return { ok: false, text: 'Orders of 20 or more need 24 hours’ notice. The earliest date is ' + fmtDate(earliest) + '.' };
      }
      return { ok: true, text: 'We can fill this order on ' + fmtDate(date) + '. Collect between 10:00 and 20:00.' };
    }

    function money(n) { return 'R' + n.toFixed(2); }

    function sendInBackground(form) {
      var data = new URLSearchParams(new FormData(form));
      return fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
      });
    }

    enquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(enquiry, enquiryRules)) return;

      var item = menu.filter(function (m) { return m.id === kotaSelect.value; })[0];
      var qty = Number(enquiry.querySelector('#quantity').value);
      var date = parseDate(dateInput.value);
      var quote = buildQuote(item, qty);
      var avail = checkAvailability(date, qty);

      var rows = el('dl', 'quote-list');
      [
        [qty + ' × ' + item.name, money(quote.subtotal)],
        ['Bulk discount (10%)', quote.discount ? '−' + money(quote.discount) : 'Not applicable'],
        ['Estimated total', money(quote.total)]
      ].forEach(function (r, i) {
        var dt = el('dt', '', r[0]);
        var dd = el('dd', i === 2 ? 'quote-total' : '', r[1]);
        rows.appendChild(dt);
        rows.appendChild(dd);
      });

      var availability = el('p', 'availability ' + (avail.ok ? 'is-ok' : 'is-no'), avail.text);
      var status = el('p', 'form-note', 'Sending your enquiry to the shop…');
      status.setAttribute('aria-live', 'polite');
      showPanel(document.getElementById('enquiry-result'), 'Your quote', [
        rows,
        availability,
        el('p', 'form-note', 'Estimates only. We confirm the final price when we call you.'),
        status
      ]);

      var button = enquiry.querySelector('button[type="submit"]');
      button.disabled = true;
      sendInBackground(enquiry).then(function () {
        status.textContent = 'Your enquiry has been sent. We will call you on ' + enquiry.querySelector('#phone').value.trim() + ' to confirm.';
        enquiry.reset();
        dateInput.min = iso(today);
      }).catch(function () {
        status.textContent = 'We could not send your enquiry online. Please call ' + SHOP_PHONE + ' and quote the figures above.';
      }).then(function () { button.disabled = false; });
    });
  }
})();