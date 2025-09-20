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
    loadPageData();
    loadPortfolioPage();
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
    const contactForm = document.getElementById('contact-form');
    const emailAddress = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');
    contactForm.onsubmit = app.onSubmitForm;
  };

  app.onSubmitForm = function (e) {
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
  };

  async function loadPageData() {
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
    app.portfolioItems.forEach((x, i) => {
      const projContainer = document.createElement('div');
      if (i % 2 !== 0) {
        projContainer.classList.add('project-container-odd');
      }

      projContainer.classList.add('project-container');

      const img = document.createElement('img');
      // const img = document.querySelector('.project-container img');
      img.src = x.Img;
      img.alt = x.ImgAlt;
      projContainer.appendChild(img);

      const projDetails = document.createElement('div');
      projDetails.classList.add('project-details');
      const h2 = document.createElement('h2');
      const a = document.createElement('a');
      // const title = document.querySelector('.project-details h2');
      h2.innerText = x.Title;
      a.href = `workitem.html?item=${x.Id}`;
      a.innerText = 'See more';
      projDetails.appendChild(h2);
      projDetails.appendChild(a);

      projContainer.appendChild(projDetails);
      document.querySelector('main').appendChild(projContainer);
    });
  }
})((window.app = window.app || {}));
