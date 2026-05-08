const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body);
  const META_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!META_TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'META_ACCESS_TOKEN no configurado en Netlify' }) };
  }

  if (!body.pixel_id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'pixel_id es requerido (ID del Pixel de Meta en Business Manager)' }) };
  }

  const userData = {
    client_ip_address: event.headers['x-nf-client-connection-ip'] || '127.0.0.1',
    client_user_agent: event.headers['user-agent']
  };

  if (body.user_email) {
    userData.em = crypto.createHash('sha256').update(body.user_email.toLowerCase().trim()).digest('hex');
  }

  if (body.user_phone) {
    userData.ph = crypto.createHash('sha256').update(body.user_phone.replace(/\D/g, '')).digest('hex');
  }

  const eventData = {
    event_name: body.event_name,
    event_id: body.event_id,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: body.page_url || '',
    user_data: userData,
    custom_data: {}
  };

  if (body.content_id) {
    eventData.custom_data = {
      content_ids: [body.content_id],
      content_name: body.content_name || '',
      content_type: body.content_type || 'product',
      value: body.value || 0,
      currency: body.currency || 'USD'
    };
  }

  const metaPayload = {
    data: [eventData]
  };

  if (body.test_event_code) {
    metaPayload.test_event_code = body.test_event_code;
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${body.pixel_id}/events?access_token=${META_TOKEN}`,
      metaPayload,
      { timeout: 8000, headers: { 'Content-Type': 'application/json' } }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Evento enviado a Meta', data: response.data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error de comunicación con Meta',
        tipo: error.code || 'unknown',
        detalle: error.response?.data || error.message
      })
    };
  }
};
