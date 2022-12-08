/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */


class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Отсутствует element')
    } 
    this.element = element;
    this.update();
    this.registerEvents();
    
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accountsPanel = document.querySelector('.accounts-panel');
    accountsPanel.addEventListener('click', e => {
      if (e.target.classList.contains('create-account')) {
        const openWindow = App.getModal('createAccount');
        const modal = new Modal(openWindow.element);
        modal.open();
      }
      if (e.target.closest('.account')) {
        this.onSelectAccount(e.target.closest('.account'))
      }
      
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(null, (err, response) => {
        //console.log(response.data);
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = Array.from(document.querySelectorAll('.account'));
    if (accounts.length > 0) {
      accounts.forEach(account => {
        account.remove();
      })
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const activeElement = document.querySelector('.active');
    if (activeElement) {
      activeElement.classList.remove('active');
    }
    element.classList.add('active');
    App.showPage('transactions', { account_id: element.dataset.id })
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const liElement = document.createElement('li');
    liElement.classList.add('account');
    liElement.dataset.id = item.id;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', '#' );

    const spanName = document.createElement('span');
    spanName.textContent = item.name;

    const spanSum = document.createElement('span');
    spanSum.textContent = item.sum;

    linkElement.insertAdjacentElement('beforeend', spanName);
    linkElement.insertAdjacentHTML('beforeend', ' / ');
    linkElement.insertAdjacentElement('beforeend', spanSum);

    liElement.insertAdjacentElement('beforeend', linkElement);
    return liElement;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const accountsPanel = document.querySelector('.accounts-panel');
    if (data.length > 0) {
      data.forEach(item => {
        const htmlCodeItems = this.getAccountHTML(item);
        accountsPanel.insertAdjacentElement('beforeend', htmlCodeItems);
      })
    }
  }
}
