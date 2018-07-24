// @flow
import * as attributes from '../../src/view/data-attributes';

const urlSingleList: string =
  'http://localhost:9002/iframe.html?selectedKind=single%20vertical%20list&selectedStory=basic';

// type Selector = string;

// const returnPositionAndText = async (page: Object, selector: Selector) =>
//   page.$eval(selector, (el: ?HTMLElement) => {
//     if (!el) {
//       throw new Error(`Unable to find element for selector "${selector}"`);
//     }

//     if (!(el instanceof HTMLElement)) {
//       throw new Error('Element returned not of type HTMLElement');
//     }

//     return {
//       height: el.offsetHeight,
//       left: el.offsetLeft,
//       top: el.offsetTop,
//       text: el.innerText,
//     };
//   });

/* Css selectors used */
const singleListContainer: string = `[${attributes.droppable}]`;
// const firstCard: string = `[${attributes.dragHandle}]:nth-child(1)`;
const secondCard: string = `[${attributes.dragHandle}]:nth-child(2)`;
const fourthCard: string = `[${attributes.dragHandle}]:nth-child(4)`;

const viewport = ['macbook-15', 'iphone-6'];

describe('Simple vertical list', () => {
  const moveCard = (cssSelector, x, y) => {
    cy.get(cssSelector)
      .trigger('mousedown', { which: 1 })
      .wait(1000)
      .trigger('mousemove', { clientX: x, clientY: y }, { force: true })
      .trigger('mouseup', { force: true });
  };
  const moveCardNew = (cssSelector, y1, y2) => {
    cy.get(cssSelector).trigger('mousedown', {
      which: 1,
      pageX: 187,
      pageY: y1,
    });
    cy.wait(1000);
    cy.get(cssSelector).trigger('mousemove', {
      which: 1,
      pageX: 187,
      pageY: y2,
    });
    cy.get(cssSelector).trigger('mouseup');
  };
  const dragAndDrop = (cssSelector1, cssSelector2) => {
    cy.get(cssSelector1).trigger('dragenter');
    cy.get(cssSelector1).trigger('dragstart');
    cy.get(cssSelector2).trigger('dragleave');
    cy.get(cssSelector2).trigger('drop');
  };
  before(() => {
    cy.visit(urlSingleList);
    cy.title().should('equal', 'Storybook');
    cy.get(singleListContainer).should('be.visible');
  });

  describe('Should be able to drag a card down from', () => {
    viewport.forEach(view => {
      before(() => {
        cy.viewport(view);
      });
      beforeEach(() => {
        cy.reload();
      });
      it(`The second position to the fourth position ${view} using click`, () => {
        moveCard(secondCard, 187, 355);
        // dragAndDrop(secondCard, fourthCard);
        // moveCard(fourCard, 180, 500);
      });
      it(`The second position to the fourth position ${view} using keyboard`, () => {
        // cy.get(secondCard)
        //   .first()
        //   .focus()
        //   .type('{space}');
        // // .type('{space}')
        // // .type('{arrowDown}')
        // // .type('{space}');
      });
      it(`The second position to the fourth position ${view} using touchEvents`, () => {
        moveCard1(secondCard, 187, 355);
        // dragAndDrop(secondCard, fourthCard);
        // moveCard(fourCard, 180, 500);
      });
    });
  });
});
