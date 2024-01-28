// модуль для Jira и bugred - TODO

function getSummary(){
  
    let summary = document.getElementById('summary');
    let text = summary.value;
    console.log('Text: ', text);
    const encoded = encodeURI(text);
    console.log('URL encoded: ', encoded);

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting === "hello")
        sendResponse(encoded);
      }
    );
};

getSummary();

