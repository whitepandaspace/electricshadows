function sendTikTokEvent(eventName, productData) {
  const payload = {
    event_name: eventName,
    event_id: 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    page_url: window.location.href
  };

  if (productData.email) payload.user_email = productData.email;
  if (productData.phone) payload.user_phone = productData.phone;

  if (productData.id) {
    payload.content_id = productData.id;
    payload.content_name = productData.name || '';
    payload.content_type = productData.type || 'product';
    payload.value = productData.price || 0;
    if (productData.currency) payload.currency = productData.currency;
    payload.quantity = productData.quantity || 1;
  }

  if (productData.testEventCode) {
    payload.test_event_code = productData.testEventCode;
  }

  var BASE = 'https://electricshadows.website/.netlify/functions/';
  var promises = [];

  promises.push(
    fetch(BASE + 'tiktok-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(r) { return r.json(); })
    .then(function(d) { return { platform: 'TikTok', ok: !!d.message, data: d }; })
    .catch(function(e) { return { platform: 'TikTok', ok: false, error: e.message }; })
  );

  if (productData.pixel_id) {
    payload.pixel_id = productData.pixel_id;
    promises.push(
      fetch(BASE + 'meta-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(r) { return r.json(); })
      .then(function(d) { return { platform: 'Meta', ok: !!d.message, data: d }; })
      .catch(function(e) { return { platform: 'Meta', ok: false, error: e.message }; })
    );
  }

  return Promise.all(promises).then(function(results) {
    var label = productData.name || 'sin producto';
    console.log(eventName + ' -> ' + label, results);
    return results;
  });
}

window.sendTikTokEvent = sendTikTokEvent;
