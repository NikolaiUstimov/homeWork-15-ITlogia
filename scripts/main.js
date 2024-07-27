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
    // console.log(result);
}

//Вывод информации о пользователях
let i = 0;
function getInfo() {
    i++;
    // let userArr = [];
    // userArr.push(`${i}) ${this.firstName} ${this.lastName}, г. ${this.city}`)
    return console.log(`${i}) ${this.firstName} ${this.lastName}, г. ${this.city}`);
   // return console.log(userArr);
}

//Проверка функции getInfo()
function getUser() {
    persons.forEach(item => {
        // return getInfo.call(item.personal);
    })
}

//Вывод информации о пользователях, владеющих Figma
function getUserDesignFigma() {
    i = 0;
    let userSkillFigmaArr = [];
    persons.forEach(item => {
        let userSkillFigma = item.skills.find(skillItem => {
            return skillItem.name.toLowerCase() === "figma";
        })
        if (userSkillFigma && userSkillFigma.name) {
            userSkillFigmaArr.push(userSkillFigma);
            return getInfo.call(item.personal);
        }
    })
    console.log(userSkillFigmaArr);
}

function getUserSkillReact() {
    i = 0;
    let userSkillReact = null;
    persons.forEach(item => {
        let skillsReact = item.skills.find(skill => {
            return skill.name.toLowerCase() === "react";
        })
        if (skillsReact && skillsReact.name) {
            userSkillReact  = skillsReact;
            return getInfo.call(item.personal);
        }
        // console.log(userSkillReact);
    })
    console.log(userSkillReact);
}