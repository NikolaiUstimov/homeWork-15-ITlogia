"use strict";
let persons = [];
let cities = [];
let specializations = [];

Promise.all(
    [
        fetch("JSON/person.json"),
        fetch("JSON/cities.json"),
        fetch("JSON/specializations.json"),
    ]
).then(async ([personsResponse, citiesResponse, specializationsResponse]) => {
    const personsJson = await personsResponse.json();
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [personsJson, citiesJson, specializationsJson];
})
.then(response => {
    persons = response[0];
    cities = response[1];
    specializations = response[2];

    getCitiesArr();
    getUserDesignFigma();
    getUserSkillReact();
    getUserAge();
    getDevBackend();
    getUserDesignPhotoshopAndFigma();
    getDevelopmentTeam();
})

//Добавление названия города и специальности, вместо locationId и specializationId
function getCitiesArr() {
    let result = persons.map(item => {
        let citiesId = cities.find(cityItem => {
            return cityItem.id === item.personal.locationId;
        });
        let specializationId = specializations.find(specializationItem => {
            return specializationItem.id === item.personal.specializationId
        });
        if (citiesId && citiesId.name) {
            item.personal.city = citiesId.name;
        }
        if (specializationId && specializationId.name) {
            item.personal.specialization = specializationId.name;
        }
        delete item.personal.locationId;
        delete item.personal.specializationId;
        return item;
    });
    console.log(result);
}

//Функция создания HTML элемент
function elementHTML(teg, text) {
    let element = document.createElement(teg);
    element.textContent = text;
    return document.body.appendChild(element);
}

//Вывод информации о пользователях
let i = 0;
function getInfo() {
    i++;
    let div = document.createElement("div");
    div.textContent = `${i}) ${this.firstName} ${this.lastName}, г. ${this.city}`;
    document.body.appendChild(div);
    return div;
}

//Вывод информации о пользователях, владеющих Figma
function getUserDesignFigma() {
    i = 0;
    elementHTML('p', "Пользователи, владеющие Figma");
    persons.forEach(item => {
        let userSkillFigma = item.skills.find(skillItem => {
            return skillItem.name.toLowerCase() === "figma";
        });
        if (userSkillFigma && userSkillFigma.name) {
            return getInfo.call(item.personal);
        }
    });
}

//Первый попавшийся разработчик, владеющий react
function getUserSkillReact() {
    i = 0;
    elementHTML('p', "Первый пользователь из массива данных, владеющий React");
    let userSkillReact = [];
    persons.forEach(item => {
        let skillsReact = item.skills.find(skill => {
            return skill.name.toLowerCase() === "react";
        });
        if (skillsReact) {
            return userSkillReact.push(item);
        }
    });
    getInfo.call(userSkillReact[0].personal);
}

//Проверка возраста пользователей
function getUserAge() {
    let index = 0;
    let today = new Date();
    let currentYear = today.getFullYear();
    elementHTML('p', "Информация о возрасте пользователей");
    persons.forEach(item => {
        index++;
        let dateParse = item.personal.birthday.split('.');
        let userBirthday = new Date(+dateParse[2], +dateParse[1], +dateParse[0]);
        let userYearDate = userBirthday.getFullYear();
        if (currentYear - userYearDate > 18) {
            return elementHTML('div', `${index}) ${item.personal.firstName} ${item.personal.lastName} старше 18 лет`);
        }
        if (currentYear - userYearDate < 18) {
            return elementHTML('div', `${index}) ${item.personal.firstName} ${item.personal.lastName} младше 18 лет`);
        }
        if (currentYear - userYearDate === 18) {
            return elementHTML('div', `${index}) ${item.personal.firstName} ${item.personal.lastName} возраст 18 лет`);
        }
    });
}

