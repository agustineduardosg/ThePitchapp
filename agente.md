# Agente: ThePitchapp - Source of Truth

Este documento actúa como la fuente única de verdad para el proyecto "ThePitchapp", detallando su propósito, arquitectura y estado actual.

## 1. Identidad y Propósito
**Nombre del Proyecto:** THE PITCH
**Visión:** Una plataforma integral ("Zero-Friction") para la gestión de comunidades deportivas, enfocada inicialmente en Fútbol y Padel. Permite la reserva de canchas, creación de equipos, gestión de ligas profesionales y búsqueda de "Agentes Libres" (jugadores).
**Público Objetivo:** Jugadores aficionados y profesionales, dueños de complejos deportivos y organizadores de ligas.

## 2. Pila Tecnológica (Stack) Actual
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 (con diseño premium tipo Material 3)
- **Animaciones:** Motion (framer-motion)
- **Iconografía:** Lucide React (vía componente centralizado `Icons.tsx`)
- **Notificaciones:** Sonner
- **IA:** Google GenAI (@google/genai) integrado (pendiente de uso extensivo)
- **Mapas:** Google Maps API (`@react-google-maps/api`)

## 3. Arquitectura del Proyecto
- `src/App.tsx`: Componente monolítico central que maneja la navegación, el estado global y la renderización de todas las pantallas (Home, Courts, Teams, Leagues, Profile, etc.).
- `src/components/Icons.tsx`: Repositorio centralizado de iconos de Lucide.
- `src/index.css`: Definición de tokens de diseño y estilos globales de Tailwind 4.
- `index.html`: Punto de entrada con fuentes premium y configuración de viewport.

## 4. Estado Actual y Roadmap
- [x] **Clonación y Sincronización:** Repositorio actualizado con el boilerplate funcional de la App Deportiva.
- [x] **Análisis de Código:** Identificado componente `App.tsx` como núcleo (requiere refactorización).
- [ ] **Refactorización de Componentes:** Dividir `App.tsx` en componentes más pequeños por pantalla y feature.
- [ ] **Persistencia de Datos:** Implementar backend (actualmente los datos son harcodeados en el estado).
- [ ] **Integración de IA:** Implementar asistente de IA para recomendaciones de canchas o emparejamiento de equipos.
- [ ] **Gestión de Pagos:** Integrar pasarela de pagos para reservas de canchas.

## 5. Instrucciones para el Agente (Antigravity)
- **Estética:** Mantener el diseño premium, oscuro y vibrante (Glassmorphism, gradientes "pitch-gradient").
- **Mantenimiento:** Sincronizar siempre cambios en `agente.md`.
- **Refactorización:** Sugerir modularización constante para evitar que `App.tsx` siga creciendo exponencialmente.
- **Micro-animaciones:** Asegurar que cada interacción se sienta fluida y "Premium".

