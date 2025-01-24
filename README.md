# trivia Game

## **Descripción**  
El **Trivia Game** es un juego de preguntas y respuestas en el que los jugadores compiten para responder correctamente a diversas preguntas en el menor tiempo posible. Está compuesto por un sistema de administración que permite gestionar las preguntas del trivia, agregar nuevas preguntas, editar o eliminar las existentes, y un ranking que muestra a los 10 mejores jugadores con los puntajes más altos. El sistema está desarrollado con Laravel para el backend y React para el frontend.

---

## ****Características Principales:****

### ***Administración de preguntas:***
- Los administradores pueden agregar, editar o eliminar preguntas del trivia.

### ***Ranking:***
- Visualiza el ranking de los mejores 10 jugadores con sus puntajes más altos.

### ***Jugar trivia:***
-Los jugadores pueden iniciar una partida de trivia con preguntas aleatorias


---
## **Requisitos Previos**  
- [php](https://www.php.net/downloads).
- [Node.js y npm](https://nodejs.org/en/download/).
- [GIT](https://git-scm.com/). 


---
## **Preparar laravel:**
- Abre una terminal.
- Navega al back desde el directorio raiz del proyecto:
```
cd back
```

Para instalar las dependencias:
```
composer install
```

para crear el archivo .env
```
cp .env.example .env
```
si el env. no tiene app_key
```
php artisan key:generate
```

Configura tu base de datos en el archivo .env.


Para iniciar el servidor:
```
php artisan serve
```



--- 
## **Preparar React:**
- Abre una terminal.
- Navega al front desde el directorio raiz del proyecto:
```
cd front
```
Para instalar las dependencias:
```
npm install
```
Para iniciar el servidor:
```
npm start
```

