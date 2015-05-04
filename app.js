'use strict';

var awesomeApp = {
  theUrl: 'http://api.makerspace.com/v1/search?search=cool',
  data: [],
  currentLightbox: {},
  get: function(theUrl) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', theUrl);
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error('Network Error'));
      };
      req.send();
    });
  },
  handler: function(response) {
    awesomeApp.data = response;
    document.getElementById('content').innerHTML = '';
    for (var i = 0; i < response.length; i++) {
      var item = response[i];
      if (item.card_photo_url[0] == '/') {
        item.card_photo_url = item.card_photo_url.slice(1);
      }
      document.getElementById('content').innerHTML +=
        '<div class=\"block\" onclick=\"awesomeApp.blockSelect(\'' +
        item.photo_url + '\',' + i +
        ')\">' +
        '<img src=\"' + item.card_photo_url + '\">' +
        '<h3 class=\"block-name\">' + item.title + '</h3>' +
        '</div>';
    }
  },
  init: function() {
    awesomeApp.get(awesomeApp.theUrl)
      .then(function(response) {
        response = JSON.parse(response);
        awesomeApp.handler(response.projects.records);
      }, function(error) {
        // error
      });
  },
  blockSelect: function(img, index) {
    document.getElementById('lightbox').className = 'active';
    document.getElementById('modal-bg').className = 'active';
    awesomeApp.setCurrentItem(index);
  },
  closeModal: function() {
    document.getElementById('lightbox').className = '';
    document.getElementById('modal-bg').className = '';
  },
  nextButton: function() {
    if (awesomeApp.currentIndex == awesomeApp.data.length - 1) return;
    var i = awesomeApp.currentIndex += 1;
    awesomeApp.setCurrentItem(i);
  },
  prevButton: function() {
    if (awesomeApp.currentIndex === 0) return;
    var i = awesomeApp.currentIndex -= 1;
    awesomeApp.setCurrentItem(i);
  },
  setCurrentItem: function(index) {
    awesomeApp.currentIndex = index;
    awesomeApp.currentImg = awesomeApp.data[index].photo_url;
    awesomeApp.currentTitle = awesomeApp.data[index].title;
    // old school setters:
    document.getElementById('show-big')
      .setAttribute('src', awesomeApp.currentImg);
    document.getElementById('show-big-title')
      .innerHTML = awesomeApp.currentTitle;
  }
};

window.onload = (function() {
  awesomeApp.init();
})();
