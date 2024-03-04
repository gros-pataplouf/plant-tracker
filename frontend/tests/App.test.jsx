import { test, expect, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import {createMemoryHistory} from 'history'
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "../src/App"
import PlantList from "../src/components/scenes/PlantList/PlantList";
import PlantDetail from "../src/components/scenes/PlantDetail/PlantDetail"
import plants from './data/plants.json'

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

    test('Clicking plants leads to /plants', async () => {
      const wrapper = render(
        <BrowserRouter>
        <App />
        </BrowserRouter>
      )
      const plantLink = wrapper.getByTestId('plantLink');
      await user.click(plantLink);
      await waitFor(() => expect(window.location.pathname).to.contain('plants'))
    })

    test('Clicking explore leads to /explore', async () => {
      const wrapper = render(
        <BrowserRouter>
        <App />
        </BrowserRouter>
      )
      const exploreLink = wrapper.getByTestId('exploreLink');
      await user.click(exploreLink);
      await waitFor(() => expect(window.location.pathname).to.contain('explore'))
    })
    test('Clicking participate leads triggers a window alert for an unlogged user', async () => {
      const alertMock = vi.spyOn(window,'alert').mockImplementation(); 
      const wrapper = render(
        <BrowserRouter>
        <App />
        </BrowserRouter>
      )
      const trackLink = wrapper.getByTestId('trackLink');
      await user.click(trackLink);
      await waitFor(() => expect(window.location.pathname).to.contain('track'))
      await waitFor(() => expect(alertMock).toHaveBeenCalledTimes(1))
      
    })
  })

  describe('An unauthenticated User', () => {
    test('Can see the plant catalogue', async () => {
      const wrapper = render(
        <BrowserRouter>
        <PlantList/>
        </BrowserRouter>
      )
      expect(wrapper).toBeTruthy()
      await waitFor(() => {
        expect(wrapper.getByTestId('plantCatalogTitle')).toBeTruthy()
        expect(wrapper.getAllByTestId('plantCommonName')).toHaveLength(plants.length)
      })
    })

    test('Can see details about a specific plant', async () => {
      const history = createMemoryHistory()
      history.push('/plants/1')

      const wrapper = render(
        <BrowserRouter history={history}>
        <PlantDetail/>
        </BrowserRouter>
      )

      expect(wrapper).toBeTruthy()
      await waitFor(() => {
        expect(wrapper.getByText('Reynoutria japonica')).toBeInTheDocument()
        screen.debug()
      })
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