//backend-разработчики из Москвы с работой на полный день
function getDevBackend() {
    let index = 0;
    elementHTML('p', "Порядок зарплатных ожиданий backend-разработчиков из Москвы");
    let newArr = [];
    persons.forEach(item => {
        let devFullDay = item.request.find(fullDay => {
            if (fullDay.value === "Полная") {
                return fullDay;
            }
        });
        if (item.personal.city.toLowerCase() === "москва" && item.personal.specialization === "backend" && devFullDay.value === "Полная") {
                return newArr.push(item);
        }
    });
    newArr.map(item => {
        let salaryDev = item.request.find(salary => {
            if (salary.name === "Зарплата") {
                return salary;
            }
        });
        if (salaryDev) {
            item.devSalary = salaryDev.value;
            return item;
        }
    });
    newArr.sort((a, b) => {
        return a.devSalary - b.devSalary;
    });
    newArr.forEach(item => {
        index++;
        return elementHTML('div', `${index}) ${item.personal.firstName} ${item.personal.lastName}, зарплата ${item.devSalary}р.`);
    });
}

//Дизайнеры, владеющие Photoshop и Figma одновременно на уровне не ниже 6 баллов
function getUserDesignPhotoshopAndFigma() {
    let index = 0;
    elementHTML('p', "Пользователи, одновременно владеющие Photoshop и Figma на уровне не ниже 6 баллов");
    let designersWithSkills = persons.filter(person => {
        if (person.personal.specialization === 'designer') {
            let hasPhotoshop = person.skills.some(skill => skill.name === 'Photoshop' && skill.level >= 6);
            let hasFigma = person.skills.some(skill => skill.name === 'Figma' && skill.level >= 6);
            return hasPhotoshop && hasFigma;
        }
        return false;
    });
    designersWithSkills.forEach(person => {
        index++;
        return elementHTML('div',`${index}) ${person.personal.firstName} ${person.personal.lastName}, г. ${person.personal.city}`);
    });
}

//Сбор команды для разработки проекта
function getDevelopmentTeam() {
    //Поиск лучшего дизайнера, владеющего Figma
    i = 0;
    elementHTML('p', "Команда для разработки проекта")
    let designer = persons.filter(item => {
        return item.personal.specialization === 'designer';
    });
    let getFigmaSkillLevel = function (person) {
        let figmaSkill = person.skills.find(skill => skill.name === 'Figma')
        if(figmaSkill) {
            figmaSkill = figmaSkill.level;
        } else {
            figmaSkill = 0;
        }
        return figmaSkill;
    }
    let bestFigmaDesigner = designer.reduce((best, current) => {
        return getFigmaSkillLevel(current) > getFigmaSkillLevel(best) ? current : best;
    });
    getInfo.call(bestFigmaDesigner.personal, elementHTML('span', "Лучший дизайнер на Figma:"));

    //Поиск лучшего frontend-разработчика, владеющего Angular
    let frontendDev = persons.filter(item => {
        return item.personal.specialization === 'frontend';
    });
    let getAngularSkillLevel = function (person) {
        let angularSkill = person.skills.find(skill => skill.name === 'Angular')
        if(angularSkill) {
            angularSkill = angularSkill.level;
        } else {
            angularSkill = 0;
        }
        return angularSkill;
    }
    let bestAngularDev = frontendDev.reduce((best, current) => {
        return getAngularSkillLevel(current) > getAngularSkillLevel(best) ? current : best;
    });
    getInfo.call(bestAngularDev.personal, elementHTML('span', "Лучший frontend-разработчик на Angular:"));

    //Поиск лучшего frontend-разработчика, владеющего Angular
    let backendDev = persons.filter(item => {
        return item.personal.specialization === 'backend';
    });
    let getGoLangSkillLevel = function (person) {
        let goLangSkill = person.skills.find(skill => skill.name === 'Go')
        if(goLangSkill) {
            goLangSkill = goLangSkill.level;
        } else {
            goLangSkill = 0;
        }
        return goLangSkill;
    }
    let bestGoLangDev = backendDev.reduce((best, current) => {
        return getGoLangSkillLevel(current) > getGoLangSkillLevel(best) ? current : best;
    });
    getInfo.call(bestGoLangDev.personal, elementHTML('span', "Лучший backand-разработчик на Go:"));
}