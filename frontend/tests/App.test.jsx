import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../src/App"


test('App mounts properly', () => {
    const wrapper = render(
      <BrowserRouter>
      <App />
      </BrowserRouter>
    )
    expect(wrapper).toBeTruthy()
  })
