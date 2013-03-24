module.exports = {
  "address_list": ["http://www.cnn.com/"], // string array of url adddresses
  "proxy_list": [], // string array of proxies e.g. 0.0.0.0:8080
  "timer": 10000, // request delay for each ome
  "log_to_file" : true, // test all addresses first on each proxy
  "proxy_from_file" : true, // if it is true, reads proxies list from file specified in :proxy_filename
  "address_from_file" : false, // if it is true, reads addresses list from file specified in :address_filename
  "proxy_filename" : "test", // this file should be put under proxy directory, do not specify directory name
  "address_filename" : "", // this file should be put under address directory, do not specify directory name
  "request_method" : "HEAD", // default request method, do not change this one. GET would be implemented later
  "request_timeout" : 120000, // Integer containing the number of milliseconds to wait for a request to respond before aborting the request
  "request_headers" : {
    // specify your own properties if you want
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "Accept-Encoding": "gzip,deflate,sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.40 Safari/537.31"
  }
};