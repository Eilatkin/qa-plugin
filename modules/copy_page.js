
async function copyPage(){
    let { project } = await chrome.storage.local.get('project');
    if (project === "САКУРА") bread_locator = 'bread-element';
    if (project === "Умный мониторинг") bread_locator = 'sm-breadcrumbs__item';
    if (project === "ПУСК") return;
    let bread = document.getElementsByClassName(bread_locator);
    console.log('Хлебные крошки:', bread);
    let text = Array.from(bread, b => b.innerText);
    console.log('Text: ', text);

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting === "hello") {
          sendResponse(text);
        }
      }
    );
};

copyPage();
