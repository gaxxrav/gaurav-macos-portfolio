/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONKEYTYPE_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
