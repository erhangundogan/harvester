//(function harvester() {
//  "use strict";

  var request = require("request"),
      fs = require("fs"),
      path = require("path"),
      jstools = require("jstools"),
      settings = require("./settings"),
      Search = require("./schema/search").Search,
      proxy_counter = 0,
      address_counter = 0,
      log_filename = "",
      proxy_object = {},
      request_counter = 0;

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
            var proxy_address = "http://"+raw_proxy_array[index]+"/";
            proxy_object[proxy_address] = { order:index };
            settings.proxy_list.push(proxy_address);
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
  
  var interval = setInterval(function(){
    if (address_counter >= settings.address_list.length) {
      clearInterval(interval);
      var control_interval = setInterval(function(){
        if (request_counter <= 0) {
          clearInterval(control_interval);
          var message = JSON.stringify(proxy_object);
          console.log(message);
          write_log(message);
          return 1;
        }
      },1000);
    } else {
      ++request_counter;
      var proxy_address = settings.proxy_list[proxy_counter];
      proxy_object[proxy_address].begin_time = new Date();
      request({
        "method": settings.request_method,
        "uri": settings.address_list[address_counter],
        "headers": settings.request_headers,
        "proxy": proxy_address,
        "timeout": settings.request_timeout
      },
        function (err, res, body) {
          var now = new Date(), res_address = "";
          --request_counter;
          if (err) {
            if (res && res.request && res.request.proxy && res.request.proxy.href) {
              res_address = res.request.proxy.href;

              if (settings.log_to_mongodb) {
                var search = new Search();
                if (res.request.uri && res.request.uri.href) search.address = res.request.uri.href;
                if (res.statusCode) search.status_code = res.statusCode;
                if (res.body) search.body_length = res.body.length;
                if (res.headers) search.headers = res.headers;
                search.proxy = res_address;
                search.time = proxy_object[res_address].begin_time;
                search.duration = (now - proxy_object[res_address].begin_time) / 1000;
                search.success = false;
                search.error = err.stack||err;
                search.save(function(err) {
                  if(err) {
                    console.log(err.stack||err);
                    write_log(err.stack||err);
                  }
                });
              }
              proxy_object[res_address].duration = (now - proxy_object[res_address].begin_time) / 1000;
              proxy_object[res_address].result = "ERROR";
              proxy_object[res_address].message = err.stack||err;
              if (res.statusCode) proxy_object[res_address].status = res.statusCode;
            } else {
              console.log(err.stack||err);
              write_log(err.stack||err);
            }
          } else {
            if (res && res.request && res.request.proxy && res.request.proxy.href) {
              res_address = res.request.proxy.href;

              if (settings.log_to_mongodb) {
                var search = new Search();
                if (res.request.uri && res.request.uri.href) search.address = res.request.uri.href;
                if (res.statusCode) search.status_code = res.statusCode;
                if (res.body) search.body_length = res.body.length;
                if (res.headers) search.headers = res.headers;
                search.proxy = res_address;
                search.time = proxy_object[res_address].begin_time;
                search.duration = (now - proxy_object[res_address].begin_time) / 1000;
                search.success = true;
                search.save(function(err) {
                  if(err) {
                    console.log(err.stack||err);
                    write_log(err.stack||err);
                  }
                });
              }
              proxy_object[res_address].duration = (now - proxy_object[res_address].begin_time) / 1000;
              proxy_object[res_address].result = "SUCCESS";
              proxy_object[res_address].message = res.headers;
              if (res.statusCode) proxy_object[res_address].status = res.statusCode;
            } else {
              var message = "Response Address: "+res.request.uri.href;
              message += "\tProxy: "+res.request.proxy.href;
              message += "\tStatus: "+res.statusCode;
              message += "\nHeaders: "+JSON.stringify(res.headers);
              console.log(message);
              write_log(message);
            }
          }
        }
      );

      if (++proxy_counter === settings.proxy_list.length) {
        proxy_counter = 0;
        ++address_counter;
      }
    }
  }, settings.timer);
//})();

