const scrapeIt = require("scrape-it");
const request = require('request');
const telegram = {
// Telegram Token and Chat id or Channel username.
  token: "",
  chat_id: ""
}

// Callback interface
function getQuotes(count) {
    count = '-' + count || "";
    scrapeIt("http://frasesmotivacion.net/frases-motivadoras" + count, {
        // Fetch the quotes list
        quotes: {
            listItem: ".quote-v3",
            data: {

                // Get the quote text
                text: {
                    selector: ".quote-v3 blockquote a:first-child"
                }

                // Get the quote author
                ,
                author: ".quote-v3 blockquote cite"

                // Get image of quote
                    ,
                image: {
                    selector: ".quote-v3 blockquote a img",
                    attr: "src"
                }
            }
        }

    }, (err, items) => {
        
        if (items) {
            items.quotes.forEach(function(element) {

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