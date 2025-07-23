const handler = require('./create-checkout-session');

const fakeReq = {
  method: 'POST',
  body: {
    utms: {
      utm_source: 'instagram',
      utm_campaign: 'testeadbot',
    },
  },
};

const fakeRes = {
  status: (code) => {
    return {
      json: (data) => {
        console.log('Resposta:', code, JSON.stringify(data, null, 2));
      },
    };
  },
};

handler(fakeReq, fakeRes);
