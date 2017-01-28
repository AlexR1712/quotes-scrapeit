const scrapeIt = require("scrape-it");
const request = require('request');
const sleep = require('sleep');
const telegram = {
  token: "PASTE_YOUR_TELEGRAM_BOT_TOKEN",
  chat_id: "Chat id or Channel @username"
}

// Callback interface
function getQuotes(count) {
    count = '-' + count || "";
    scrapeIt("http://frasesmotivacion.net/frases-motivadoras" + count, {
        // Fetch the articles
        quotes: {
            listItem: ".quote-v3",
            data: {

                // Get the article date and convert it into a Date object
                text: {
                    selector: ".quote-v3 blockquote a:first-child"
                }

                // Get the title
                ,
                author: ".quote-v3 blockquote cite"

                    // Nested list
                    ,
                image: {
                    selector: ".quote-v3 blockquote a img",
                    attr: "src"
                }
            }
        }

    }, (err, page) => {
        //console.log(err || page);
        if (page) {
            page.quotes.forEach(function(element) {

                quote = element.text.split(".");
                quote.pop();
                // console.log(quote.toString()+".\n");

                request.post({
                        url: 'https://api.telegram.org/bot'+telegram.token+'/sendMessage',
                        form: {
                            chat_id: telegram.chat_id,
                            text: quote.toString() + ". *" + element.author + "* \n [Imagen](http://frasesmotivacion.net" + element.image + ") \n",
                            parse_mode: 'Markdown'
                        }
                    },
                    function(err, httpResponse, body) {
                        console.log(body)
                    });

            });

        }

    });

}

for (var i = 0; i < 50; i++) {
    setTimeout(function() {
        getQuotes(i);
    }, 5000);
}