/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if(response.success) {
        App.setState('user-logged');
        //const modal = new Modal(this.element.closest('#modal-register'));
        console.log(App.modals.register);
        App.modals.register.close();
        this.element.reset()
      }
    });
  }
}