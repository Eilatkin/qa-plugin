  /**
 * (TODO сделать передачу пароля из конфига, убрать хардкод)
 */ 
 
 fillforms('логин','пароль');

function triggerEvents(element, eventArray) {	 
	eventArray.forEach((eventName) => {
		const evt = new Event(eventName,{bubbles: true, cancelable: false});
		element.dispatchEvent(evt);
	});
};

function fillforms(lgn,pwd) {
	 
    // Заоплнить поля
	let domElement1 = document.querySelector('input[id="login"]');
    let domElement2 = document.querySelector('input[type="password"]');
    if (!domElement1 || !domElement2) {
		return;
	}
	if (domElement1.tagName === 'TEXTAREA' || domElement1.tagName === 'INPUT') {
		domElement1.value = lgn;
		triggerEvents(domElement1, ['input', 'change']);
	} else if (domElement1.hasAttribute('contenteditable')) {
		domElement1.innerText = lgn;
	}
    if (domElement2.tagName === 'TEXTAREA' || domElement2.tagName === 'INPUT') {
		domElement2.value = pwd;
		triggerEvents(domElement2, ['input', 'change']);
	} else if (domElement2.hasAttribute('contenteditable')) {
		domElement2.innerText = pwd;
	}

    // Нажать кнопку Вход
	const button = 'button div';
    let click_next = document.querySelector(button);
	click_next.addEventListener("click", e => e.target.click());
	triggerEvents(click_next, ['click']);
};
