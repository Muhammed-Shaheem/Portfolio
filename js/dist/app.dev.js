"use strict";

(function (app) {
  'use strict';

  app.homePage = function () {
    app.getCopyrightYear();
    app.sendEmail();
  };

  app.portfolioPage = function () {
    app.getCopyrightYear();
  };

  app.workItemPage = function () {
    app.getCopyrightYear();
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
})(window.app = window.app || {});