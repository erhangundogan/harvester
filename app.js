//(function harvester() {
//  "use strict";

  var request = require("request"),
      fs = require("fs"),
      path = require("path"),
      jstools = require("jstools"),
      settings = require("./settings"),
      proxy_counter = 0,
      address_counter = 0,
      log_filename = "";

  function write_log(data) {
    if (settings.log_to_file) {
      fs.appendFile(path.join(__dirname, "log", log_filename), data, function (err, result) {
        if (err) throw err.stack||err;
      });
    }
  }

  if (settings.proxy_from_file) {
    var proxy_data = fs.readFileSync(path.join(__dirname, "proxy", settings.proxy_filename));
    var raw_proxy_array = proxy_data.split("\n");
    for (var raw_proxy in raw_proxy_array) {
      if (!jstools.isNullorEmpty(raw_proxy)) {
        var proxy_item = raw_proxy.split(":");
        settings.proxy_list.push({hostname:proxy_item[0], port:proxy_item[1]});
      }
    }
  }

  if (settings.address_from_file) {
    var address_data = fs.readFileSync(path.join(__dirname, "address", settings.address_filename));
  }

  if (settings.log_to_file) {
    var dt = new Date();
    log_filename = dt.getFullYear()+""+(dt.getMonth()+1)+""+ dt.getDate()+"-"+dt.getTime()+".log";
  }
  
  var interval = setInterval(function() {
    if (proxy_counter === settings.proxy_list.length &&
        address_counter === settings.address_list.length-1) {
      console.log("proxy/address list finished! exiting...");
      return clearInterval(interval);
    }

    request({
      "uri": settings.address_list[address_counter],
      "method": settings.request_method,
      "proxy": settings.proxy_list[proxy_counter]
    },
      function (err, res, body) {

      }
    );

    if (settings.proxy_first) {
      // finish proxies first then addresses
      if (proxy_counter === settings.proxy_list.length-1) {
        proxy_counter = 0;
        address_counter++;
      } else {
        proxy_counter++;
      }
    } else {
      // finish addresses first then proxies
      if (address_counter === settings.address_list.length-1) {
        address_counter = 0;
        proxy_counter++;
      } else {
        address_counter++;
      }
    }

    var log_data = "Address: " + settings.address_list[address_counter] +
      "\tProxy: " + settings.proxy_list[proxy_counter];
    console.log(log_data);
    write_log(log_data);

  }, settings.timer);
//})();

