// global.d.ts
export {};

declare global {
  interface Window {
    paypal: any; // Use 'any' to make it flexible. You can type this more strictly if needed.
  }
}
