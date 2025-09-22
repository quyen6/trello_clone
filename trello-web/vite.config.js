import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
  // define: {
  //   "process.env": process.env
  // },
  server: {
    host: true, // 👈 cần dòng này
    port: 5173,
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
