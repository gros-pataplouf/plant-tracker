import { test, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../src/App"

const user = userEvent.setup();


test('App mounts properly', () => {
    const wrapper = render(
      <BrowserRouter>
      <App />
      </BrowserRouter>
    )
    expect(wrapper).toBeTruthy()
  })

  describe('Navigation', () => {
    test('Clicking login leads to /login', async () => {
      const wrapper = render(
        <BrowserRouter>
        <App />
        </BrowserRouter>
      )
      const loginLink = wrapper.getByTestId('loginLink');
      await user.click(loginLink);
      await waitFor(() => expect(window.location.pathname).to.contain('login'))
    })
    test.skip('Clicking plants leads to /plants', () => {

    })
    test.skip('Clicking explore leads to /explore', () => {

    })
    test.skip('Clicking participate leads to /participate', () => {

    })
  })

  describe('An unauthenticated User', () => {
    test.skip('Can see the plant catalogue', () => {

    })
    test.skip('Can see a map with locations', () => {

    })
    test.skip('Can go to the account creation page', () => {

    })
    test.skip('are redirected to the login page when they click on participate', () => {

    })
  })

  describe('Account Creation', () => {

  })

  describe('Login', () => {

  })

  describe('Submitting a location', () => {

  })
  describe('Account Management', () => {

  })







//https://planttracker.vercel.app/login/
//https://planttracker.vercel.app/plants/
// https://planttracker.vercel.app/explore/
// https://planttracker.vercel.app/participate 
// account
