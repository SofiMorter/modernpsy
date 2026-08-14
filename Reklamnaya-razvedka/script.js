/* =========================================================
   РЕКЛАМНАЯ РАЗВЕДКА — скрипты трипваер-страницы.
   1. Появление блоков при скролле
   2. Состояние хедера
   3. Аккордеон вопросов
   4. Форма: галочка допродажи, сумма на кнопке, проверка полей
   5. Липкая кнопка на телефоне
   ========================================================= */

(function () {
  'use strict';

  if (window.__razvedkaInit) return;
  window.__razvedkaInit = true;

  var PRICE = 999;   // основной продукт
  var BUMP = 499;    // разбор текущей посадочной

  function money(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /* ---------- 1. Появление блоков при скролле ---------- */

  function initReveal() {
    var items = [].slice.call(document.querySelectorAll('.r'));
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + 'ms'; });

    var pending = items;
    var ticking = false;

    function sweep() {
      ticking = false;
      var edge = window.innerHeight * 0.9;

      pending = pending.filter(function (el) {
        // Блок вошёл снизу или уже проскочил вверх при быстром скролле
        if (el.getBoundingClientRect().top >= edge) return true;
        el.classList.add('is-in');
        return false;
      });

      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sweep);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sweep();
  }

  /* ---------- 2 и 5. Хедер и липкая кнопка ---------- */

  function initChrome() {
    var hdr = document.querySelector('.hdr');
    var dock = document.querySelector('[data-dock]');
    var checkout = document.getElementById('checkout');
    var ticking = false;

    function update() {
      ticking = false;
      if (hdr) hdr.classList.toggle('is-stuck', window.scrollY > 8);

      // Кнопку показываем, когда первый экран уехал, и прячем у самой формы
      if (dock && checkout) {
        var top = checkout.getBoundingClientRect().top;
        dock.classList.toggle('is-on', window.scrollY > 420 && top > window.innerHeight * 0.8);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- 3. Вопросы: открыт только один ---------- */

  function initFaq() {
    var items = document.querySelectorAll('.qa');
    items.forEach(function (qa) {
      qa.addEventListener('toggle', function () {
        if (!qa.open) return;
        items.forEach(function (other) {
          if (other !== qa) other.open = false;
        });
      });
    });
  }

  /* ---------- 4. Форма ----------
     Оплаты здесь нет: в sendOrder подставьте свой платёжный модуль
     (ЮKassa, Робокасса, форма Тильды с приёмом платежей). */

  function sendOrder(data) {
    // TODO: сюда — создание платежа и редирект на страницу оплаты.
    // После успешной оплаты вести на thanks.html — там оффер на 4 900 ₽.
    if (window.console) console.log('Заказ:', data);
    return Promise.resolve();
  }

  function initForm() {
    var form = document.querySelector('[data-form]');
    if (!form) return;

    var fields = form.querySelectorAll('.field__inp');
    var bumpBox = form.querySelector('[data-bump]');
    var bumpInp = bumpBox && bumpBox.querySelector('input');
    var payBtn = form.querySelector('[data-pay]');

    function refreshTotal() {
      var total = PRICE + (bumpInp && bumpInp.checked ? BUMP : 0);
      if (bumpBox) bumpBox.classList.toggle('is-on', !!(bumpInp && bumpInp.checked));
      if (payBtn) payBtn.textContent = 'Оплатить ' + money(total) + ' ₽';
    }

    if (bumpInp) bumpInp.addEventListener('change', refreshTotal);
    refreshTotal();

    fields.forEach(function (inp) {
      inp.addEventListener('input', function () {
        inp.closest('.field').classList.remove('is-bad');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var bad = null;
      var data = { total: PRICE + (bumpInp && bumpInp.checked ? BUMP : 0) };

      fields.forEach(function (inp) {
        var box = inp.closest('.field');
        var value = inp.value.trim();
        var ok = value.length > 1 && (inp.type !== 'email' || /.+@.+\..+/.test(value));

        if (inp.required && !ok) {
          box.classList.add('is-bad');
          if (!bad) bad = inp;
        } else {
          box.classList.remove('is-bad');
          data[inp.name] = value;
        }
      });

      if (bad) {
        bad.focus();
        return;
      }

      data.bump = !!(bumpInp && bumpInp.checked);
      sendOrder(data);

      var ok = document.createElement('div');
      ok.className = 'form__ok';
      ok.setAttribute('role', 'status');
      ok.innerHTML = '<b>Заказ принят на ' + money(data.total) + ' ₽</b>' +
        '<p>Здесь подключается оплата. После неё отчёт придёт на почту и в телеграм в течение 24 часов.</p>';
      form.replaceWith(ok);
    });
  }

  /* ---------- Запуск ---------- */

  function init() {
    initReveal();
    initChrome();
    initFaq();
    initForm();

    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
