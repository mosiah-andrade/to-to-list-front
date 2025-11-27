# 📝 Guia de Desenvolvimento: To-Do List (React Native + Node) no Codespaces

Este guia contém os marcos (milestones) passo a passo para criar um aplicativo To-Do List Fullstack usando GitHub Codespaces.

---

## 🚀 Fase 1: Configuração do Ambiente (Codespaces)

O objetivo é preparar a estrutura de pastas para separar o backend (API) do frontend (Mobile).

- [ ] **Criar a estrutura de diretórios**
  - No terminal do Codespaces, execute:
    ```bash
    mkdir todo-app-fullstack
    cd todo-app-fullstack
    mkdir server
    mkdir client
    ```

- [ ] **Validar Node.js**
  - Certifique-se de que o Node está instalado: `node -v`

---

## 🛠️ Fase 2: Construção do Backend (Node.js/Express)

Vamos criar uma API simples para gerenciar as tarefas.

- [ ] **Inicializar o projeto Server**
  ```bash
  cd server
  npm init -y