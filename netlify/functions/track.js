const axios = require('axios');

exports.handler = async (event, context) => {
  // Solo aceptamos peticiones POST desde tu web
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);

  try {
    const response = await axios.post('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      pixel_code: "D7T48QBC77U471PH6PA0",
      event: body.event_name, // Ej: 'ViewContent'
      event_id: body.event_id,
      timestamp: Math.floor(Date.now() / 1000),
      context: {
        user: {
            email: body.user_email, // Recuerda que TikTok pide esto hasheado en SHA256
            ip: event.headers['x-nf-client-connection-ip'],
            user_agent: event.headers['user-agent']
        },
        page: { url: body.page_url }
      }
    }, {
      headers: {
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN, // Variable oculta
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Evento enviado a TikTok", data: response.data })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};