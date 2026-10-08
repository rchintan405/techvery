/**
 * Techvery - Responsive Mobile Navigation & Sidebar Drawer
 */
(function () {
  'use strict';

  function initMobileNav() {
    // Determine relative root prefix based on current script or pathname
    var scripts = document.getElementsByTagName('script');
    var rootPrefix = '';
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (src && src.indexOf('mobile-nav.js') !== -1) {
        rootPrefix = src.replace('assets/js/mobile-nav.js', '');
        break;
      }
    }

    var navbarWrapper = document.querySelector('.navbar-wrapper');
    if (!navbarWrapper) return;

    // Check if toggle button already exists, if not create it
    var toggleBtn = document.getElementById('mobile-nav-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.id = 'mobile-nav-toggle';
      toggleBtn.className = 'mobile-nav-toggle';
      toggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML =
        '<svg class="mobile-nav-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve">' +
        '<g><path d="M128 102.4c0-14.138 11.462-25.6 25.6-25.6h332.8c14.138 0 25.6 11.462 25.6 25.6S500.538 128 486.4 128H153.6c-14.138 0-25.6-11.463-25.6-25.6m358.4 128H25.6C11.462 230.4 0 241.863 0 256s11.462 25.6 25.6 25.6h460.8c14.138 0 25.6-11.462 25.6-25.6 0-14.137-11.462-25.6-25.6-25.6m0 153.6H256c-14.137 0-25.6 11.462-25.6 25.6 0 14.137 11.463 25.6 25.6 25.6h230.4c14.138 0 25.6-11.463 25.6-25.6S500.538 384 486.4 384" fill="currentColor"></path></g>' +
        '</svg>';
      navbarWrapper.appendChild(toggleBtn);
    }

    // Check if sidebar drawer & overlay already exist, if not create them
    var overlay = document.getElementById('mobile-nav-overlay');
    var drawer = document.getElementById('mobile-sidebar-drawer');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobile-nav-overlay';
      overlay.className = 'mobile-nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    // Determine current active page
    var currentPath = window.location.pathname.toLowerCase();
    var isHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('home-2.html') || currentPath === '';
    var isServices = currentPath.indexOf('service') !== -1;
    var isPortfolio = currentPath.indexOf('featured-work') !== -1;
    var isAbout = currentPath.indexOf('about') !== -1;
    var isCaseStudies = currentPath.indexOf('case-stud') !== -1;
    var isBlog = currentPath.indexOf('blog') !== -1;
    var isContact = currentPath.indexOf('contact') !== -1;

    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'mobile-sidebar-drawer';
      drawer.className = 'mobile-sidebar-drawer';
      drawer.setAttribute('aria-label', 'Mobile Navigation');
      drawer.setAttribute('aria-hidden', 'true');

      drawer.innerHTML =
        '<div class="mobile-sidebar-header">' +
        '<a href="' + rootPrefix + 'index.html" class="mobile-sidebar-logo">' +
        '<img src="' + rootPrefix + 'assets/images/logo.png" alt="Techvery Logo" width="60" class="nav-logo" />' +
        '</a>' +
        '<button class="mobile-sidebar-close" id="mobile-sidebar-close" aria-label="Close Navigation Menu">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"></line>' +
        '<line x1="6" y1="6" x2="18" y2="18"></line>' +
        '</svg>' +
        '</button>' +
        '</div>' +

        '<nav class="mobile-sidebar-nav">' +
        '<ul class="mobile-nav-list">' +
        '<li class="mobile-nav-item">' +
        '<a href="' + rootPrefix + 'index.html" class="mobile-nav-link ' + (isHome ? 'active' : '') + '">' +
        '<span>Home</span>' +
        '<svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
        '</a>' +
        '</li>' +
        '<li class="mobile-nav-item">' +
        '<a href="' + rootPrefix + 'service/service.html" class="mobile-nav-link ' + (isServices ? 'active' : '') + '">' +
        '<span>Services</span>' +
        '<svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
        '</a>' +
        '</li>' +
        '<li class="mobile-nav-item">' +
        '<a href="' + rootPrefix + 'featured-work.html" class="mobile-nav-link ' + (isPortfolio ? 'active' : '') + '">' +
        '<span>Portfolio</span>' +
        '<svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
        '</a>' +
        '</li>' +
        '</ul>' +
        '</nav>' +

        '<div class="mobile-sidebar-footer">' +
        '<div class="mobile-sidebar-cta">' +
        '<a href="' + rootPrefix + 'contact.html" class="hero-1-primary-button w-inline-block mobile-sidebar-cta-btn">' +
        '<div class="primary-button-text-wrapper">' +
        '<div class="primary-button-text is-relative">LET’S TALK</div>' +
        '</div>' +
        '<div class="hero-primary-button-icon-wrapper">' +
        '<div class="primary-button-icon is-relative w-embed">' +
        '<svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M9.61648 5.8006L0.360093 0.0358623C0.250469 -0.0329162 0.105835 0.000195883 0.0370565 0.109843C0.0155525 0.144118 0.00328985 0.183378 0.0014624 0.223799C-0.000365041 0.264221 0.00830504 0.304427 0.0266285 0.340503L2.85674 5.99955L0.0254568 11.6595C-0.0331514 11.7749 0.0128727 11.916 0.128261 11.9746C0.164336 11.9929 0.204543 12.0016 0.244965 11.9998C0.285387 11.998 0.324647 11.9857 0.358921 11.9642L9.61531 6.19944C9.7253 6.13127 9.75924 5.98683 9.69104 5.87681C9.67198 5.84605 9.64606 5.82013 9.61531 5.80107L9.61648 5.8006Z" fill="#FF5812" />' +
        '</svg>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</div>' +
        '<div class="mobile-sidebar-contact-info">' +
        '<a href="mailto:aliah@techvery.com" class="mobile-sidebar-email">aliah@techvery.com</a>' +
        '</div>' +
        '<div class="mobile-sidebar-socials">' +
        '<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" class="mobile-social-icon" aria-label="Instagram">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>' +
        '</a>' +
        '<a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" class="mobile-social-icon" aria-label="LinkedIn">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>' +
        '</a>' +
        '<a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" class="mobile-social-icon" aria-label="Twitter">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>' +
        '</a>' +
        '<a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" class="mobile-social-icon" aria-label="Facebook">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>' +
        '</a>' +
        '</div>' +
        '</div>';

      document.body.appendChild(drawer);
    }

    var closeBtn = document.getElementById('mobile-sidebar-close');

    function openSidebar() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-locked');
    }

    function closeSidebar() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-locked');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drawer.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSidebar();
      });
    }

    overlay.addEventListener('click', function () {
      closeSidebar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeSidebar();
      }
    });

    var navLinks = drawer.querySelectorAll('.mobile-nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeSidebar();
      });
    });
  }

  function initWhatsAppButton() {
    if (document.getElementById('floating-whatsapp-btn')) return;
    var btn = document.createElement('a');
    btn.id = 'floating-whatsapp-btn';
    btn.className = 'floating-whatsapp-btn';
    btn.href = 'https://wa.me/971542817257';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class="hovered-paths"><g><path d="M256.064 0h-.128C114.784 0 0 114.816 0 256c0 56 18.048 107.904 48.736 150.048l-31.904 95.104 98.4-31.456C155.712 496.512 204 512 256.064 512 397.216 512 512 397.152 512 256S397.216 0 256.064 0" fill="#4caf50"></path><path d="M405.024 361.504c-6.176 17.44-30.688 31.904-50.24 36.128-13.376 2.848-30.848 5.12-89.664-19.264-75.232-31.168-123.68-107.616-127.456-112.576-3.616-4.96-30.4-40.48-30.4-77.216s18.656-54.624 26.176-62.304c6.176-6.304 16.384-9.184 26.176-9.184 3.168 0 6.016.16 8.576.288 7.52.32 11.296.768 16.256 12.64 6.176 14.88 21.216 51.616 23.008 55.392 1.824 3.776 3.648 8.896 1.088 13.856-2.4 5.12-4.512 7.392-8.288 11.744s-7.36 7.68-11.136 12.352c-3.456 4.064-7.36 8.416-3.008 15.936 4.352 7.36 19.392 31.904 41.536 51.616 28.576 25.44 51.744 33.568 60.032 37.024 6.176 2.56 13.536 1.952 18.048-2.848 5.728-6.176 12.8-16.416 20-26.496 5.12-7.232 11.584-8.128 18.368-5.568 6.912 2.4 43.488 20.48 51.008 24.224 7.52 3.776 12.48 5.568 14.304 8.736 1.792 3.168 1.792 18.048-4.384 35.52" fill="#fafafa"></path></g></svg>';
    document.body.appendChild(btn);
  }

  function init() {
    initMobileNav();
    initWhatsAppButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
