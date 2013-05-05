var request = require("request"),
    fs = require("fs"),
    path = require("path"),
    zlib = require("zlib"),
    jstools = require("jstools"),
    colors = require("colors"),
    settings = require("./settings"),
    prettyjson = require("prettyjson"),
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
      var raw_proxy_array = proxy_data.split(settings.proxy_file_separator).trim();
      for (var index in raw_proxy_array) {
        if (!jstools.isNullOrEmpty(raw_proxy_array[index])) {
          var proxy_address = "http://"+raw_proxy_array[index]+"/";
          if (proxy_object[proxy_address]) {
            console.log("Multiple proxy declaration: ", proxy_address);
          } else {
            proxy_object[proxy_address] = {};
            settings.proxy_list.push(proxy_address);
          }
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
    var control_interval = setInterval(function(){
      if (request_counter <= 0) {
        Search.find()
          .where("success").equals("true")
          .sort("duration")
          .select("proxy duration -_id")
          .lean()
          .exec(function(err, docs) {
            function exitNow() {
              console.log("Finished exiting...");
              process.exit(1);
            }

            if (err) {
              console.log("[ERROR MONGODB FIND] => ", err||err.stack);
              exitNow();
            } else {
              if (docs) {
                console.log(prettyjson.render(docs));
                if (settings.log_to_file) write_log(JSON.stringify(docs));
                exitNow();
              } else {
                exitNow();
              }
            }
        });
      }
    }, 1000);
  } else {
    ++request_counter;
    var proxy_address = settings.proxy_list[proxy_counter];
    proxy_object[proxy_address].begin_time = new Date();
    proxy_object[proxy_address].address = settings.address_list[address_counter];
    proxy_object[proxy_address].method = settings.request_method;
    console.log(proxy_address, "\t\t=REQUEST=>\t\t".cyan, settings.address_list[address_counter]);

    request({
      "method": settings.request_method,
      "uri": settings.address_list[address_counter],
      "headers": settings.request_headers,
      "proxy": proxy_address,
      "encoding": null,
      "timeout": settings.request_timeout
    },
      function (err, res, body) {
        --request_counter;
        var now = new Date(),
            result_proxy = this.proxy.href,
            result_address = this.href,
            current_proxy = proxy_object[result_proxy],
            duration = (now-current_proxy.begin_time)/1000, // TypeError: Cannot read property 'begin_time' of undefined
            expectedResult = true;

        function processRequest(err, expectedResult) {
          if (err || !expectedResult) {
            console.log(result_proxy, "\t\t<=ERROR=\t\t".red, result_address, "\t\t", duration, " secs.");
            if (settings.log_to_mongodb) {
              var search = new Search();
              if (res && res.statusCode) search.status_code = res.statusCode;
              if (res && res.body) search.body_length = res.body.length;
              if (res && res.headers) search.headers = res.headers;
              if (this.redirects) search.redirects = this.redirects;
              search.return_address = result_address;
              search.proxy = result_proxy;
              search.address = current_proxy.address;
              search.time = current_proxy.begin_time;
              search.duration = duration;
              search.success = false;
              search.method = settings.request_method;
              search.error = err ? err.stack||err : "Not expected content returned";
              search.save(function(err) {
                if(err) {
                  console.log(err.stack||err);
                  write_log(err.stack||err);
                }
              });
            }

            if (settings.log_to_file) {
              if (res && res.statusCode) current_proxy.status = res.statusCode;
              if (res && res.body) current_proxy.body_length = res.body.length;
              if (res && res.headers) current_proxy.headers = res.headers;
              if (this.redirects) current_proxy.redirects = this.redirects;
              current_proxy.duration = duration;
              current_proxy.success = false;
              current_proxy.error = err ? err.stack||err : "Not expected content returned";
              current_proxy.return_address = result_address;
            }
          } else {
            console.log(result_proxy, "\t\t<=SUCCESS=\t\t".green, result_address, "\t\t", duration, " secs.");
            if (settings.log_to_mongodb) {
              var search = new Search();
              if (res && res.statusCode) search.status_code = res.statusCode;
              if (res && res.body) search.body_length = res.body.length;
              if (res && res.headers) search.headers = res.headers;
              if (this.redirects) search.redirects = this.redirects;
              search.return_address = result_address;
              search.proxy = result_proxy;
              search.address = current_proxy.address;
              search.time = current_proxy.begin_time;
              search.duration = duration;
              search.method = settings.request_method;
              search.success = true;
              search.save(function(err) {
                if(err) {
                  console.log(err.stack||err);
                  write_log(err.stack||err);
                }
              });
            }

            if (settings.log_to_file) {
              if (res && res.statusCode) current_proxy.status = res.statusCode;
              if (res && res.body) current_proxy.body_length = res.body.length;
              if (res && res.headers) current_proxy.headers = res.headers;
              if (this.redirects) current_proxy.redirects = this.redirects;
              current_proxy.duration = duration;
              current_proxy.success = true;
              current_proxy.return_address = result_address;
            }
          }
        }

        if (!err && settings.request_method === "GET" && !jstools.isNullOrEmpty(settings.body_includes)) {
          if (res.headers["content-encoding"] == "gzip" || res.headers["content-encoding"] == "deflate") {
            zlib.unzip(body, function(err, buffer) {
              if (!err) {
                var result = buffer.toString("utf-8");
                var regex = new RegExp(settings.body_includes);
                expectedResult = regex.test(result);
              } else {
                expectedResult = false;
              }
            });
          } else {
            var regex = new RegExp(settings.body_includes);
            expectedResult = regex.test(body);
          }
          processRequest(err, expectedResult);
        } else {
          processRequest(err, expectedResult);
        }
      }
    );

    if (++proxy_counter === settings.proxy_list.length) {
      proxy_counter = 0;
      ++address_counter;
    }
  }
}, settings.random_timer
   ? (Math.floor(Math.random() * settings.timer_add_random) + settings.timer_min) * 1000
   : settings.timer * 1000);
