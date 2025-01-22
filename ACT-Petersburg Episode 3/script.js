// document.addEventListener('DOMContentLoaded', function () {
//     const menuToggle = document.querySelector('.menu-toggle'); // Кнопка "Меню"
//     const menu = document.querySelector('.menu'); // Контейнер меню первого уровня
//     const menuItems = document.querySelectorAll('.menu__item'); // Пункты первого уровня
//     let activeSubmenu = null; // Переменная для хранения активного подменю

//     // Открытие/закрытие меню первого уровня
//     menuToggle.addEventListener('click', (e) => {
//       e.stopPropagation(); // Останавливаем всплытие
//       if (menu.style.display === 'none' || !menu.style.display) {
//         menu.style.display = 'block';
//       } else {
//         menu.style.display = 'none';
//       }
//     });

//     // Открытие второго уровня при наведении или клике
//     menuItems.forEach((item) => {
//       const submenu = item.querySelector('.submenu');

//       // Наведение на пункт меню первого уровня
//       item.addEventListener('mouseenter', () => {
//         if (submenu) {
//           if (activeSubmenu && activeSubmenu !== submenu) {
//             activeSubmenu.style.display = 'none'; // Закрываем предыдущее меню
//           }
//           submenu.style.display = 'block'; // Открываем текущее меню
//           activeSubmenu = submenu; // Сохраняем текущее меню как активное
//         }
//       });

//       // Клик по пункту меню первого уровня
//       item.addEventListener('click', (e) => {
//         e.stopPropagation(); // Останавливаем всплытие
//         if (submenu) {
//           if (activeSubmenu && activeSubmenu !== submenu) {
//             activeSubmenu.style.display = 'none'; // Закрываем предыдущее меню
//           }
//           submenu.style.display = 'block'; // Открываем текущее меню
//           activeSubmenu = submenu; // Сохраняем текущее меню как активное
//         }
//       });
//     });

//     // Закрытие всего меню при клике за пределами
//     document.addEventListener('click', () => {
//       if (menu.style.display === 'block') {
//         menu.style.display = 'none'; // Закрываем меню
//         if (activeSubmenu) {
//           activeSubmenu.style.display = 'none'; // Закрываем активное подменю
//           activeSubmenu = null; // Сбрасываем активное подменю
//         }
//       }
//     });

//     // Остановка закрытия при клике внутри меню
//     menu.addEventListener('click', (e) => {
//       e.stopPropagation(); // Останавливаем всплытие, чтобы меню не закрывалось
//     });
//   });

//

// Находим элементы
const burger = document.querySelector('.burger')
const menu = document.querySelector('.menu')
const overlay = document.querySelector('.overlay')
const ticketBtn = document.querySelector('.ticket-btn')
const menuLinks = document.querySelectorAll('.menu ul li a')

// Функция открытия/закрытия меню
function toggleMenu () {
  burger.classList.toggle('active') // Анимация бургера
  menu.classList.toggle('active') // Показ/скрытие меню
  overlay.classList.toggle('active') // Показ/скрытие затемнения
}

// Открытие/закрытие меню при клике на бургер
burger.addEventListener('click', toggleMenu)

// Закрытие меню при клике на затемнение
overlay.addEventListener('click', toggleMenu)

// Закрытие меню при клике на любую ссылку
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu() // Закрываем меню
  })
})

const accordionItems = document.querySelectorAll('.accordion-item')

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header') // Заголовок
  const content = item.querySelector('.accordion-content') // Контент карточки

  header.addEventListener('click', () => {
    // Закрываем все остальные карточки
    accordionItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherContent = otherItem.querySelector('.accordion-content')
        otherItem.classList.remove('active')
        otherContent.style.maxHeight = null // Сбрасываем высоту
      }
    })

    // Открываем/закрываем текущую карточку
    if (item.classList.contains('active')) {
      item.classList.remove('active')
      content.style.maxHeight = null // Сбрасываем высоту
    } else {
      item.classList.add('active')
      content.style.maxHeight = content.scrollHeight + 'px' // Устанавливаем реальную высоту
    }
  })
})
