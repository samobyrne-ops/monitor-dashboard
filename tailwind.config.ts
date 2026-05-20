import kalepConfig from "@bolteu/kalep-tailwind/tailwind.config";

export default {
  ...kalepConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@bolteu/kalep-react/build/**/*.js",
  ],
};
