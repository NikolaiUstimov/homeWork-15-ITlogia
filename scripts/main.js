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
    getUser();
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
        })
        let specializationId = specializations.find(specializationItem => {
            return specializationItem.id === item.personal.specializationId
        })
        if (citiesId && citiesId.name) {
            item.personal.city = citiesId.name;
        }
        if (specializationId && specializationId.name) {
            item.personal.specialization = specializationId.name;
        }
        delete item.personal.locationId;
        delete item.personal.specializationId;
        return item;
    })
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
    // return console.log(`${i}) ${this.firstName} ${this.lastName}, г. ${this.city}`)
}

//Проверка функции getInfo()
function getUser() {
    persons.forEach(item => {
        // return getInfo.call(item.personal);
    });
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
        })
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
    i = 0;
    elementHTML('p', "Порядок зарплатных ожиданий backend-разработчиков из Москвы");
    let newArr = [];
    persons.forEach(item => {
        let devFullDay = item.request.find(fullDay => {
            if (fullDay.value === "Полная") {
                return fullDay;
            }
        })
        if (item.personal.city.toLowerCase() === "москва" && item.personal.specialization === "backend" && devFullDay.value === "Полная") {
                return newArr.push(item);
        }
    });
    newArr.map(item => {
        let salaryDev = item.request.find(salary => {
            if (salary.name === "Зарплата") {
                return salary;
            }
        })
        if (salaryDev) {
            item.devSalary = salaryDev.value;
            return item;
        }
    });
    newArr.sort((a, b) => {
        return a.devSalary - b.devSalary;
    });
    let index = 0;
    newArr.forEach(item => {
        index++;
        return elementHTML('div', `${index}) ${item.personal.firstName} ${item.personal.lastName}, зарплата ${item.devSalary}р.`);
    })
}

//Дизайнеры, владеющие Photoshop и Figma одновременно на уровне не ниже 6 баллов
function getUserDesignPhotoshopAndFigma() {
    let des = persons.filter(item => {
        let doubleSkill;
        if (item.personal.specialization === "designer") {
            doubleSkill = item.skills.find(skillItem => {
                if ((skillItem.name === "Photoshop" && skillItem.level >= 6) || (skillItem.name === "Figma" && skillItem.level >= 6)) {
                    return skillItem;
                }
            });
        }
        if (doubleSkill) {
            return item;
        }
    });
    // console.log(des);
}

//Сбор команды для разработки проекта
function getDevelopmentTeam() {
    let teamArr = [];
    persons.forEach(item => {
        let topFigma = item.skills.reduce((levelMax, figmaItem) => {
            return levelMax.level > figmaItem.level ? levelMax : figmaItem;
        })
        if (item.personal.specialization === "designer" && topFigma) {
            return teamArr.push(item);
        }
    })
    console.log(teamArr);
}