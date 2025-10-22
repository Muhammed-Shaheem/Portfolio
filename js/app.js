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
  const main = document.querySelector("main");
  if (!main) {
    console.warn("<main> element not found.");
    return;
  }

  if (!app || !Array.isArray(app.portfolioItems)) {
    console.error("Portfolio items not found in app object.");
    return;
  }

  // Clear existing content
  main.innerHTML = "";



  // Create container for all projects
  const portfolioGrid = document.createElement("div");
  portfolioGrid.classList.add("portfolio-grid");

  app.portfolioItems.forEach((x) => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    card.innerHTML = `
      <img src="${x.Img}" alt="${x.ImgAlt}" loading="lazy" />
      <div class="project-content">
        <h2>${x.Title}</h2>
        <p>${x.Description || "A project built to explore and apply my software engineering skills."}</p>
        <a href="workitem.html?item=${x.Id}" class="btn">View Details</a>
      </div>
    `;

    portfolioGrid.appendChild(card);
  });

  main.appendChild(portfolioGrid);
}


 function loadNavItems() {
  const nav = document.querySelector("nav ul");
  if (!nav) {
    console.warn("Navigation <ul> element not found.");
    return;
  }

  if (!app || !Array.isArray(app.portfolioItems)) {
    console.error("Portfolio items not available in app object.");
    return;
  }

  // ✅ Clear old nav items first (in case of reload)
  nav.innerHTML = "";

  // ✅ Add Home and Projects manually first
  const staticLinks = [
    { href: "index.html", text: "Home" },
    { href: "portfolio.html", text: "Projects" },
  ];

  staticLinks.forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.href;
    a.innerText = link.text;
    a.classList.add("nav-link");
    li.appendChild(a);
    nav.appendChild(li);
  });

  // ✅ Dynamically add project links from JSON
  app.portfolioItems.forEach((x) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `workitem.html?item=${x.Id}`;
    a.innerText = x.NavTitle;
    a.classList.add("nav-link");

    li.appendChild(a);
    nav.appendChild(li);
  });

  // ✅ Highlight active page link
  const currentPage = window.location.pathname.split("/").pop();
  nav.querySelectorAll("a").forEach((a) => {
    if (a.getAttribute("href") === currentPage) {
      a.classList.add("active");
    }
  });
}

})((window.app = window.app || {}));
