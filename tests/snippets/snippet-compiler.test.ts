import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import {
  ALL_COMPONENTS,
  SUPPORTED_ECOSYSTEMS,
  type EcosystemFlavor,
} from '@exhuma/registry';

const FLAVORS = SUPPORTED_ECOSYSTEMS;

describe('Exhuma Universal Component Registry — Zero Broken Snippets Gate', () => {
  it('registers all canonical components', () => {
    expect(ALL_COMPONENTS.length).toBeGreaterThanOrEqual(5);
  });

  for (const component of ALL_COMPONENTS) {
    describe(`Component: ${component.name} (${component.slug})`, () => {
      for (const flavor of FLAVORS) {
        it(`generates valid, non-empty files for flavor: ${flavor}`, () => {
          const files = component.generateCode(flavor, component.defaultProps);
          expect(files.length).toBeGreaterThan(0);

          for (const file of files) {
            expect(file.code.trim().length).toBeGreaterThan(20);

            // TypeScript / TSX syntax verification (covers React, Next.js, Angular, Solid, React Native)
            if (file.language === 'tsx' || file.language === 'typescript') {
              const sourceFile = ts.createSourceFile(
                file.filename,
                file.code,
                ts.ScriptTarget.Latest,
                true,
                file.language === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
              );
              // Check for syntactic parse diagnostics
              const diagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
              expect(diagnostics.length, `Syntax error in ${component.slug} [${flavor}]: ${diagnostics[0]?.messageText}`).toBe(0);
            }

            // JSON syntax verification (e.g. block.json)
            if (file.language === 'json') {
              expect(() => JSON.parse(file.code)).not.toThrow();
            }

            // Dart syntax checks (Flutter)
            if (file.language === 'dart') {
              expect(file.code).toContain('package:flutter/material.dart');
              expect(file.code).toContain('class');
            }

            // Svelte syntax checks
            if (file.language === 'svelte') {
              expect(file.code).toContain('<script');
            }
          }
        });
      }
    });
  }
});
