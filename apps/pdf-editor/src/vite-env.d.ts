/// <reference types="vite/client" />

declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  type Root = {
    render(children: ReactNode): void;
    unmount(): void;
  };

  export function createRoot(
    container: Element | DocumentFragment,
    options?: unknown,
  ): Root;

  export function hydrateRoot(
    container: Element | Document,
    initialChildren: ReactNode,
    options?: unknown,
  ): Root;
}
