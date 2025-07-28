# Ecommerce Vue

A modern ecommerce application built with Vue 3, TypeScript, and Vite. This project provides a solid foundation for building scalable ecommerce solutions with modern web technologies.

## 🛍️ Features

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vue Router** for SPA navigation
- **Pinia** for state management
- **Vite** for fast development and building
- **Vitest** for unit testing
- **JSX Support** for flexible component authoring
- Hot module replacement for instant development feedback

## 📋 Requirements

- **Node.js** v20.18.0 or higher
- **npm** v10+ or **yarn**

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run Unit Tests

```bash
npm run test:unit
```

### Type Checking

```bash
npm run type-check
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
├── router/             # Vue Router configuration
├── stores/             # Pinia state management
├── assets/             # Static assets
└── main.ts             # Application entry point
```

## 🛠️ Development Tools

- **Vue DevTools**: Available in browser for debugging Vue components
- **TypeScript**: Full type checking and IntelliSense support
- **Hot Module Replacement**: Instant feedback during development
