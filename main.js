import MODE from '../config/mode';
import EL from '../config/element';


export default class Display {
  constructor() {
    this.data = {
      display: {
        beforeX: 0,
        afterX: 0,
        resultX: 0,
        saveX: 0,
        w: 960,
        range: 960 - window.innerWidth,
      },
      point: {
        w: 48
      }
    }

    this.state = {
      touch: false
    }

    this.el = {
      display: null,
      displayWrap: null,
      displayTruck: null,
      displayImg: null,
      bar: null, 
      barBase: null,
      barMain: null,
    }

    window.addEventListener('load', () => {
      this.Init();
    });
    this.Point();
    this.SwiperImg();
  }

  Init() {
    if (MODE.IS_WIN == 0) return;
    [...EL.displayAll].forEach(element => {
      const displayWrap = element.querySelector('.display__wrap');
      const displayTruck = element.querySelector('.display__truck');
      const displayImg = element.querySelector('.display__img');
      displayWrap.style.width = window.innerWidth + 'px';
      displayWrap.style.height = displayImg.clientHeight + 'px';
      displayTruck.style.width = displayImg.clientWidth + 'px';
      displayTruck.style.transform = 'translateX(-' +  ((displayImg.clientWidth / 2) - (window.innerWidth / 2))  + 'px)';
      element.dataset.swiperRange = (displayImg.clientWidth / 2) - (window.innerWidth / 2);
    });
  }

  Point() {
    let array = [];
    [...EL.displayPointAll].forEach(element => {
      element.addEventListener('mouseover', (e) => {
        element.classList.add('-active');
      });
    });
    [...EL.displayPointAll].forEach(element => {
      element.addEventListener('mouseleave', (e) => {
        element.classList.remove('-active');
      });
    });
    [...EL.displayPointAll].forEach(element => {
      element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (array[0] !== element) {
          array.push(element);
        }
        if (array.length > 1) {
          array[0].classList.remove('-active');
          array.shift();
        }
        element.classList.toggle('-active');        
      });
    });
    [...EL.windowAll].forEach(element => {
      element.addEventListener('touchstart', (e) => {
        e.stopImmediatePropagation();
        setTimeout(() => {
          const activePointAll = document.querySelectorAll('.display__point.-active');
          activePointAll[0].classList.remove('-active');
        }, 500);
      });
    });
  }

  SwiperImg() {
    [...EL.displayAll].forEach(element => {
      element.addEventListener('touchstart', (e) => {
        this.el.display = element;
        this.el.displayTruck = this.el.display.querySelector('.display__truck');
        this.el.displayImg = this.el.display.querySelector('.display__img');
        this.state.touch = true;
        this.data.display.beforeX = e.changedTouches[0].pageX;
        this.data.display.saveX = Number(element.dataset.swiperRange);
        this.RangeCompute(this.el.displayImg);
      });
      element.addEventListener('touchmove', (e) => {
        if (!this.state.touch) return;
        if (this.data.display.range >= this.data.display.resultX && 0 <= this.data.display.resultX) {
          this.data.display.afterX = e.changedTouches[0].pageX;
          this.data.display.resultX = this.data.display.beforeX - this.data.display.afterX  + this.data.display.saveX;
          // スクロール範囲を超えてしまった場合、数値を限界値に設定
          if (this.data.display.range <=  this.data.display.resultX) {
             this.data.display.resultX = this.data.display.range;
          } else if (0 >=  this.data.display.resultX) {
             this.data.display.resultX = 0;
          }
          this.el.displayTruck.style.transform = 'translateX(' + (this.data.display.resultX * -1) + 'px)';
          this.el.display.dataset.swiperRange = this.data.display.resultX;
        }
      });
      element.addEventListener('touchend', (e) => {
        this.state.touch = false;
        this.data.display.saveX = this.data.display.resultX;
      });
    });
  }

  RangeCompute(displayImg) {
    this.data.display.range = displayImg.clientWidth - window.innerWidth;
  }
}