// создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
const wheel = document.querySelector(".wheel");
const spinner = wheel.querySelector(".wheel__spinner-rotate");
const trigger = wheel.querySelector(".wheel__start");
const ticker = wheel.querySelector(".wheel__ticker");

const prizeSlice = 360 / 10;
const prizeOffset = Math.floor(180 / 10);
const spinClass = "is-spinning";
const selectedClass = "active";
const spinnerStyles = window.getComputedStyle(spinner);

// переменная для анимации⠀
let tickerAnim;
// угол вращения
let rotation = 0;
// текущий сектор⠀
let currentSlice = 0;
// переменная для текстовых подписей
let prizeNodes = document.querySelectorAll('.wheel__item');


// функция запуска вращения с плавной остановкой
const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// отслеживаем нажатие на кнопку
trigger.addEventListener("click", () => {
    // делаем её недоступной для нажатия
    trigger.disabled = true;
    // задаём начальное вращение колеса
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    // убираем прошлый приз
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
    wheel.classList.add(spinClass);
    // через CSS говорим секторам, как им повернуться
    spinner.style.setProperty("--rotate", rotation);
    // возвращаем язычок в горизонтальную позицию
    ticker.style.animation = "none";
    // запускаем анимацию вращение
    runTickerAnimation();
});

// функция запуска вращения с плавной остановкой
const runTickerAnimation = () => {
    // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];
    let rad = Math.atan2(b, a);

    if (rad < 0) rad += (2 * Math.PI);

    const angle = Math.round(rad * (180 / Math.PI));
    const slice = Math.floor(angle / prizeSlice);

    // анимация язычка, когда его задевает колесо при вращении
    // если появился новый сектор
    if (currentSlice !== slice) {
        // убираем анимацию язычка
        ticker.style.animation = "none";
        // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
        setTimeout(() => ticker.style.animation = null, 10);
        // после того как язычок прошёл сектор — делаем его текущим
        currentSlice = slice;
    }
    // запускаем анимацию
    tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// отслеживаем, когда закончилась анимация вращения колеса
spinner.addEventListener("transitionend", () => {
    // останавливаем отрисовку вращения
    cancelAnimationFrame(tickerAnim);
    // получаем текущее значение поворота колеса
    rotation %= 360;
    // выбираем приз
    selectPrize();
    // убираем класс, который отвечает за вращение
    wheel.classList.remove(spinClass);
    // отправляем в CSS новое положение поворота колеса
    spinner.style.setProperty("--rotate", rotation);
    // делаем кнопку снова активной
    // trigger.disabled = false;
});

// функция выбора призового сектора
const selectPrize = () => {
    const selected = Math.floor((378-rotation) / prizeSlice);
    console.log(selected);
    // debugger;
    prizeNodes[selected].classList.add(selectedClass);
};