import { renderToString } from "react-dom/server";
import { memoryLocation } from "wouter/memory-location";
import App from "./App";

export function render(url: string) {
  return renderToString(
    <App ssrPath={url} />
  );
}
