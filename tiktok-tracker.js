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

  return fetch('https://electricshadows.website/.netlify/functions/tiktok-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      console.log('TikTok ' + eventName + ' enviado:', productData.name || 'sin producto');
      return data;
    }
    throw new Error(data.error || 'Error desconocido');
  });
}

window.sendTikTokEvent = sendTikTokEvent;
