"use strict";

(function (app) {
  'use strict';

  app.portfolioItems = [];
  app.selectedItem = {};

  app.homePage = function () {
    app.getCopyrightYear();
    sendEmail();
  };

  app.portfolioPage = function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app.getCopyrightYear();
            _context.next = 3;
            return regeneratorRuntime.awrap(loadPageData());

          case 3:
            loadNavItems();
            loadPortfolioPage();

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  app.workItemPage = function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app.getCopyrightYear();
            _context2.next = 3;
            return regeneratorRuntime.awrap(loadPageData());

          case 3:
            loadNavItems();
            loadSpecificItem();
            updateItemPage();

          case 6:
          case "end":
            return _context2.stop();
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
    return regeneratorRuntime.async(function loadPageData$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('json check');
            cacheData = sessionStorage.getItem('site-data');

            if (!(cacheData !== null)) {
              _context3.next = 6;
              break;
            }

            app.portfolioItems = JSON.parse(cacheData);
            _context3.next = 14;
            break;

          case 6:
            _context3.next = 8;
            return regeneratorRuntime.awrap(fetch('./sitedata.json'));

          case 8:
            rawData = _context3.sent;
            _context3.next = 11;
            return regeneratorRuntime.awrap(rawData.json());

          case 11:
            data = _context3.sent;
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));

          case 14:
          case "end":
            return _context3.stop();
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
    var body = document.querySelector('body');
    body.style.background = 'radial-gradient(circle at top left, #101010 0%, #0c0c0c 40%, #080808 100%)';
    body.style.backgroundAttachment = 'fixed';
    body.style.color = '#f5f5f5';
    body.style.fontFamily = "'Poppins', sans-serif";
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

  function loadPortfolioPage() {
    var grid = document.querySelector('.projects-grid');
    app.portfolioItems.forEach(function (x, i) {
      var projContainer = document.createElement('div');
      projContainer.classList.add('project-card');
      var img = document.createElement('img');
      img.src = x.Img;
      img.alt = x.ImgAlt;
      var details = document.createElement('div');
      details.classList.add('project-info');
      var title = document.createElement('h2');
      title.innerText = x.Title;
      var link = document.createElement('a');
      link.href = "workitem.html?item=".concat(x.Id);
      link.innerText = 'See More';
      details.appendChild(title);
      details.appendChild(link);
      projContainer.appendChild(img);
      projContainer.appendChild(details);
      grid.appendChild(projContainer);
    });
  }

  function loadNavItems() {
    var nav = document.querySelector("nav ul");

    if (!nav) {
      console.warn("Navigation <ul> element not found.");
      return;
    }

    if (!app || !Array.isArray(app.portfolioItems)) {
      console.error("Portfolio items not available in app object.");
      return;
    } // ✅ Clear old nav items first (in case of reload)


    nav.innerHTML = ""; // ✅ Add Home and Projects manually first

    var staticLinks = [{
      href: "index.html",
      text: "Home"
    }, {
      href: "portfolio.html",
      text: "Projects"
    }];
    staticLinks.forEach(function (link) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = link.href;
      a.innerText = link.text;
      a.classList.add("nav-link");
      li.appendChild(a);
      nav.appendChild(li);
    }); // ✅ Dynamically add project links from JSON

    app.portfolioItems.forEach(function (x) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "workitem.html?item=".concat(x.Id);
      a.innerText = x.NavTitle;
      a.classList.add("nav-link");
      li.appendChild(a);
      nav.appendChild(li);
    }); // ✅ Highlight active page link

    var currentPage = window.location.pathname.split("/").pop();
    nav.querySelectorAll("a").forEach(function (a) {
      if (a.getAttribute("href") === currentPage) {
        a.classList.add("active");
      }
    });
  }
})(window.app = window.app || {});