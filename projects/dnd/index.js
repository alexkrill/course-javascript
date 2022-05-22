/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {
  if (currentDrag) {
    currentDrag.style.top = e.clientY - startY + 'px';
    currentDrag.style.left = e.clientX - startX + 'px';
  }
});

let currentDrag;
let startX = 0;
let startY = 0;

export function createDiv() {
  const newDiv = document.createElement('div');
  newDiv.classList.add('draggable-div');
  newDiv.style.background = getRandomColor();
  newDiv.style.width = getRandomInt();
  newDiv.style.height = getRandomInt();
  newDiv.style.top = 100 * Math.random() + '%';
  newDiv.style.left = 100 * Math.random() + '%';

  newDiv.addEventListener('mousedown', (e) => {
    currentDrag = newDiv;
    startX = e.offsetX;
    startY = e.offsetY;
  });
  newDiv.addEventListener('mouseup', () => (currentDrag = false));

  return newDiv;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt() {
  return Math.floor(Math.random() * 200) + 'px';
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});
