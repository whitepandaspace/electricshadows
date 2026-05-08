const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);

  try {
    const response = await axios.post('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      pixel_code: "D7T48QBC77U471PH6PA0",
      event: body.event_name,
      event_id: body.event_id,
      event_time: Math.floor(Date.now() / 1000), // Corregido: TikTok exige event_time, no timestamp
      context: {
        user: {
            email: body.user_email,
            ip: event.headers['x-nf-client-connection-ip'] || '127.0.0.1',
            user_agent: event.headers['user-agent']
        },
        page: { url: body.page_url }
      }
    }, {
      headers: {
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Evento enviado a TikTok", data: response.data })
    };
  } catch (error) {
    // Aquí atrapamos la respuesta exacta de TikTok para saber qué le molesta
    const tiktokError = error.response && error.response.data ? error.response.data : error.message;
    
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error de comunicación con TikTok", detalle: tiktokError }) 
    };
  }
};