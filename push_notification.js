var endpoint;
var key;
var authSecret;

 
navigator.serviceWorker.register('service-worker.js')
.then(function(registration) {

 
  return registration.pushManager.getSubscription()
  .then(function(subscription) {

 
    if (subscription) {
      return subscription;
    }
 
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  });
}).then(function(subscription) {
  var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
  key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
  var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
  authSecret = rawAuthSecret ?
               btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
               '';
  endpoint = subscription.endpoint;

  setInterval(function(){
    fetch('/register?endpoint=' + endpoint, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          key: key,
          authSecret: authSecret,
        }),
      })
  }, 5000);
});