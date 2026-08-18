import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guards the core/ui boundary: everything under src/core (domain, application,
// content, ports) must stay runnable and testable even if src/ui were deleted.

const FORBIDDEN_SPECIFIERS = ['react', 'react-dom', 'jotai', 'vite', 'vite/client', '@/ui', '@/components']
const FORBIDDEN_GLOBALS = ['window.', 'document.', 'localStorage', 'sessionStorage']
const FORBIDDEN_EXTENSIONS = ['.css', '.tsx']

function listAllFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry: string) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? listAllFiles(path) : [path]
  })
}

function listSourceFiles(dir: string): string[] {
  return listAllFiles(dir).filter((path) => path.endsWith('.ts') && !path.endsWith('.test.ts'))
}

describe('core independence', () => {
  const coreDir = join(import.meta.dirname, '..')
  const files = listSourceFiles(coreDir)

  it('found core source files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s does not import React, Jotai, Vite or UI code', (file) => {
    const content = readFileSync(file, 'utf-8')
    const importSpecifiers = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1])

    for (const specifier of FORBIDDEN_SPECIFIERS) {
      expect(importSpecifiers).not.toContain(specifier)
    }
    for (const specifier of importSpecifiers) {
      for (const ext of FORBIDDEN_EXTENSIONS) {
        expect(specifier.endsWith(ext)).toBe(false)
      }
    }
  })

  it.each(files)('%s does not reference browser globals', (file) => {
    const content = readFileSync(file, 'utf-8')

    for (const global of FORBIDDEN_GLOBALS) {
      expect(content).not.toContain(global)
    }
  })

  it('src/core contains no .tsx or .css files', () => {
    const uiFiles = listAllFiles(coreDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.css'))
    expect(uiFiles).toEqual([])
  })
})
