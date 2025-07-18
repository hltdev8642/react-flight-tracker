/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly PACKAGE_VERSION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
