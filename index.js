'use strict';

var express = require('express');
var JsBarcode = require('jsbarcode');
var Canvas = require("canvas");

function generateEAN13(barcode) {
    var canvas = new Canvas();

    JsBarcode(canvas)
      .options({font: "OCR-B"}) // Will affect all barcodes
      .EAN13(barcode, {fontSize: 18, textMargin: 0})
      .render();

    return canvas.toBuffer();
}

const urlHandler = [];

urlHandler.index = function(req, res) {
	res.contentType('text/html');
	res.send("Welcome to <a href=\"https://github.com/theel0ja/ean13-server\">ean13-server</a>");
}

urlHandler.error404 = function(req, res) {
	res.contentType('text/plain');
	res.status(404);
	res.send("Not Found");
}

urlHandler.ean = function(req, res) {
    
    var ean = req.params["ean"];
    
    if(ean.length == 13) {
        res.contentType('image/png');
        res.send( generateEAN13(ean) );
    }
    else {
        urlHandler.error404(req, res);
    }
}

// -- Configure Express --------------------------------------------------------
const app = express();

app.disable('x-powered-by');

// -- Routes -------------------------------------------------------------------
app.get('/', urlHandler.index);
app.get('/:ean', urlHandler.ean);

// -- Error handlers -----------------------------------------------------------
app.use((req, res) => {
	res.status(404);
	urlHandler.error404(req, res);
});

// -- Server -------------------------------------------------------------------
if (app.get('env') !== 'test') {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log('Listening on port ' + port);
  });
}

module.exports = app;