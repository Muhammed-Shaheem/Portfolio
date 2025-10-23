(function (app) {
  'use strict';
  app.portfolioItems = [];
  app.selectedItem = {};

  app.homePage = function () {
    app.getCopyrightYear();
    sendEmail();
  };

  app.portfolioPage = async function () {
    app.getCopyrightYear();
    await loadPageData();
    loadNavItems();
    loadPortfolioPage();
  };

  app.workItemPage = async function () {
    app.getCopyrightYear();
    await loadPageData();
    loadNavItems();
    loadSpecificItem();
    updateItemPage();
  };

  app.getCopyrightYear = function () {
    document.querySelector('.year').innerText = new Date().getFullYear();
  };

  function sendEmail() {
    const contactForm = document.getElementById('contact-form');
    const emailAddress = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');
    contactForm.onsubmit = onSubmitForm;
  }

  function onSubmitForm(e) {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    const emailAddress = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');
    const name = contactForm.querySelector('#name');
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=shaheemofcl@gmail.com&su=Contact From ${name.value}&body=${message.value}`
    );

    name.value = '';
    emailAddress.value = '';
    message.value = '';
  }

  async function loadPageData() {
    console.log('json check');
    const cacheData = sessionStorage.getItem('site-data');
    if (cacheData !== null) {
      app.portfolioItems = JSON.parse(cacheData);
    } else {
      const rawData = await fetch('./sitedata.json');
      const data = await rawData.json();
      app.portfolioItems = data;
      sessionStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadSpecificItem() {
    const params = new URLSearchParams(window.location.search);
    let item = Number.parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }
    app.selectedItem = app.portfolioItems[item - 1];
    app.selectedItem.id = item;
  }

  function updateItemPage() {
    const body = document.querySelector('body');
    body.style.background =
      'radial-gradient(circle at top left, #101010 0%, #0c0c0c 40%, #080808 100%)';
    body.style.backgroundAttachment = 'fixed';
    body.style.color = '#f5f5f5';
    body.style.fontFamily = "'Poppins', sans-serif";

    const header = document.getElementById('project-title');
    header.innerText = `0${app.selectedItem.id}. ${app.selectedItem.Title}`;

    const img = document.getElementById('project-image');
    img.src = app.selectedItem.Img;
    img.alt = app.selectedItem.ImgAlt;

    const about = document.querySelector('#project-about p');
    about.innerText = app.selectedItem.About;

    const techStackList = document.querySelector('#project-technologies ul');
    const techSection = document.querySelector('#project-technologies');
    const ul = document.createElement('ul');

    app.selectedItem.Technologies.forEach((x) => {
      const li = document.createElement('li');
      li.innerText = x;
      ul.appendChild(li);
    });
    techStackList.remove();
    techSection.appendChild(ul);

    const challenges = document.querySelector('#project-challenges p');
    challenges.innerText = app.selectedItem.Challenges;
  }

  function loadPortfolioPage() {
    const grid = document.querySelector('.projects-grid');

    app.portfolioItems.forEach((x, i) => {
      const projContainer = document.createElement('div');
      projContainer.classList.add('project-card');

      const img = document.createElement('img');
      img.src = x.Img;
      img.alt = x.ImgAlt;

      const details = document.createElement('div');
      details.classList.add('project-info');

      const title = document.createElement('h2');
      title.innerText = x.Title;

      const link = document.createElement('a');
      link.href = `workitem.html?item=${x.Id}`;
      link.innerText = 'See More';

      details.appendChild(title);
      details.appendChild(link);
      projContainer.appendChild(img);
      projContainer.appendChild(details);
      grid.appendChild(projContainer);
    });
  }

  function loadNavItems() {
    const nav = document.querySelector('nav ul');
    app.portfolioItems.forEach((x) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = `workitem.html?item=${x.Id}`;
      a.innerText = x.NavTitle;

      li.appendChild(a);
      nav.appendChild(li);
    });
    // Modern mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('show');
    });
  }
})((window.app = window.app || {}));
