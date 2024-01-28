import config from '../config.js';

function readProjects(){    
    let select = document.getElementById('project_picker');
    let projects = config.Projects;
    for (var project in projects) {
        var opt = document.createElement('option'); 
        opt.value = projects[project].jira_name;
        opt.innerHTML = projects[project].name;
        select.appendChild(opt);
    };    
    console.log('Projects are loaded!');
};

async function recallStoredProject(){
    // вспомнить текущий проект если уже пользовались плагином
    let select = document.getElementById('project_picker');
    let projects = config.Projects;
    let pr_names = Array.from(projects, pr => pr.name);
    let { project } = await chrome.storage.local.get('project');
    let { project_jira } = await chrome.storage.local.get('project_jira'); 
    console.log('Stored project was ', project);
    if (!project || !pr_names.includes(project)) {
        project = select.options[select.selectedIndex].text;
        project_jira = select.options[select.selectedIndex].value;
        console.log('Stored project name was uncknown, new is ', project);
        await chrome.storage.local.set({ project });
        await chrome.storage.local.set({ project_jira });
      }
    else {
        select.selectedIndex = pr_names.indexOf(project);
        console.log('Project restored!');
        buildStands();
    };
    document.getElementById('project_picker').addEventListener('change', async function () {
        // сохранить изменения в выборе проекта
        project = select.options[select.selectedIndex].text;
        project_jira = select.options[select.selectedIndex].value;
        console.log('storeProject func: select.options changed to ', project);
        await chrome.storage.local.set({ project });
        await chrome.storage.local.set({ project_jira });
        buildStands();
    });
    return project;
};

export function openStand(){
    let select = document.getElementById('project_picker');
    let project = select.options[select.selectedIndex].text;
    let picker = document.getElementById('stand_picker');
    let stand = picker.options[picker.selectedIndex].text;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: (stand)});
    });
    if (project == 'САКУРА') {  // автоматическая авторизация пока только для САКУРА
        var repeat_once = false;
        chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
            if (changeInfo.status == 'complete' && !repeat_once) {
            repeat_once = true;
            chrome.scripting.executeScript({
                target: {tabId: tab.id, allFrames: true},
                files: ['./modules/injector_sakura.js'],
                });
            };
        });
    };
};

export function openTMS(){
    let select = document.getElementById('project_picker');
    let index = select.selectedIndex;
    let projects = config.Projects;
    let pr_tms = Array.from(projects, pr => pr.tms_id);
    let tms_url = 'https://tms.company.ru/projects/' + pr_tms[index] + '/tests';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: (tms_url)});
    });
};

function buildStands(){
    let pr_select = document.getElementById('project_picker');
    let project = pr_select.options[pr_select.selectedIndex].text;
    let projects = config.Projects;
    let pr_names = Array.from(projects, pr => pr.name);
    let index = pr_names.indexOf(project);
    let select = document.getElementById('stand_picker');
    let stands = config.Projects[index].Stands;
    let i = 1;
    // удалить из спика стенды с другого проекта
    for (var opt in select.options) { select.options.remove(1); }
    // наполнить список стендов даными из конфига
    for (var stand in stands) {
        var opt = document.createElement('option');
        opt.innerHTML = stands[stand];
        opt.id = i;
        select.appendChild(opt);
        i++;
    };
    // световая индикация работает только для САКУРЫ, TODO: сделать параметризуемым
    if (project == 'САКУРА') { paintStands(); };
};

export async function getStandStatus(url, i) {
    const options = {
        method: 'GET',
        mode: 'cors'
    };
    let addr = url + '/api/';
    let opt = document.getElementById(i);
    console.log('Request to: ', addr);
    fetch(addr, options).then(function (response) {
	    if (response.ok) {
		    return response.json();
	    } else {
		    return Promise.reject(response);
	    }
    }).then(function (data) {
        opt.style.color = 'green';
        console.log(url, ' версии: ', data.buildVersion);
    }).catch(function (err) {
        opt.style.color = 'red';
	    console.log('Something went wrong with stand №', i, err);
    });
};

function paintStands(){
    let select = document.getElementById('project_picker');
    let stands = config.Projects[select.selectedIndex].Stands;
    let i = 1;
        for (var stand in stands) {
            getStandStatus(stands[stand], i);
            console.log('checkStand № '+ i);
            i++;
        };
};

export function clipboardPage(text, url) {
    let output = 'cтраница ';
    let path = '';
    let once = false;
    let quotation_mark = ''; // для кавычек, при необходимости заменить '' -> '"'
    for (var bread in text){
        if (!once) {path = quotation_mark + text[bread]; once = true} 
        else {
        path = path + quotation_mark+' → '+quotation_mark + text[bread];
        };
    };
    path = path + quotation_mark;
    output = output + '[' + path + '|' + url + ']';
    navigator.clipboard
      .writeText(output)
      .then(() => {
        alert("Скопировано! " + path);
      })
      .catch(() => {
        alert("Ошибка копирования в буфер");
      });
};

export function buildPage(){
    readProjects();
    recallStoredProject();
};
