import React from 'react'
import { mount } from '@cypress/react'
import {testStore} from "../../src/store/store";
import {Provider} from "react-redux";
import Sections from "../../src/components/Sections";


describe('NewsList component', () => {

    let store;

    beforeEach(()=>{
        store = testStore
    })

    it('works', () => {
        mount(<Provider store={store}>
                <Sections />
              </Provider>)
        // now use standard Cypress commands
        // cy.contains('Hello World!').should('be.visible')
        cy.get("[data-cy = sections-div]").should("be.visible")
    })
})
