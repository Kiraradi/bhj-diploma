/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Отсутствует element');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-account') || event.target.closest('.remove-account')) {
        this.removeAccount();
      }

      if (event.target.classList.contains('transaction__remove') || event.target.closest('.transaction__remove')) {
        this.removeTransaction(event.target.dataset.id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (window.confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
          if (response.success) {
            App.updateWidgets();
            App.updateForms();
          }
        });
        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (window.confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        console.log(response);
        if (response.success) {
          App.update();
        }
      });
    }
    }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(options, (err,response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    if (name) {
      const contentTitle = document.querySelector('.content-title');
      contentTitle.textContent = name;
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    date = new Date(date);
    const dateString = date.toLocaleDateString('ru-RU', { year: "numeric", month: "long", day: "numeric" });
    const time = date.toLocaleTimeString('ru-RU', { hour: "numeric", minute: "numeric" });
    return `${dateString} в ${time}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transaction = document.createElement('div');
    transaction.classList.add('transaction', 'row');
    if (item.type === 'expense') {
      transaction.classList.add('transaction_expense');
    } else if (item.type === 'income') {
      transaction.classList.add('transaction_income');
    }

    const colMd = document.createElement("div");
    colMd.classList.add('col-md-7','transaction__details');

    const transactionIcon = document.createElement('div');
    transactionIcon.classList.add('transaction__icon');

    const faFoney = document.createElement('span');
    faFoney.classList.add('fa', 'fa-money', 'fa-2x');
    transactionIcon.insertAdjacentElement('beforeend', faFoney);

    colMd.insertAdjacentElement('beforeend', transactionIcon);

    const transactionInfo = document.createElement('div');
    transactionInfo.classList.add('transaction__info');

    const transactionTitle = document.createElement('h4');
    transactionTitle.classList.add('transaction__title');
    transactionTitle.textContent = item.name;

    const transactionDate = document.createElement('div');
    transactionDate.classList.add('transaction__date');
    transactionDate.textContent = this.formatDate(item.created_at);

    transactionInfo.insertAdjacentElement('beforeend', transactionTitle);
    transactionInfo.insertAdjacentElement('beforeend', transactionDate);

    colMd.insertAdjacentElement('beforeend', transactionInfo);

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const transactionSumm = document.createElement('div');
    transactionSumm.classList.add('transaction__summ');
    transactionSumm.textContent = item.sum;

    const currency = document.createElement('span');
    currency.classList.add('currency');
    currency.textContent = '₽';

    transactionSumm.insertAdjacentElement('beforeend', currency);
    colMd3.insertAdjacentElement('beforeend', transactionSumm);

    const colMd2 = document.createElement('div');
    colMd2.classList.add('col-md-2', 'transaction__controls');

    const button = document.createElement('button');
    button.classList.add('btn','btn-danger','transaction__remove');
    button.dataset.id = item.id;

    const i = document.createElement('i');
    i.classList.add('fa','fa-trash');
    button.insertAdjacentElement('beforeend', i);
    colMd2.insertAdjacentElement('beforeend', button);

    transaction.insertAdjacentElement('beforeend', colMd);
    transaction.insertAdjacentElement('beforeend',colMd3);
    transaction.insertAdjacentElement('beforeend',colMd2);
    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';
    data.forEach(item => {
      
      content.insertAdjacentElement('beforeend', this.getTransactionHTML(item));
    })

  }
}