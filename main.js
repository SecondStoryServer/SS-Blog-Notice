function sendNewBlog(){
  const url = "https://www.ss-rpg.net/";
  const BlogCategoryColor = 6316128;
  const html = UrlFetchApp.fetch(url).getContentText("UTF-8");
  const list = Parser.data(html).from("<p class=\"blog-item__text\">").to("</p>").iterate();
  var lastHref = PropertiesService.getScriptProperties().getProperty("LAST_HREF");
  var update = false;
  list.some( l => {
    const title = l.replace(/<("[^"]*"|'[^']*'|[^'">])*>|\r\n|\n|\r/g, "");
    const href = Parser.data(l).from("<a class=\"u-txt-clr\" href=\"").to("\">").build();
    if(!update) {
      PropertiesService.getScriptProperties().setProperty("LAST_HREF", href);
      update = true;
    }
    if (lastHref == href) return true;
    Logger.log(href);
    sendWebHook(url + href, title, BlogCategoryColor);
  });
}

function sendWebHook(url, title, color){
  const webHookUrl = PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL");
  const options = {
    "headers": {
      "Content-Type": "application/json"
    },
    "method" : "POST",
    "payload" : JSON.stringify(generateJson(url, title, color))
  };
  UrlFetchApp.fetch(webHookUrl, options);
}

function getTitle(url) {
  const html = UrlFetchApp.fetch(url).getContentText("UTF-8");
  return Parser.data(html).from("<h1 class=\"blog-title__text u-txt-clr\">").to("</h1>").build();
}

function generateJson(url, title, color) {
  return {
    "content": null,
    "embeds": [
      {
        "title": "「" + title + "」",
        "url": url,
        "color": color,
        "footer": {
          "text": "SecondStory"
        }
      }
    ]
  };
}
