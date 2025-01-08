// global.d.ts

declare global {
  interface Window {
    singleSpa: any; // Declare `singleSpa` as part of the window object with `any` type
    $: any;
    jQuery: any;
  }
}

export {};
