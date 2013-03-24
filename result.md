```javascript
// mongodb record sample
{
	"duration" : 7.755,
	"time" : ISODate("2013-03-24T23:51:41.516Z"),
	"address" : "http://www.cnn.com",
	"proxy" : "http://85.234.22.126:3128/",
	"return_address" : "http://edition.cnn.com/",
	"headers" : {
		"proxy-connection" : "close",
		"via" : "1.0 vizitka.localdomain:3128 (squid/2.6.STABLE21)",
		"x-cache-lookup" : "MISS from vizitka.localdomain:3128",
		"x-cache" : "MISS from vizitka.localdomain",
		"expires" : "Sun, 24 Mar 2013 23:52:38 GMT",
		"cache-control" : "max-age=60, private",
		"vary" : "Accept-Encoding",
		"last-modified" : "Sun, 24 Mar 2013 23:51:19 GMT",
		"set-cookie" : [
			"CG=RU:53:Velikiy+Novgorod; path=/"
		],
		"content-type" : "text/html",
		"date" : "Sun, 24 Mar 2013 23:51:47 GMT",
		"server" : "nginx"
	},
	"_id" : ObjectId("514f919544d9314848000004"),
	"method" : "HEAD",
	"body_length" : 129864,
	"status_code" : 200,
	"success" : true,
	"redirects" : [
		{
			"redirectUri" : "http://edition.cnn.com/",
			"statusCode" : 302
		}
	],
	"__v" : 0
}
```