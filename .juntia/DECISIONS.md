# Decisions

Append-only. A decision an AI runtime or a teammate would otherwise have to guess at, re-derive, or accidentally re-litigate — not a log of every choice made while coding. Each entry: what was decided, and the short reason why (a constraint, a tradeoff, something that didn't work). Do not edit past entries except to correct a factual error, noted inline.

Mark a decision `UNKNOWN` / leave it out entirely if it hasn't actually been made yet — an invented-sounding decision is worse than an absent one, because it will get treated as settled.

## Active decisions

- Vitest: agregar como devDependency. Se integra directo con vite.config.ts existente, cero config adicional, soporta TS nativamente. Estandar de facto para proyectos Vite. — architecture decision (Stack actual: Vite 8 + React 19 + TypeScript, sin dependencias de testing. Vitest se integra directamente con la configuración de Vite existente (mínima config nueva) pero es una dependencia nueva. Alternativa: usar el runner nativo `node:test` para evitar cualquier dependencia nueva, a costa de perder la integración directa con la config de Vite/TS del proyecto.): El proyecto no tiene ningún framework de testing instalado todavía. La Fase 1 del motor de juego (GameState/Decision/applyDecision) requiere tests obligatorios. ¿Qué solución de testing debería agregarse? (2026-08-18)

## Discarded and why

- <approach considered but not taken> — <one-line reason, so it doesn't get re-proposed>
