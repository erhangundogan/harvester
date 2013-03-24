//(function harvester() {
//  "use strict";

  var request = require("request"),
      fs = require("fs"),
      path = require("path"),
      address_list = [],
      proxy_list = [],
      timer = 1000,
      proxy_counter = 0,
      address_counter = 0,
      proxy_first = false,
      log_file = false,
      proxy_from_file = true,
      address_from_file = false,
      request_method = "HEAD",
      proxy_filename = "",
      address_filename = "",
      default_request_header = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
        "Accept-Encoding": "gzip,deflate,sdch",
        "Accept-Language": "en-US,en;q=0.8",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.40 Safari/537.31"
      };

  if (read_from_file) {
    var data = fs.readFileSync(path.join(__dirname, "list", file_name));
  }
  
  var interval = setInterval(function() {
    if (proxy_counter === proxy_list.length && address_counter === address_list.length-1) {
      console.log("proxy/address list finished! exiting...");
      return clearInterval(interval);
    }

    request({
      "uri": address_list[address_counter],
      "method": request_method,
      "proxy": {hostname:"", port:""}
    },
      function (err, res, body) {

      }
    );

    if (proxy_first) {
      // finish proxies first then addresses
      if (proxy_counter === proxy_list.length-1) {
        proxy_counter = 0;
        address_counter++;
      } else {
        proxy_counter++;
      }
    } else {
      // finish addresses first then proxies
      if (address_counter === address_list.length-1) {
        address_counter = 0;
        proxy_counter++;
      } else {
        address_counter++;
      }
    }

    var logText = "Address: " + address_list[address_counter] + "\tProxy: " + proxy_list[proxy_counter];
    console.log(logText);
    if (log_file) {

    }

  }, timer);
//})();

