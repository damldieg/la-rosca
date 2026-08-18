import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// src/content holds declarative Event data consumed by the domain event engine —
// checked here too since it must stay framework-free for the same reason domain does.

const FORBIDDEN_SPECIFIERS = ['react', 'react-dom', 'jotai', 'vite', 'vite/client']
const FORBIDDEN_GLOBALS = ['window.', 'document.', 'localStorage', 'sessionStorage']

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry: string) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return listSourceFiles(path)
    return path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : []
  })
}

describe('domain independence', () => {
  const domainDir = import.meta.dirname
  const contentDir = join(import.meta.dirname, '../content')
  const files = [...listSourceFiles(domainDir), ...listSourceFiles(contentDir)]

  it('found domain and content source files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s does not import React, Jotai or Vite', (file) => {
    const content = readFileSync(file, 'utf-8')
    const importSpecifiers = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1])

    for (const specifier of FORBIDDEN_SPECIFIERS) {
      expect(importSpecifiers).not.toContain(specifier)
    }
  })

  it.each(files)('%s does not reference browser globals', (file) => {
    const content = readFileSync(file, 'utf-8')

    for (const global of FORBIDDEN_GLOBALS) {
      expect(content).not.toContain(global)
    }
  })
})
