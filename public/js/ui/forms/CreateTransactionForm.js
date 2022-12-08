

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelect = this.element.querySelector('.accounts-select');
    Account.list(null, (err, response) => {
      if (response.success) {
        accountsSelect.innerHTML = '';
        response.data.forEach( score => {
          const optionElement = document.createElement('option')
          optionElement.value = score.id;
          optionElement.textContent = score.name;
          accountsSelect.insertAdjacentElement('beforeend', optionElement);
        })
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        this.element.reset();
        const elementForm = new Modal(this.element.closest('.modal'));
        elementForm.close();
        App.update();
      }
    })
  }
}