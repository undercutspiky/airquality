self.addEventListener('push', function(event) {

 
  event.waitUntil(

 
    self.registration.showNotification('Please open ventilators !!', {
      lang: 'la',
      body: payload,
      icon: 'icon.png',
      vibrate: [500, 100, 500],
    })
  );
});