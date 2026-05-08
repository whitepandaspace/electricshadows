const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // 1. Cabeceras de seguridad para evitar bloqueos del navegador (CORS)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 2. Responder a la petición de verificación del navegador (Preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 3. Validar que sea un POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);

  if (!process.env.TIKTOK_ACCESS_TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "TIKTOK_ACCESS_TOKEN no configurado" }) };
  }

  try {
    const tiktokPayload = {
      event_source_id: "D7T48QBC77U471PH6PA0",
      event_source: "web",
      data: [{
        event: body.event_name,
        event_id: body.event_id,
        event_time: Math.floor(Date.now() / 1000),
        user: {
          email: crypto.createHash('sha256').update(body.user_email.toLowerCase().trim()).digest('hex'),
          ip: event.headers['x-nf-client-connection-ip'] || '127.0.0.1',
          user_agent: event.headers['user-agent']
        },
        page: { url: body.page_url }
      }]
    };

    if (body.test_event_code) {
      tiktokPayload.test_event_code = body.test_event_code;
    }

    const response = await axios.post('https://business-api.tiktok.com/open_api/v1.3/event/track/', tiktokPayload, {
      timeout: 8000,
      headers: {
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Evento enviado a TikTok", data: response.data })
    };
  } catch (error) {
    const tiktokError = error.response ? error.response.data : (error.code || error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Error de comunicación con TikTok",
        tipo: error.code || 'unknown',
        detalle: tiktokError
      })
    };
  }
};