# react-app
Это приложение было создано в рамках дисциплины "Web программирование".

Для развертывания необходимо выполнить последовательно следующие команды в терминале:
* docker-compose up -d --build
* docker-compose exec backend alembic revision -m "test"
* docker-compose exec backend alembic upgrade head

Данное приложение хранит и отображает информацию об авторах и книгах. Данные об объектах можно удалять и редактировать, а также можно добавлять новые объекты.

Данные об объектах хранятся в базе данных postgreSQL.
Backend прилолжения написан на Python. 
Frontend написан на React.
