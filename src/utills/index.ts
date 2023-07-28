export const getErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'Неверные данные запроса';
    case 401:
      return 'Неправильная почта или пароль';
    case 403:
      return 'Необходима авторизация';
    case 404:
      return 'Запрашиваемый ресурс не найден';
    case 500:
      return 'Произошла ошибка на сервере';
    default:
      return 'Произошла ошибка';
  }
};