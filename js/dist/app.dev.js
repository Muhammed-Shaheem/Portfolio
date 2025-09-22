"use strict";

(function (app) {
  'use strict';

  app.portfolioItems = [];
  app.selectedItem = {};

  app.homePage = function () {
    app.getCopyrightYear();
    sendEmail();
  };

  app.portfolioPage = function () {
    app.getCopyrightYear();
    loadPortfolioPageAsync();
  };

  app.workItemPage = function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app.getCopyrightYear();
            _context.next = 3;
            return regeneratorRuntime.awrap(loadPageData());

          case 3:
            loadSpecificItem();
            updateItemPage();

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  app.getCopyrightYear = function () {
    document.querySelector('.year').innerText = new Date().getFullYear();
  };

  function sendEmail() {
    var contactForm = document.getElementById('contact-form');
    var emailAddress = contactForm.querySelector('#email');
    var message = contactForm.querySelector('#message');
    contactForm.onsubmit = onSubmitForm;
  }

  function onSubmitForm(e) {
    e.preventDefault();
    var contactForm = document.getElementById('contact-form');
    var emailAddress = contactForm.querySelector('#email');
    var message = contactForm.querySelector('#message');
    var name = contactForm.querySelector('#name');
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=shaheemofcl@gmail.com&su=Contact From ".concat(name.value, "&body=").concat(message.value));
    name.value = '';
    emailAddress.value = '';
    message.value = '';
  }

  function loadPageData() {
    var cacheData, rawData, data;
    return regeneratorRuntime.async(function loadPageData$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('json check');
            cacheData = sessionStorage.getItem('site-data');

            if (!(cacheData !== null)) {
              _context2.next = 6;
              break;
            }

            app.portfolioItems = JSON.parse(cacheData);
            _context2.next = 14;
            break;

          case 6:
            _context2.next = 8;
            return regeneratorRuntime.awrap(fetch('./sitedata.json'));

          case 8:
            rawData = _context2.sent;
            _context2.next = 11;
            return regeneratorRuntime.awrap(rawData.json());

          case 11:
            data = _context2.sent;
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));

          case 14:
          case "end":
            return _context2.stop();
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

  function loadPortfolioPageAsync() {
    var main;
    return regeneratorRuntime.async(function loadPortfolioPageAsync$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(loadPageData());

          case 2:
            main = document.querySelector('main');
            app.portfolioItems.forEach(function (x, i) {
              var projContainer = document.createElement('div');

              if (i % 2 !== 0) {
                projContainer.classList.add('project-container-odd');
              }

              projContainer.classList.add('project-container');
              var img = document.createElement('img');
              img.src = x.Img;
              img.alt = x.ImgAlt;
              projContainer.appendChild(img);
              var projDetails = document.createElement('div');
              projDetails.classList.add('project-details');
              var h2 = document.createElement('h2');
              var a = document.createElement('a');
              h2.innerText = x.Title;
              a.href = "workitem.html?item=".concat(x.Id);
              a.innerText = 'See more';
              projDetails.appendChild(h2);
              projDetails.appendChild(a);
              projContainer.appendChild(projDetails);
              main.appendChild(projContainer);
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
})(window.app = window.app || {});