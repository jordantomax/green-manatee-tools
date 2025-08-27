// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import { MATCH_TYPES, NEGATIVE_TARGET_EXPRESSION_TYPES } from '@/utils/constants'

faker.amazon = {
  id: () => faker.string.alphanumeric(10),
  asin: () => `B0${faker.string.alphanumeric(8).toUpperCase()}`,
  matchType: () => faker.helpers.arrayElement(Object.values(MATCH_TYPES)),
  negativeTargetExpressionType: () => faker.helpers.arrayElement(Object.values(NEGATIVE_TARGET_EXPRESSION_TYPES))
}

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;