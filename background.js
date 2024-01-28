import {buildPage, openStand, openTMS, clipboardPage} from './modules/loader.js';

document.addEventListener('DOMContentLoaded', function() {
    buildPage();
});

document.getElementById('stand_picker').addEventListener('change', function () {
    openStand();
});

document.getElementById('project_bttn').onclick = function() {
    openTMS();
};

document.getElementById('project_copy').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true, lastFocusedWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.scripting.executeScript({
            target: {tabId: tab.id, allFrames: true},
            files: ['./modules/copy_page.js'],
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log(tab.id, tab.url);
            chrome.tabs.sendMessage(tab.id, {greeting: "hello"})
                .then(response => clipboardPage(response, tab.url));  
        });
    });
};

document.getElementById('fillForm_jira').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        console.log('INJECTING BUGREP: ', tab.id);
        chrome.scripting.executeScript({
            target: {tabId: tab.id, allFrames: true},
            files: ['./modules/injector_jira.js'],
        });
    });   
});

document.getElementById('createticket_jira').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var repeat_once = false;
        var all_done = false;
        chrome.tabs.update(tab.id, {url: 'https://jira.company.ru/secure/CreateIssue!default.jspa'});
        chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
            if (changeInfo.status == 'complete' && !repeat_once) {
                repeat_once = true;
                chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames: true},
                    files: ['./modules/createticket_jira.js'],
                });
                chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
                    if (changeInfo.status == 'complete' && !all_done) {
                        console.log('INJECTING BUGREP: ', tab.id);
                        chrome.scripting.executeScript({
                            target: {tabId: tab.id, allFrames: true},
                            files: ['./modules/injector_jira.js']                      
                        });
                        all_done = true;
                    }
                });
            }
          });     
    });
};
