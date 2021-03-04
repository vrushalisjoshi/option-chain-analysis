async function getOptionChain(instrument) {
  const axios = require('axios').default;
  let firstResp = await axios.get('https://www.nseindia.com/');
  let secondResp = await axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=' + instrument, {
             headers: {
                 cookie: firstResp.headers['set-cookie'] // cookie is returned as a header
             }
         });
  return secondResp.data;

}

module.exports = getOptionChain;
