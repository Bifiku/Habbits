'use strict';

let habbits = [];
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
    }
}

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

// render
function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if(!existed) {
            const element = document.createElement('button');
            element.classList.add('menu__item');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}">`
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
    for(let i = 0; i < activeHabbitId.days.length; i++){
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `
            <div class="habbit__day">День ${i+1}</div>
            <div class="habbit__comment">${activeHabbitId.days[i].comment}</div>
            <button class="habbit__delete" onclick="deleteDays(${i})">
                <img src="./images/delete.svg" alt="Удалить день 1">
            </button>
        `;
        page.content.day.appendChild(element);
        page.content.habbitAddDay.innerHTML = `День ${activeHabbitId.days.length+1}`
    }
}

function rerender(activeHabbitId) {
    currentId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);    
    if(!activeHabbit){
        return;
    }
    // console.log(activeHabbit);
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

function addDays(event) {
    event.preventDefault();
    const habbitForm = event.target;
    const input =  habbitForm.querySelector('input');
    const data = new FormData(habbitForm);
    if (!data.get('comment')) {
        input.classList.add('error');
        return;
    } else {
        input.classList.remove('error');
    }
    for(const habbit of habbits) {
        if(habbit.id === currentId){
            habbit.days.push({
                comment: data.get('comment')
            });
        }
    }
    saveData();
    input.value = '';
    rerender(habbits[currentId-1].id);
    
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

// init
(() => {
    loadData();
    rerender(habbits[0].id);
})();