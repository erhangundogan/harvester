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
      log_to_file = false,
      log_filename = "",
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

  function write_log(data) {
    if (log_to_file) {
      fs.appendFile(path.join(__dirname, "log", log_filename), data, function (err, result) {
        if (err) throw err.stack||err;
      });
    }
  }

  if (proxy_from_file) {
    var proxy_data = fs.readFileSync(path.join(__dirname, "proxy", proxy_filename));
  }

  if (address_from_file) {
    var address_data = fs.readFileSync(path.join(__dirname, "address", address_filename));
  }

  if (log_to_file) {
    var dt = new Date();
    log_filename = dt.getFullYear()+""+(dt.getMonth()+1)+""+ dt.getDate()+"-"+dt.getTime()+".log";
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

    var log_data = "Address: " + address_list[address_counter] + "\tProxy: " + proxy_list[proxy_counter];
    console.log(log_data);
    write_log(log_data);

  }, timer);
//})();

