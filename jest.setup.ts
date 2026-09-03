import '@testing-library/jest-dom';

// Global fetch polyfill for jsdom environment
if (!global.fetch) {
  global.fetch = jest.fn();
}
