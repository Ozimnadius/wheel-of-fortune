window.addEventListener('load', function () {
    new Wheel('.wheel');
});


class Wheel {
    constructor(selector) {
        this.wheel = document.querySelector(selector);
        this.spinner = this.wheel.querySelector('.wheel__spinner-rotate');
        this.trigger = this.wheel.querySelector(".wheel__start");

        this.prizeSlice = 360 / 10;
        this.spinClass = "is-spinning";
        this.selectedClass = "active";

        this.tickerAnim = '';
        this.rotation = 0;
        this.prizeNodes = document.querySelectorAll('.wheel__item');

        this.init();
    }

    init() {
        // отслеживаем нажатие на кнопку
        this.trigger.addEventListener("click", () => {
            // делаем её недоступной для нажатия
            this.trigger.disabled = true;
            // задаём начальное вращение колеса
            this.rotation = Math.floor(Math.random() * 360 + this.spinertia(2000, 5000));
            // убираем прошлый приз
            this.prizeNodes.forEach((prize) => prize.classList.remove(this.selectedClass));
            // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
            this.wheel.classList.add(this.spinClass);
            // через CSS говорим секторам, как им повернуться
            this.spinner.style.setProperty("--rotate", this.rotation);
        });

        // отслеживаем, когда закончилась анимация вращения колеса
        this.spinner.addEventListener("transitionend", () => {
            // останавливаем отрисовку вращения
            cancelAnimationFrame(this.tickerAnim);
            // получаем текущее значение поворота колеса
            this.rotation %= 360;
            // выбираем приз
            this.selectPrize();
            // убираем класс, который отвечает за вращение
            this.wheel.classList.remove(this.spinClass);
            // отправляем в CSS новое положение поворота колеса
            this.spinner.style.setProperty("--rotate", this.rotation);
        });
    }

    // функция запуска вращения с плавной остановкой
    spinertia = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // функция выбора призового сектора
    selectPrize = () => {
        const selected = Math.floor((378 - this.rotation) / this.prizeSlice);
        this.prizeNodes[selected].classList.add(this.selectedClass);
    };

}