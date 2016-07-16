'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service_worker.js').then(function(reg) {
    console.log(':^)', reg);

    setInterval(getDynamic, 5000);

  }).catch(function(err) {
    console.log(':^(', err);
  });
}
else {
  console.log('service worker not supported');
}

function getDynamic() {
  $.ajax('https://localhost:8000/dynamic.html').then((response) => {
    console.log(response);
  });
}