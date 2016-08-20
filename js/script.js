(function() {

  /* ( X ) Here we define all "global" variables. 
     Technically they aren't globals because these
     JavaScripts are wrapped in an IIFE and so
     appear in the block-scope of an anonymous
     function:
   *************************************************/

  var animation,
    applyRandomColor,
    assignColours,
    backgroundColor,
    config,
    defaultConfig,
    elemBtnNext,
    elemBtnTwitter,
    elemBtnRedditQP,
    getJSON,
    getRandomIndex,
    generateRandomColor,
    generateShadeColor,
    quotesData,
    quoteTextSetup,
    redditQPContent,
    redditQPSetup,
    styles,
    styleMethods,
    tweetContent,
    tweetSetup,
    twitterSetup,
    updateQuoteBackground,
    updateScreenContent;
    
  /* ( X ) DOM elements cached as variables:
   *************************************************/

  elemBtnNext = '#btn-next-quote';
  elemBtnTwitter = '#twitter-link';
  elemBtnRedditQP = '#reddit-qp-link';
  elemQuoteAuthor = '#quote-author';
  elemQuoteTxt = '#quote-text';

  /* ( X ) Here we define a number of important 
    values used throughout app:
   *************************************************/
  
  config = {
    DROPBOX_URL: 'https://dl.dropboxusercontent.com/u/7797721',
    styles: {
      COLOURS_TO_INCLUDE: 
      ['pomegranate', 'carrot', 'green sea', 'wisteria', 'sun flower', 'clouds', 'belize hole', 'emerald'],
      previousColour: ' '
    },
    shares: {
      twitter: {
        ADDRESS: 'https://twitter.com/intent/tweet?',
        QUERY_STRING_1: 'text=',
        QUERY_STRING_2: 'hashtags=',
        message: ' ',
        hashTags: ' '
      },
      redditQP: {
        ADDRESS: 'https://www.reddit.com/r/quoteporn/submit?selftext=true',
        QUERY_STRING_1: 'title=',
        QUERY_STRING_2: 'text=',
        title: ' ',
        description: ' '
      }
    }
  };

  /* ( X ) :
   *************************************************/

  defaultConfig = {
    author: $('#quote-author')[0],
    nextQuote: $('#btn-next-quote')[0],
    glyphicon: $('#glyphicon')[0]
  };

  /* ( X ) Create a 'quotesData' object to store info
   from the quotes JSON document:
  *************************************************/

  quotesData = {
    array: [],
    index: 0,
    jsonData: config.DROPBOX_URL + '/FreeCodeCamp/Random%20Quote%20Machine/quotes.json',
    length: 0,
    randomIndex: 0
  };

  /* ( X ) Return a random index of an array:
   *************************************************/

  getRandomIndex = function(elem) {
    return Math.floor(Math.random() * elem.length);
  };

  /* ( X ) Assign or re-assign colours to the UI:
   *************************************************/

  assignColours = function(o, primaryCol, secondaryCol) {
    o.author.style.color = primaryCol;
    o.nextQuote.style.backgroundColor = primaryCol;
    o.nextQuote.style.color = secondaryCol;
    o.glyphicon.style.color = secondaryCol;
  };

  /* ( X ) Object with animation methods:
   *************************************************/

  animation = {
    fade: function (elem) {
      $(elem).css('opacity', 0);
      $(elem).animate({ opacity: 1 });
    }
  };

  /* ( X ) Perform a GET request for JSON document 
     'quotes.json' and push its properties to
     quotesData array:
  *************************************************/

  getJSON = function() {
    $.getJSON(quotesData.jsonData, function(data) {
      quotesData.length = data.length;
      for (let datum in data) {
        quotesData.array.push([
          data[datum].quote,
          data[datum].author,
          data[datum].pic
        ]);
      }
    });
  };

  /* ( X ) Update the app's background image:
   *************************************************/

  updateQuoteBackground = function(backgroundUrl) {
    $('body').css('background', '#000 url(' + backgroundUrl + ')');
    $('body').css('background-size', 'cover');
    $('body').css('background-position', 'center center');
    $('body').css('background-attachment', 'fixed');
  };

  /* ( X ) Set up the text to be output to screen:
   *************************************************/

  quoteTextSetup = {
    config: function() {
      quoteTextSetup.set({
        text: '<i class="fa fa-quote-left"></i> ' + quotesData.array[quotesData.randomIndex][0],
        author: '&mdash; ' + quotesData.array[quotesData.randomIndex][1]
      });
    },
    set: function(o) {
      $(elemQuoteTxt).html(o.text);
      $(elemQuoteAuthor).html(o.author);
    }
  };

  /* ( X ) Set up the HREF of Twitter button:
   *************************************************/

  twitterSetup = {
    config: function() {
      twitterSetup.get({
        message: quotesData.array[quotesData.randomIndex][0],
        author: quotesData.array[quotesData.randomIndex][1]
      });
    },
    get: function(o) {
      twitterSetup.update({
        message: '"' + encodeURIComponent(o.message) + '"',
        hashTags: encodeURIComponent(o.author),
      });
    },
    update: function(o) {
      config.shares.twitter.message = o.message;
      config.shares.twitter.hashTags = o.hashTags;
      tweetContent = config.shares.twitter.ADDRESS +
        config.shares.twitter.QUERY_STRING_1 +
        config.shares.twitter.message + '&' +
        config.shares.twitter.QUERY_STRING_2 +
        config.shares.twitter.hashTags;
      twitterSetup.set();

    },
    set: function() {
      $(elemBtnTwitter).attr('href', tweetContent);
    }
  };

  /* ( X ) Set up the HREF of Reddit button:
   *************************************************/

  redditQPSetup = {
    config: function() {
      redditQPSetup.get({
        title: quotesData.array[quotesData.randomIndex][0],
        author: quotesData.array[quotesData.randomIndex][1],
        description: 'I thought this was an interesting quote.'
      });

    },
    get: function(o) {
      redditQPSetup.update({
        title: '"' + encodeURIComponent(o.title) + '" — ' +
          encodeURIComponent(o.author),
        description: encodeURIComponent(o.description),
      });
    },
    update: function(o) {
      config.shares.redditQP.title = o.title;
      config.shares.redditQP.description = o.description;
      redditQPContent = config.shares.redditQP.ADDRESS + '&' +
        config.shares.redditQP.QUERY_STRING_1 +
        config.shares.redditQP.title + '&' +
        config.shares.redditQP.QUERY_STRING_2 +
        config.shares.redditQP.description;
      redditQPSetup.set();
    },
    set: function() {
      $(elemBtnRedditQP).attr('href', redditQPContent);
    }
  };

  /* ( X ) Update social media/share buttons with
      each new quote:
   *************************************************/

  updateScreenContent = function() {
    quoteTextSetup.config();
    twitterSetup.config();
    redditQPSetup.config();
    updateQuoteBackground(quotesData.array[quotesData.randomIndex][2]);
    styles.set(defaultConfig);
  };

  /* ( X ) When "random quote" button is click,
    output random quote:
  *************************************************/

  $(elemBtnNext).on('click', function() {
    animation.fade('.toFade');
    quotesData.randomIndex = getRandomIndex(quotesData);
    updateScreenContent();
    quotesData.index >= quotesData.length - 1 ?
      quotesData.index = 0 : quotesData.index++;
  });

  /* ( X ) Style methods that evaluate various 
    conditions and return their truth values:
   *************************************************/

  styleMethods = {
    isColourIncluded: function(generatedColour) {
      let included = false;
      for (let i = 0; i < config.styles.COLOURS_TO_INCLUDE.length; i++) {
        if (generatedColour === config.styles.COLOURS_TO_INCLUDE[i]) included = true;
      }
      return included;
    },
    isColourFresh: function(generatedColour) {
      return generatedColour !== config.styles.previousColour;
    }
  };

  /* ( X ) Various styles methods:
   *************************************************/

  styles = {
    get: function() {
      return colours[getRandomIndex(colours)];
    },
    set: function(o) {
      let colour = styles.get(),
        primaryCol = colour.bkgCol,
        secondaryCol = colour.fontCol;
      if (!styleMethods.isColourIncluded(colour.name) || !styleMethods.isColourFresh(colour.name)) {
        styles.set(defaultConfig);
      } else {
        assignColours(o, primaryCol, secondaryCol);
        config.styles.previousColour = colour.name;
      }
    }
  };

  /* ( X ) Initialize app. Turn opacity to 0, get
      JSON data, navigate to a quote and fade it in:
   *************************************************/

  $(elemBtnNext).css('opacity', 0);
  $(elemBtnTwitter).css('opacity', 0);
  $(elemBtnRedditQP).css('opacity', 0);
  getJSON();
  setTimeout(function() {
    $(elemBtnNext).animate({ opacity: 1 });
    $(elemBtnTwitter).animate({ opacity: 1 });
    $(elemBtnRedditQP).animate({ opacity: 1 });
    $(elemBtnNext).click();
    styles.set(defaultConfig);
  }, 1000);
}());