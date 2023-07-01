function Console(element) {
  // Добавляем классы к элементу
  element.classList.add('console');
  element.classList.add('console-focused');

  // Переменные
  let symbols = [];
  let currentPosition = 0;
  let isBlinking = true;
  let isBlocked = false;
  let autoScroll = true;

  // Добавляем нулевой символ
  const nullSymbol = createSymbol('symbol');
  element.appendChild(nullSymbol);

  // Функция для создания символа
  function createSymbol(className) {
    const symbol = document.createElement('span');
    symbol.className = className;
    return symbol;
  }

  // Функция для вставки символа после другого символа
  function insertAfter(newSymbol, refSymbol) {
    refSymbol.parentNode.insertBefore(newSymbol, refSymbol.nextSibling);
  }

  // Функция для обновления положения курсора
  function updateCursorPosition() {
    symbols.forEach((symbol, index) => {
      symbol.classList.remove('symbol-active');
      if (index === currentPosition) {
        symbol.classList.add('symbol-active');
      }
    });
  }

  // Функция для обновления прокрутки
  function updateScroll() {
    if (autoScroll) {
      element.scrollTop = element.scrollHeight;
    }
  }

  // Обработчик события keypress
  function handleKeyPress(event) {
    if (isBlocked) {
      return;
    }

    const symbol = createSymbol('symbol-right');
    symbol.textContent = event.key;

    insertAfter(symbol, symbols[currentPosition - 1] || nullSymbol);
    symbols.splice(currentPosition, 0, symbol);
    currentPosition++;

    updateScroll();
  }

  // Обработчик события keydown
  function handleKeyDown(event) {
    if (isBlocked) {
      return;
    }

    switch (event.keyCode) {
      case 8: // Backspace
        if (currentPosition > 0) {
          const symbolToRemove = symbols[currentPosition - 1];
          element.removeChild(symbolToRemove);
          symbols.splice(currentPosition - 1, 1);
          currentPosition--;
        }
        break;
      case 37: // Left arrow
        if (currentPosition > 0) {
          currentPosition--;
        }
        break;
      case 39: // Right arrow
        if (currentPosition < symbols.length) {
          currentPosition++;
        }
        break;
    }

    updateCursorPosition();
  }

  // Обработчик события focus
  function handleFocus() {
    isBlinking = true;
    element.classList.add('console-focused');
  }

  // Обработчик события blur
  function handleBlur() {
    isBlinking = false;
    element.classList.remove('console-focused');
  }

  // Инициализация консоли
  function init() {
    element.setAttribute('tabindex', '-1');
    element.addEventListener('keypress', handleKeyPress);
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    setInterval(function () {
      if (isBlinking) {
        symbols[currentPosition]?.classList.toggle('symbol-blink');
      }
    }, 500);

    element.focus();
  }

  // Очистка консоли
  this.clear = function () {
    symbols.forEach((symbol) => {
      element.removeChild(symbol);
    });

    symbols = [];
    currentPosition = 0;

    const nullSymbol = createSymbol('symbol-left');
    element.appendChild(nullSymbol);
  };

  // Вывод текста в консоль
  this.print = function (text, color, bgcolor, bold) {
    if (isBlocked) {
      return false;
    }

    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line) {
        const lineElement = document.createElement('span');
        lineElement.className = 'symbol-line';

        if (bold) {
          lineElement.style.fontWeight = 'bold';
        }
        if (color !== undefined) {
          lineElement.style.color = color;
        }
        if (bgcolor !== undefined) {
          lineElement.style.backgroundColor = bgcolor;
        }

        for (let j = 0; j < line.length; j++) {
          const char = line.charAt(j);
          const symbol = createSymbol('symbol');
          symbol.textContent = char;
          lineElement.appendChild(symbol);
          symbols.push(symbol);
        }

        element.appendChild(lineElement);
      }

      if (i < lines.length - 1) {
        element.appendChild(document.createElement('br'));
      }
    }

    updateScroll();

    return true;
  };

  // Установка блокировки консоли
  this.block = function () {
    isBlocked = true;
    element.classList.add('console-blocked');
  };

  // Снятие блокировки консоли
  this.unblock = function () {
    isBlocked = false;
    element.classList.remove('console-blocked');
  };

  // Включение автопрокрутки
  this.enableAutoScroll = function () {
    autoScroll = true;
  };

  // Отключение автопрокрутки
  this.disableAutoScroll = function () {
    autoScroll = false;
  };

  init();
}
