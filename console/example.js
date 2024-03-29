window.onload = function() {
  var c = new Console(document.getElementById("console"));
  
  function apps(text) {
    if (text === '') {
      c.print("Введите команду: ");
      return;
    } else if (text === 'help') {
      c.print("\rhelp > Список функций:\r");
      c.print("alert - функция вызывает окошко alert\r");
      c.print("clear - очистка экрана\r");
      c.print("exit - функция для завершения\r\r");
    } else if (text === 'alert') {
      alert("Работает!");
    } else if (text === 'exit') {
      c.exit();
    } else if (text === 'clear') {
      c.clear();
    } else {
      c.print("Такой команды не существует, для помощи введите help\r");
    }
    
    apps('');
  }
  
  c.input = apps;
  apps('help'); // выполнение команды по умолчанию `help`
}
