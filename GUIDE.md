# 🐾 VetEmergency - Frontend Guide

Bienvenido al **frontend de VetEmergency**, la plataforma de telemedicina veterinaria que conecta a **veterinarios** con **clientes/pacientes** que necesitan atención remota urgente.  

Este documento sirve como **guía rápida** para comprender la estructura, flujo y funcionalidades principales de la aplicación.

---

## 🚀 Inicio de la aplicación
Al ingresar a la aplicación web, los usuarios pueden **registrarse** o **iniciar sesión** según su rol (cliente o veterinario).

<img width="1274" height="936" alt="image" src="https://github.com/user-attachments/assets/7b9e392a-2a67-4597-9918-e2a85735decb" />

---

## 🔑 Autenticación
- **Login** → Acceso a la plataforma si ya se tiene una cuenta.  
  <img width="597" height="761" alt="image" src="https://github.com/user-attachments/assets/15f79362-fc4c-47a8-8826-dafe51ca97a9" />

- **Registro** → Creación de cuenta seleccionando un rol (cliente o veterinario).  
  <img width="597" height="761" alt="image" src="https://github.com/user-attachments/assets/eb29ad1f-b1d7-4475-b55e-a7e9b35272b6" />

✅ El token de autenticación y los datos del usuario se guardan en **LocalStorage** con una expiración definida.

---

## 📊 Dashboard del Veterinario
- Panel de **notificaciones en tiempo real**.  
- Listado de **emergencias aceptadas**.  

<img width="1323" height="532" alt="image" src="https://github.com/user-attachments/assets/8b78bcb4-a94e-473c-b06b-1b9c89bb5514" />

---

## 👤 Dashboard del Cliente
- Vista de **emergencias creadas**.  
- Sección de **emergencia activa en curso**.  
  <img width="1323" height="843" alt="image" src="https://github.com/user-attachments/assets/f4c181a4-db6d-4cbd-a269-a4497c541d0a" />

- Apartado para **crear nuevas emergencias**.  
  <img width="938" height="620" alt="image" src="https://github.com/user-attachments/assets/2e9cdbcc-147a-443b-857d-55c778abffa8" />

---

## ⚡ Funcionalidad en tiempo real
- Al crear una emergencia, **todos los veterinarios recibirán una notificación**.  
  <img width="1330" height="668" alt="image" src="https://github.com/user-attachments/assets/3e1139c3-c229-414a-98e1-776b8446a8db" />

- Cuando un veterinario **acepta la emergencia**, el **cliente es notificado** inmediatamente.  
  <img width="1330" height="764" alt="image" src="https://github.com/user-attachments/assets/54f173a3-a758-499e-b036-f75bff42c9bc" />

---

## 💬 Mensajería
La plataforma cuenta con un sistema de **mensajes en tiempo real** para que el veterinario y el cliente se comuniquen durante la emergencia.  

<img width="1345" height="631" alt="image" src="https://github.com/user-attachments/assets/e04119de-733a-49f6-a673-83b101641e4c" />

---
## 👤 Perfil
En la sección de **perfil** el usuario podrá:  
- Editar su información personal.  
- Eliminar su cuenta.  
- Cerrar sesión de manera segura.  

<img width="909" height="838" alt="image" src="https://github.com/user-attachments/assets/d88d0027-9ed7-489e-a1ec-a898acb2ba92" />

---
