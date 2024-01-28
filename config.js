// Пока не параметризуется полностью, TODO: доделать

const Config = 
{
    Projects:[{
		name: 'САКУРА',
        jira_name: "SAKURA",
        tms_id: 1,
        Stands:["https://первый стенд","https://второй стенд","https://докер:46043","https://127.0.0.1"],
        Credentials:{
		admin:{login:"секрет", password:"секрет"},
		test:{login:"TestProject", password:"12345678"}
	}},
		{
		name: "ПУСК",
        jira_name:"PUSK",
        tms_id: 104,
        Stands:["http://localhost:8080"],
        Credentials:[]
    },
        {
		name: "Умный мониторинг",
        jira_name:"ITESM",
        tms_id: 274,
        Stands:["http://секрет"],
        Credentials:[]
    }],
    Templates:{
        bug:"*ОПИСАНИЕ ПРОБЛЕМЫ:*\n*ШАГИ ВОСПРОИЗВЕДЕНИЯ:*\n\n*ПОЛУЧЕННЫЙ РЕЗУЛЬТАТ:*\n\n*ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:*",
        task:"*ОПИСАНИЕ ПРОБЛЕМЫ:*\n\n*ЗАДАЧА:*"
    },
    Jira_locale:{
        bug:"Ошибка",
        task:"Задача"
    }
};

export default Config;
