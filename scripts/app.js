'use strict';

let habbits = [
    {
        "id": 1,
        "icon": "sport",
        "name": "Отжимания",
        "target": 10,
        "days": [
            { "comment": "Первый подход всегда дается тяжело" },
            { "comment": "Второй день уже проще" }
        ]
    },
    {
        "id": 2,
        "icon": "food",
        "name": "Правильное питание",
        "target": 10,
        "days": [{ "comment": "Круто!" }]
    }
];
let HABBIT_KEY = 'HABBIT_KEY';
let currentId;

const page = {
    menu: {
        menuList: document.querySelector('.menu__list')
    },
    head: {
        h1: document.querySelector('h1'),
        progressProcent: document.querySelector('.progress__procent'),
        progressCoverBar: document.querySelector('.progress__cover-bar'),
    },
    content: {
        day: document.querySelector('#days'),
        habbitAddDay: document.querySelector('.habbit__day')
    },
    popup: {
        windowPopup: document.querySelector('#add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}

//Load in localStorage

// utils

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if(Array.isArray(habbitArray)){
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits)); 
}

function resetForm(form, fields) {
    for (const field of fields){
        form[field].value = '';
    }

}

function validateAndGetFormData(form, fields) {
    const formData = new FormData(form);
    const res = {};
    for (const field of fields) {
        const fieldValue = formData.get(field);
        form[field].classList.remove('error');
        if (!fieldValue){
            form[field].classList.add('error');
            return;
        }
        res[field] = fieldValue;
    }
    let isValid = true;
    for (const field of fields) {
        if(!res[field]){
            isValid = false;
        }        
    }
    if(!isValid) {
        return;
    }
    return res; 
}

// render
function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if(!existed) {
            const element = document.createElement('button');
            element.classList.add('menu__item');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img class="menu-icon" src="images/${habbit.icon}.svg" alt="${habbit.name}">`
            if(habbit.id === activeHabbit.id){
                element.classList.add('menu__item_active');       
            }
            page.menu.menuList.appendChild(element);
            continue;
        }
        if(habbit.id === activeHabbit.id){
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }
    
}

function rerenderHead(activeHabbitId) {
    page.head.h1.innerHTML = activeHabbitId.name;
    page.head.progressProcent.innerHTML = `${activeHabbitId.days.length * 100 / activeHabbitId.target}%`;
    page.head.progressCoverBar.style.width = `${activeHabbitId.days.length * 100 / activeHabbitId.target}%`;
}

function rerenderContent(activeHabbitId) {
    page.content.day.innerHTML = '';
    for (const index in activeHabbitId.days) {
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `
            <div class="habbit__day">День ${Number(index) + 1}</div>
            <div class="habbit__comment">${activeHabbitId.days[index].comment}</div>
            <button class="habbit__delete" onclick="deleteDays(${index})">
                <img src="./images/delete.svg" alt="Удалить день 1">
            </button>
        `;
        page.content.day.appendChild(element);
    }
    page.content.habbitAddDay.innerHTML = `День ${activeHabbitId.days.length+1}`;
}

function rerender(activeHabbitId) {
    currentId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);    
    if(!activeHabbit){
        return;
    };
    if(currentId === activeHabbit.id){
        rerenderMenu(activeHabbit);
        rerenderHead(activeHabbit);
        rerenderContent(activeHabbit);
    };
    
    document.location.replace(document.location.pathname + "#" + activeHabbitId);
}

function addDays(event) {
    event.preventDefault();
    const habbitForm = event.target;
    const input =  habbitForm.querySelector('input');
    // const data = new FormData(habbitForm);
    const data = validateAndGetFormData(habbitForm, ['comment']);
    if (!data) {
        input.classList.add('error');
        return;
    } else {
        input.classList.remove('error');
    }
    for(const habbit of habbits) {
        if(habbit.id === currentId){
            habbit.days.push({
                comment: data.comment
            });
        }
    }
    saveData();
    resetForm(event.target, ['comment'])
    rerender(currentId);
    
}

function deleteDays(index) {
    for (const habbit of habbits){
        if(habbit.id === currentId){
            habbit.days.splice(index, 1);
        }
        rerender(currentId);
        saveData();
    }  
}

function togglePopup() {
    const popup =  page.popup.windowPopup;
    if(popup.classList.contains('cover-hidden')){
        popup.classList.remove('cover-hidden');
    } else {
        popup.classList.add('cover-hidden');
    }
}

function setIcon(context, name){
    page.popup.iconField.value = name;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active');
}

function addHobbit(event) {
    event.preventDefault();
    // const data = new FormData(event.target);
    const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
    const obj = {
        id: habbits.length+1,
        icon: page.popup.iconField.value,
        name: data.name,
        target: data.target,
        days: []
    }
    habbits.push(obj);
    resetForm(event.target, ['name', 'target']);
    togglePopup();
    saveData();
    rerender(currentId);
}

// init
(() => {
    loadData();
    
    const hashId = Number(document.location.hash.replace('#', ''));
    const urlHabbit = habbits.find(habbit => habbit.id == hashId);
    if(habbits.length > 0){
        if(urlHabbit){
            rerender(urlHabbit.id);
        } else {
            rerender(habbits[0].id);
        }
    }
})();