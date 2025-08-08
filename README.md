# 🚀  VetEmergency - Frontend

¡Bienvenido al frontend de **Vet Care**\! Esta es la interfaz de usuario de nuestra plataforma de telemedicina veterinaria, diseñada para conectar a veterinarios con pacientes que necesitan atención remota urgente.

-----

## 🎯 Visión del Producto

**Vet Care** es una plataforma pensada para que los veterinarios puedan gestionar consultas remotas urgentes. A través de este sistema, los profesionales pueden:

  * **Gestionar su perfil profesional.**
  * **Recibir notificaciones en tiempo real** de nuevas emergencias.
  * **Comunicarse vía mensajería** con los dueños de mascotas.
  * **Atender y seguir el estado** de los casos antes de que expiren.

-----

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con:

  * **React:** Biblioteca principal para la interfaz de usuario.
  * **Tailwindcss:** Biblioteca de estilos 
  * **Lucide-react** Biblioteca de iconos
  * **Shadcn:** Biblioteca de componentes
  * **Axios:** Biblioteca para comunicacion http

-----

## ⚙️ Configuración del Entorno de Desarrollo

Sigue estos pasos para tener el proyecto funcionando en tu máquina local.

### 1\. Clonar el Repositorio

Abre tu terminal y clona el proyecto usando Git:

```bash
git clone https://github.com/tu-usuario/vet-frontend.git
cd vet-frontend
```

### 2\. Instalar Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias necesarias. Asegúrate de tener **Node.js** y **npm** (o **yarn**) instalados.

```bash
npm install
# o si usas yarn
# yarn install
```

### 3\. Configurar las Variables de Entorno

Este proyecto necesita conectarse al backend de Vet Care. Crea un archivo `.env` en la raíz del proyecto y añade la URL base de la API:

```bash
VITE_API_URL=http://localhost:8000/api
```

> ⚠️ **Nota:** Si el backend está en un dominio diferente, asegúrate de reemplazar `http://localhost:8000` con la URL correcta.

### 4\. Iniciar el Servidor de Desarrollo

Una vez que todo está configurado, puedes iniciar el servidor local para ver la aplicación en acción:

```bash
npm run dev
# o si usas yarn
# yarn dev
```

La aplicación se abrirá en tu navegador en la dirección `http://localhost:5173` (o un puerto similar).

-----
