# Biofarma

Для старта разработки необходимо иметь node.js и установить модули с помощью команды:
```
    npm install
```

При необходимости запустить autoreload:
```
    npm run dev
```

Перед загрузкой кода на сайт, необходимо создать файл ftp-settings следующего вида
```
    {
        "host": "IP-адрес сервера",
        "user": "Логин",
        "pass": "Пароль",
        "parallel": 10
    }
```
Данные хранятся в личном кабинете хостинга [reg.ru](https://www.reg.ru/user/authorize)

Для билда кода и загрузки его на сайт по ftp нужно выполнить:
```
    npm run prod
```