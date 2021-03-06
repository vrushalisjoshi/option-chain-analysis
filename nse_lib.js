async function getOptionChain(instrument) {
  const axios = require("axios");
  var config = {
    method: "get",
    url: "https://www.nseindia.com",
    headers: {
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate, br",
      cookie:
        "bm_sv=D1E484973C25C570D9E864C1FAAC9C87~Jdc95aeZHLu9EFmEjZebIRV+Rmrtc4EmwJBgsmnqo7Te+8KQ/4/JZW/zQC3fU24n2f49/46Oxa/wGcYK3BO3ETya0RzpO6yFatIQk1zOFHrvY+IliC6kgcW8ps9ZNSWhHQ7ZnJUZPk9Md2l6kXKpPzmdwpTt0Les1qMbEYy/g+o=; Domain=.nseindia.com; Path=/; Max-Age=4397; HttpOnly"
    }
  };
  let firstResp = await axios(config);
  let config1 = {
    method: "get",
    url: "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
    headers: {
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate, br",
      cookie: firstResp.headers["set-cookie"]
    }
  };
  let secondResp = await axios(config1);
  return secondResp.data;
}

module.exports = getOptionChain;
