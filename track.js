var request = require('request');
var prompt = require('prompt');
var pb = require('pushbullet');
var cheerio = require('cheerio');

// Variables
var pb_token;
var span_id = '#actualPriceValue';
var check_interval = 120000;
var products = [];
document.getElementById("ca").checked = true;

function Product(asin, desiredPrice) {
    this.asin = asin;
    this.desiredPrice = desiredPrice;
    this.setLink = function(asin) {
        if (document.getElementById("us").checked) {
            this.url = 'http://www.amazon.com/dp/' + asin;
        } else if (document.getElementById("ca").checked) {
            this.url = 'http://www.amazon.ca/dp/' + asin;
        } else if (document.getElementById("uk").checked) {
            this.url = 'http://www.amazon.co.uk/dp/' + asin;    
        }
    }
}

function removeProduct() {
}


function trackProduct() {
    let asin = document.getElementById("asin").value;
    let desiredPrice = document.getElementById("price").value;
}

function checkPrice(p) {
	request(p.url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			var list_price = $(span_id).text();
			var stripped_price = list_price.replace('$', '').replace(',', '');
            return stripped_price;    
		}
		else {
            console.log("Uh oh. There was an error.");
            return -1;
		}
    });
   return -1;
}


function track() {
    if (list.length >= 1) {
        for (let i = 0; i < list.length; i++) {
            if (checkPrice(products[i]) <= products[i].desiredPrice) {
                sendPush();
            }
        }
    }
    setTimeout(track, check_interval);
}


function sendPush() {
	var pusher = new pb(pb_token);

	pusher.note(null, "Amazon Price Watch", "A product you are watching has dropped in price: " + amzn_url, function(error, response) {
		if (!error) {
			process.exit();
		}
	});
}
