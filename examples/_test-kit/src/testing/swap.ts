// Used by the checks of test exercises to swap in deliberately broken components (mutants).
import type { ComponentType } from 'react';

let current: Record<string, ComponentType<any>> = {};

export function setMutant(components: Record<string, ComponentType<any>> | null): void {
  current = components ?? {};
}

export function pick<T>(name: string, original: T): T {
  return (current[name] as T) ?? original;
}
