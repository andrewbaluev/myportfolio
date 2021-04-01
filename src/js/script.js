import isMobile from './modules/ismobile.js';
import burger from './modules/burger.js';
import darktheme from './modules/darktheme.js';
import linkClick from './modules/onmenulinkclick.js';
import fixHeader from './modules/fixheader.js';
import isotope from './modules/isotope.js';

window.addEventListener('DOMContentLoaded', () => {
  "use strict";
  isMobile();
  burger(); 
  darktheme();
  linkClick();
  fixHeader();
  isotope();
});
