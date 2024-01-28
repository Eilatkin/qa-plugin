createbug_jira();

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
};

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
  };

async function createbug_jira() {
	 
	const { project_jira } = await chrome.storage.local.get('project_jira');
	const project_filed = '[id="project-field"]';
	// const project = 'Sakura (SAKURA)'; // TODO - параметризовать
	const issuetype_field = '[id="issuetype-field"]'
	const issuetype = 'Ошибка';

	// Выбираем проект
	waitForElm(project_filed).then((elm) => {
		console.log('1. project_filed is ready, filling..');
    var picker = document.querySelector(project_filed);
    while (picker.contentDocument) {
		picker = domElement.contentDocument.activeElement;
	}
    if (picker.tagName === 'TEXTAREA' || picker.tagName === 'INPUT') {
		picker.value = project_jira;
		triggerEvents(picker, ['input', 'change']);
	} else if (
		picker.hasAttribute('contenteditable')) {
		picker.innerText = project_jira;
	}
	
	let confirm = '[id="all-projects"] li';
	waitForElm(confirm).then((elm) => {
	console.log('2. Project Picker is ready, clicking: ', confirm);	 
	var confirmer = document.querySelector(confirm);
	confirmer.addEventListener("click", e => e.target.click());
	triggerEvents(confirmer, ['click']);
	
	// Выбираем тип таски
	waitForElm(issuetype_field).then((elm) => {

	console.log('3. issuetype_field is ready, filling: ', issuetype_field);
    let picker = document.querySelector(issuetype_field);
    while (picker.contentDocument) {
		picker = domElement.contentDocument.activeElement;
	}
    if (picker.tagName === 'TEXTAREA' || picker.tagName === 'INPUT') {
		picker.value = issuetype;
		triggerEvents(picker, ['input', 'change']);
	} else if (
		picker.hasAttribute('contenteditable')) {
		picker.innerText = project;
	}
	
	confirm = '[id="issuetype-suggestions"] li';
	waitForElm(confirm).then((elm) => {
		console.log('4. Issuetype Picker  is ready, clicking: ', confirm);
	 
	var confirmer = document.querySelector(confirm);
	confirmer.addEventListener("click", e => e.target.click());
	triggerEvents(confirmer, ['click']);
	
	// Жмём кнопку Next
	// тут всё-таки не обойтись без костыльного timout
	delay(100).then(() => console.log('delay 100 ms'));
	const next_button = '[id="issue-create-submit"]';
	waitForElm(next_button).then((elm) => {
		console.log('Next button is ready');
    var click_next = document.querySelector(next_button);
	click_next.addEventListener("click", e => e.target.click());
	triggerEvents(click_next, ['click']);
	});
//4
}); 
// 3
});
//2
});
//1 <-- синхронизация ожиданий
});
};
