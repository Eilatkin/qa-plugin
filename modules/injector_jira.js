 /**
 * (TODO сделать передачу заданий через мессенджинг, убрать хардкод)
 */ 

 
// (async () => {
// 	const src = chrome.runtime.getURL("../config.js");
// 	const standardConfig = await import(src);
// 	standardConfig.main();
//   })();

injectDescription("*ОПИСАНИЕ ПРОБЛЕМЫ:*\n\n*ШАГИ ВОСПРОИЗВЕДЕНИЯ:*\n\n*ПОЛУЧЕННЫЙ РЕЗУЛЬТАТ:*\n\n*ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:*");

function triggerEvents(element, eventArray) {
	 
	eventArray.forEach((eventName) => {
		const evt = new Event(eventName,{bubbles: true, cancelable: false});
		element.dispatchEvent(evt);
	});
};

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function injectValueToElement(value,selector) {

	waitForElm(selector).then((elm) => {
		console.log('Element '+selector+' is loaded.');	

	// нажать кнопку Текст (режим редактирования в формате не преобразованного теста)
	let textBttn = document.querySelector('li[data-mode="source"] button');
	textBttn.addEventListener("click", e => e.target.click());
	triggerEvents(textBttn, ['click']);
	// вставить описание
    let domElement = document.querySelector(selector);
	if (!domElement || !value) {
		alert('domElement не содержит '+ selector);
		return;
	}
	while (domElement.contentDocument) {
		domElement = domElement.contentDocument.activeElement;
	}
	if (domElement.tagName === 'TEXTAREA' || domElement.tagName === 'INPUT') {
		domElement.value = value;
		triggerEvents(domElement, ['input', 'change']);
	} else if (domElement.hasAttribute('contenteditable')) {
		domElement.innerText = value;
	};
	});
};

function injectDescription(Jira_descr) {	 	
	injectValueToElement(Jira_descr,'textarea[id="description"]');	
	console.log();
};	  
