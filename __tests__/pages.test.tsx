import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/pages/index';
import LoginPage from '@/pages/login';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
    };
  },
}));

describe('Page Render Tests', () => {
  test('HomePage renders major hero section text', () => {
    render(<HomePage />);
    expect(screen.getByText(/Decoupled, Headless/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Digital Delivery/i)).toBeInTheDocument();
  });

  test('LoginPage renders SSO redirection card', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Client Portal Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Log In with SSO/i)).toBeInTheDocument();
  });
});