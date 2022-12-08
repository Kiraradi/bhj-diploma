/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Отсутствует element');
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const btnSuccess = document.querySelector('.btn-success');
    const btnDanger = document.querySelector('.btn-danger');

    btnSuccess.addEventListener('click', () => {
      const openWindow = App.getModal('newIncome');
      const modal = new Modal(openWindow.element);
      modal.open();
    });

    btnDanger.addEventListener('click', () => {
      const openWindow = App.getModal('newExpense');
      const modal = new Modal(openWindow.element);
      modal.open();
    })

  }
}
