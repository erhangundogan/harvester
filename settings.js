module.exports = {
  "address_list": ["http://www.wired.com"], // string array of url adddresses
  "proxy_list": [], // string array of proxies e.g. 0.0.0.0:8080
  "timer": 10, // seconds request delay for each one if no random timer
  "random_timer": true,
  "timer_min": 10, // seconds min time
  "timer_add_random": 10, // seconds min time + add random time
  "log_to_file" : false, // log results to a file
  "log_to_mongodb" : true, // log results to a mongodb database
  "mongodb_connection" : "mongodb://localhost/harvester", // mongodb database connection
  "mongodb_collection" : "wired", // mongodb collection to save
  "proxy_from_file" : true, // if it is true, reads proxies list from file specified in :proxy_filename
  "proxy_file_separator" : "\n", // proxy items separator
  "address_from_file" : false, // if it is true, reads addresses list from file specified in :address_filename
  "proxy_filename" : "proxylist", // this file should be put under proxy directory, do not specify directory name
  "address_filename" : "", // this file should be put under address directory, do not specify directory name
  "request_method" : "GET", // default request method, do not change this one. GET would be implemented later
  "request_timeout" : 150000, // Integer containing the number of milliseconds to wait for a request to respond before aborting the request
  "body_includes" : "121008698507", // use some text from webpage if you want to test results, use GET for method
  "request_headers_chrome" : {
    // specify your own properties if you want
    "Accept": "text/html",
    "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "Accept-Encoding": "deflate,sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.40 Safari/537.31"
  },
  "request_headers" : {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:19.0) Gecko/20100101 Firefox/19.0",
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "deflate,gzip",
    "Accept-Charset": "utf-8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  }
};
