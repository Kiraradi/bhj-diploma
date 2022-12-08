/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let url = options.url;
    const data = options.data;
    const method = options.method;
    const callback = options.callback;

    if (!url || !method) {
        throw new Error('Отсутствует URL или Method');
    }
    
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json';
    let formData = null;
    if (method === 'GET') {
        if (data) {
            const arrString = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
            if (arrString) {
                url = url + '?' + arrString;
            }
        }
    } else {
        if (!data) {
            //throw new Error('Отсутствует data');
            formData = null;
        }
        formData = new FormData;
        for (let key in data) {
            formData.append(key,data[key]);
        }
    }
    try {
        xhr.open(method, url);
        xhr.send(formData);
    }
    catch(e) {
        console.log('в блоке catch');
        callback(e);
    } 

    xhr.onload = function() {
        if (xhr.status !== 200) {
            const err = xhr.response.error;
            callback(err)
        } else {
            err = null;
        }
          
        callback(xhr.response.error, xhr.response);
    };
    xhr.onerror = function() {
        console.log('onerror');
        const err = `Ошибка ${xhr.status}: ${xhr.statusText}`;
        console.log(err);
        console.log(this);
    }
};

