/* =========================================================
   СБОРКА — скрипты лендинга.
   1. A/B первого экрана: ?v=a (по умолчанию), ?v=b, ?v=c
   2. Появление блоков при скролле
   3. Состояние хедера
   4. Аккордеон вопросов
   5. Формы: проверка полей и состояние «отправлено»
   6. Запасной вид для незагрузившихся картинок
   ========================================================= */

(function () {
  'use strict';

  // На Тильде скрипт может подключиться дважды — защищаемся
  if (window.__sborkaInit) return;
  window.__sborkaInit = true;

  /* ---------- 1. Варианты первого экрана ----------
     Тексты из ТЗ. Проверять так: /?v=b, /?v=c — удобно лить трафик
     на разные варианты и сравнивать конверсию. */

  var HERO = {
    a: {
      title: 'Посадочные страницы <em>за&nbsp;два дня</em>, а&nbsp;не за месяц',
      lead: 'Собираем лендинги под каждую услугу, гео и кампанию — в темпе, в котором вы тестируете рекламу. Ставим на вашу площадку, править сможете сами.',
      cta: 'Получить бесплатный разбор и готовый экран',
      note: 'Пришлём анализ рекламы ваших конкурентов и один свёрстанный первый экран. Без созвона и без обязательств.'
    },
    b: {
      title: 'Вы и три ваших конкурента выглядите одинаково. <em>Клик стоит одинаково</em>',
      lead: 'Разбираем, что крутят конкуренты в Директе, и делаем посадочные, которые отличаются. Пять страниц в неделю вместо одной в месяц.',
      cta: 'Показать разбор моей ниши',
      note: 'Бесплатно, за один день.'
    },
    c: {
      title: 'Одна посадочная на все услуги — это ваш <em>потолок конверсии</em>',
      lead: 'Отдельная страница под каждый дорогой запрос. Делаем за два дня, ставим на вашу площадку.',
      cta: 'Собрать первый экран бесплатно',
      note: 'Пришлём анализ рекламы ваших конкурентов и один свёрстанный первый экран. Без созвона и без обязательств.'
    }
  };

  function applyHeroVariant() {
    var v = (new URLSearchParams(window.location.search).get('v') || 'a').toLowerCase();
    var data = HERO[v];
    if (!data || v === 'a') return; // вариант A уже свёрстан в HTML

    Object.keys(data).forEach(function (key) {
      var node = document.querySelector('[data-hero="' + key + '"]');
      if (node) node.innerHTML = data[key];
    });
    document.documentElement.setAttribute('data-variant', v);
  }

  /* ---------- 2. Появление блоков при скролле ---------- */

  function initReveal() {
    var items = [].slice.call(document.querySelectorAll('.r'));
    if (!items.length) return;

    function showAll() {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll();
      return;
    }

    // Небольшая лесенка внутри одной группы
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + 'ms'; });

    var pending = items;
    var ticking = false;

    function sweep() {
      ticking = false;
      var edge = window.innerHeight * 0.9;

      pending = pending.filter(function (el) {
        // Блок вошёл снизу или уже проскочил вверх (быстрый скролл, переход по якорю)
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

  /* ---------- 3. Хедер: линия появляется после прокрутки ---------- */

  function initHeader() {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 4. Вопросы: открыт только один ---------- */

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

  /* ---------- 5. Формы ----------
     Отправки на сервер здесь нет: подключите свой обработчик
     (Тильда-форма, вебхук, CRM) в функции sendLead. */

  function sendLead(data) {
    // TODO: сюда — реальная отправка. Пример:
    // return fetch('https://ваш-обработчик', {method:'POST', body: JSON.stringify(data)});
    if (window.console) console.log('Заявка:', data);
    return Promise.resolve();
  }

  function initForms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      var fields = form.querySelectorAll('.field__inp');

      fields.forEach(function (inp) {
        inp.addEventListener('input', function () {
          inp.closest('.field').classList.remove('is-bad');
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var bad = null;
        var data = {};

        fields.forEach(function (inp) {
          var box = inp.closest('.field');
          var value = inp.value.trim();
          if (inp.required && value.length < 2) {
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

        data.variant = document.documentElement.getAttribute('data-variant') || 'a';
        sendLead(data);

        var ok = document.createElement('div');
        ok.className = 'form__ok';
        ok.setAttribute('role', 'status');
        ok.innerHTML = '<b>Приняли. Разбор будет через один-два дня</b>' +
          '<p>Пришлём анализ рекламы конкурентов и первый экран. Если что-то уточним — напишем, звонить не будем.</p>';
        form.replaceWith(ok);
      });
    });
  }

  /* ---------- 6. Картинки работ: запасной вид ---------- */

  function initShots() {
    document.querySelectorAll('.work__shot img').forEach(function (img) {
      function fail() { img.closest('.work__shot').classList.add('is-empty'); }
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }

  /* ---------- Запуск ---------- */

  function init() {
    applyHeroVariant();
    initReveal();
    initHeader();
    initFaq();
    initForms();
    initShots();

    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
