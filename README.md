Antes de clonar el proyecto, asegurarse de tener:

Backend (Spring Boot)

Java JDK 17+
Verifica con:

java -version

Maven 3.8+
Verifica con:

mvn -v

Frontend (React)

Node.js 18+
Verifica con:

node -v
npm -v

Librerías de React: se instalarán automáticamente con npm install.

- Clonar el proyecto
git clone https://github.com/CarlosCabrera10/EnviosBackend.git
cd GestorEnvios


- Configuración del backend
Revisar dependencias

El pom.xml incluye:

spring-boot-starter-web

spring-boot-starter-data-jpa

spring-boot-starter-security

lombok (opcional, para autogenerar getters/setters)

Si faltara alguna librería, Maven la descargará automáticamente al compilar.

- Configuración de seguridad

Se agregó SecurityConfig.java:

/auth/** → libre (login y registro)

/admin/** → solo rol ADMIN

/envios/** → solo rol CLIENTE

CORS habilitado para http://localhost:3000

Para desarrollo, se desactivó CSRF para que React pueda hacer POST/PUT sin token. Ya no se implemento por tiempo
y solo tiene una autenticacion basica de Spring con cookies.

- Configuración de base de datos
MySQL configurar el application.properties según corresponda.

Archivo src/main/resources/application.properties:

server.port=8080

spring.application.name=GestorEnvios
spring.datasource.url=jdbc:mysql://localhost:3306/envios
spring.datasource.username=root (segun propia PC)
spring.datasource.password= (segun propia PC)

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MariaDBDialect


Esto permite que la base de datos se cree automáticamente al iniciar y se pueda revisar en:
http://localhost:8080/



- Inicialización de datos

Archivo opcional: src/main/resources/data.sql:

INSERT INTO configuracion (id, capacidad_diaria) VALUES (1, 11);

Esto crea el registro de configuración inicial con capacidad diaria = 11. (Hay un error si esta tabla no tiene un dato inicial,
no es posible actualizar el numero desde Admin sino existe un primer dato)

4️⃣ Backend – Funcionalidades implementadas

Login / registro → /auth/login y /auth/register

Solicitar envío → /envios/solicitar

Valida capacidad diaria y asigna la primera fecha disponible

Genera código único: ENV-xxxxxxxx

Consultar envío → /envios/{codigo}

Cancelar envío → /envios/cancelar/{codigo} (solo AGENDADO)

Admin → /admin/config (GET/PUT)

Capacidad actual → /admin/capacidad-actual

Los controladores usan EnvioService y ConfiguracionRepository para manejar la lógica.

- Ejecutar backend
mvn clean install
mvn spring-boot:run

Backend corriendo en http://localhost:8080

Configuración del frontend (React)

- Para instalar dependencias
cd enviosFrontend
npm install

- Ejecutar React
npm start

Se abrirá en http://localhost:3000

Verifica que el backend esté corriendo antes.

- Frontend – Funcionalidades implementadas

Login / Logout → almacena usuario en localStorage

Solicitar envío → pages/SolicitarEnvio.js

Botón bloqueado si capacidad diaria llena

Muestra código y fecha

Tracking → pages/Tracking.js

Consultar estado por código

Cancelar si estado = AGENDADO

Admin → pages/Admin.js

Consultar / modificar capacidad diaria

Cambiar estado de envíos
