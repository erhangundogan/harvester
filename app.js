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
    if (!jstools.isNullOrEmpty(settings.proxy_filename) &&
      fs.existsSync(path.join(__dirname, "proxy", settings.proxy_filename))) {
        var proxy_data = fs.readFileSync(path.join(__dirname, "proxy", settings.proxy_filename), "utf-8");
        var raw_proxy_array = proxy_data.split("\r\n").trim();
        for (var index in raw_proxy_array) {
          if (!jstools.isNullOrEmpty(raw_proxy_array[index])) {
            settings.proxy_list.push("http://"+raw_proxy_array[index]);
          }
        }
      }
  }

  if (settings.address_from_file) {
    if (!jstools.isNullOrEmpty(settings.address_filename) &&
      fs.existsSync(path.join(__dirname, "proxy", settings.address_filename))) {
        var address_data = fs.readFileSync(path.join(__dirname, "address", settings.address_filename));
        settings.address_list = address_data.split("\r\n").trim();
      }
  }

  if (settings.log_to_file) {
    var dt = new Date();
    log_filename = dt.getFullYear()+""+
                   ("0"+(dt.getMonth()+1)).slice(-2)+""+
                   ("0"+dt.getDate()).slice(-2)+"-"+
                   dt.getTime()+".log";
  }
  
  var interval = setInterval(function() {
    if (proxy_counter > settings.proxy_list.length &&
        address_counter > settings.address_list.length) {
      var message = "proxy/address list finished! exiting...";
      console.log(message);
      write_log(message);
      return clearInterval(interval);
    }

    request({
      "method": settings.request_method,
      "uri": settings.address_list[address_counter],
      "headers": settings.request_headers,
      "proxy": settings.proxy_list[proxy_counter],
      "timeout":settings.request_timeout
    },
      function (err, res, body) {
        if (err) {
          console.log(err.stack||err);
          write_log(err.stack||err);
        } else {
          var message = "Response Address: "+res.request.uri.href;
          message += "\tProxy: "+res.request.proxy.href;
          message += "\tStatus: "+res.statusCode;
          message += "\nHeaders: "+JSON.stringify(res.headers);
          console.log(message);
          write_log(message);
        }
      }
    );

    var log_data = "\nRequest  Address: " + settings.address_list[address_counter] +
      "\tProxy: " + settings.proxy_list[proxy_counter];
    console.log(log_data);
    write_log(log_data);

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

  }, settings.timer);
//})();

