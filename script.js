const swap_btn = document.querySelector('.swap-btn');
const block1 = document.querySelector('.block1');
const block2 = document.querySelector('.item2');
const block3 = document.querySelector('.item3');
const block4 = document.querySelector('.item4');
const block5 = document.querySelector('.item5');
const block6 = document.querySelector('.item6');
const colorPicker = document.getElementById('colorInput');
const editLinks = document.querySelectorAll('.edit-link');
const areaBtn = document.querySelector(".areaBtn");
const numBtn = document.querySelector(".maxNumberBtn");



//Task 1
function swap() {
    const currentXBlock = document.querySelector('.logo');
    const currentYBlock = document.querySelector('.book');
    if (currentXBlock.innerHTML && currentYBlock.innerHTML) {
      let tempContent = currentXBlock.innerHTML;
      currentXBlock.innerHTML = currentYBlock.innerHTML;
      currentYBlock.innerHTML = tempContent;
    }
  }

//Task 2
function updateRadiusValue() {
    const radius = document.getElementById('range').value;
    document.getElementById('radiusValue').textContent = radius;
}
  
  function calculateArea() {
    const radius = parseFloat(document.getElementById('range').value);
    const area = Math.PI * Math.pow(radius, 2);
    document.getElementById('areaOutput').textContent = area.toFixed(2);
}

//Task 3
function saveCookies(name, value, maxAge = 3600) {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax;`;
  }
  
  
  function loadCookies(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  
  function findMaxNumbers() {
    const form = document.getElementById('numberForm');
    const inputs = form.querySelectorAll('input[name="number"]');
  
    const numbers = [];
    for (let i = 0; i < inputs.length; i++) {
      const value = parseFloat(inputs[i].value);
      if (!isNaN(value)) {
        numbers.push(value);
      }
    }
  
    if (numbers.length === 0) {
      alert('Please enter valid numbers.');
      return;
    }
  
    const maxNumber = Math.max(...numbers);
    const countMax = numbers.filter(num => num === maxNumber).length;
  
    alert(`Max number: ${maxNumber}, Count: ${countMax}`);
    saveCookies('maxCount', countMax);
  }
  
  window.onbeforeunload = function (event) {
    const cookieData = loadCookies('maxCount');
    if (cookieData) {
      const userChoice = confirm(`Data from cookies: ${cookieData}. Delete?`);
  
      if (userChoice) {
        saveCookies('maxCount', '', -1);
        location.reload();
      } else {
        alert('Cookies retained. Please reload the page manually.');
      }
  
      event.preventDefault();
    }
  };

//Task 4
function changeColor() {
  const colorPicker = document.getElementById('colorpicker');
  const block2 = document.getElementById('block2');

  block2.style.backgroundColor = colorPicker.value;
  localStorage.setItem('block2Color', colorPicker.value);
}

document.addEventListener('DOMContentLoaded', () => {
  
  const savedColor = localStorage.getItem('block2Color');
  const block2 = document.getElementById('block2');
  if (savedColor) {
    block2.style.backgroundColor = savedColor;
    colorpicker.value = savedColor;
  }
  initializeBlocksFromLocalStorage();
});

//Task 5
function initializeBlocksFromLocalStorage() {
    const totalItems = 6;
    for (let i = 1; i <= totalItems; i++) {
      const block = document.querySelector(`.block${i}`);
      const savedContent = localStorage.getItem(`block${i}Content`);
      const savedBlockColor = localStorage.getItem(`block${i}BgColor`)
      if (savedContent) {
        block.innerHTML = savedContent;
        addResetButton(block, i);
      }
      if (savedBlockColor) {
        block.style.backgroundColor = savedBlockColor;
      }
      if (!savedBlockColor && i == 2){
        const savedColor = localStorage.getItem('block2Color');
        if (savedColor) {
          document.querySelector('.block').style.backgroundColor = savedColor;
        }
      }
      block.dataset.originalContent = block.innerHTML;
    }
  //colorPicker.addEventListener('blur', changeColor);
  //colorPicker.disabled = false;
}

function editHTML(itemNum) {
    const block = document.querySelector(`.block${itemNum}`);
    if (block.classList.contains('editing-item')) {
        return
    };
  
    const originalContent = block.dataset.originalContent || block.innerHTML;
  
    block.classList.add('editing-item');
    block.innerHTML = `
      <div class="editing-container"> 
          <textarea class="editing-area">${originalContent}</textarea>
          <button id="save${itemNum}" class="editing-btn">Зберегти</button>
          <button id="cancel${itemNum}" class="editing-btn">Закрити</button>
      </div>
    `;
  
    document.getElementById(`save${itemNum}`).addEventListener('click', function () {
      const newContent = block.querySelector('textarea').value;
      const color = getRandomColor();
      block.innerHTML = newContent;
      block.style.backgroundColor = color; 
      localStorage.setItem(`block${itemNum}Content`, newContent);
      localStorage.setItem(`block${itemNum}BgColor`, color);
      block.dataset.originalContent = originalContent;
      block.classList.remove('editing-item');
      const resetClassName = `.reset${itemNum}`
      const resetBtn = document.querySelector(this.resetClassName);
      if(!resetBtn){
        addResetButton(block, itemNum);
      }
    });
  
    document.getElementById(`cancel${itemNum}`).addEventListener('click', function () {
      block.innerHTML = originalContent;
      block.style.backgroundColor = '';
      if(itemNum == 2){
        const savedColor = localStorage.getItem('block2Color');
        if (savedColor) {
          block2.style.backgroundColor = savedColor;
        }
      }
      block.classList.remove('editing-item');
    });
    editLinks.forEach((link, index) => {
      if(link){
        link.removeEventListener('dblclick', () => editHTML(index + 1));
        link.addEventListener('dblclick', () => editHTML(index + 1));
      }
  });
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addResetButton(block, itemNum) {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.classList.add('editing-btn');
    resetButton.classList.add(`reset${itemNum}`);
    resetButton.addEventListener('click', () => {
        location.reload();
        localStorage.removeItem(`block${itemNum}Content`);
        localStorage.removeItem(`block${itemNum}BgColor`);
        block.style.backgroundColor = '';
        block.innerHTML = block.dataset.originalContent;
        const savedColor = localStorage.getItem('item2Color');
        if (savedColor) {
            block2.style.backgroundColor = savedColor;
        } else {
            block2.style.backgroundColor = '';
        }
    });
    block.appendChild(resetButton);
}



