"use strict";

(function (app) {
  'use strict';

  app.portfolioItems = [];
  app.selectedItem = {};

  app.homePage = function () {
    app.getCopyrightYear();
    app.sendEmail();
  };

  app.portfolioPage = function () {
    app.getCopyrightYear();
  };

  app.workItemPage = function () {
    app.getCopyrightYear();
    loadPageData();
    loadSpecificItem();
    updateItemPage();
  };

  app.getCopyrightYear = function () {
    document.querySelector('.year').innerText = new Date().getFullYear();
  };

  app.sendEmail = function () {
    var contactForm = document.getElementById('contact-form');
    var emailAddress = contactForm.querySelector('#email');
    var message = contactForm.querySelector('#message');
    contactForm.onsubmit = app.onSubmitForm;
  };

  app.onSubmitForm = function (e) {
    e.preventDefault();
    var contactForm = document.getElementById('contact-form');
    var emailAddress = contactForm.querySelector('#email');
    var message = contactForm.querySelector('#message');
    var name = contactForm.querySelector('#name');
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=shaheemofcl@gmail.com&su=Contact From ".concat(name.value, "&body=").concat(message.value));
    name.value = '';
    emailAddress.value = '';
    message.value = '';
  };

  function loadPageData() {
    var cacheData, rawData, data;
    return regeneratorRuntime.async(function loadPageData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cacheData = sessionStorage.getItem('site-data');

            if (!(cacheData !== null)) {
              _context.next = 5;
              break;
            }

            app.portfolioItems = JSON.parse(cacheData);
            _context.next = 13;
            break;

          case 5:
            _context.next = 7;
            return regeneratorRuntime.awrap(fetch('./sitedata.json'));

          case 7:
            rawData = _context.sent;
            _context.next = 10;
            return regeneratorRuntime.awrap(rawData.json());

          case 10:
            data = _context.sent;
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  function loadSpecificItem() {
    var params = new URLSearchParams(window.location.search);
    var item = Number.parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }

    app.selectedItem = app.portfolioItems[item - 1];
    app.selectedItem.id = item;
  }

  function updateItemPage() {
    var header = document.getElementById('project-title');
    header.innerText = "0".concat(app.selectedItem.id, ". ").concat(app.selectedItem.Title);
    var img = document.getElementById('project-image');
    img.src = app.selectedItem.Img;
    img.alt = app.selectedItem.ImgAlt;
    var about = document.querySelector('#project-about p');
    about.innerText = app.selectedItem.About;
    var techStackList = document.querySelector('#project-technologies ul');
    var techSection = document.querySelector('#project-technologies');
    var ul = document.createElement('ul');
    app.selectedItem.Technologies.forEach(function (x) {
      var li = document.createElement('li');
      li.innerText = x;
      ul.appendChild(li);
    });
    techStackList.remove();
    techSection.appendChild(ul);
    var challenges = document.querySelector('#project-challenges p');
    challenges.innerText = app.selectedItem.Challenges;
  }
})(window.app = window.app || {});