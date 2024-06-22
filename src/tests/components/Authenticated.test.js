import Authenticated from '../../components/Authenticated/Authenticated';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

jest.mock('../../hooks/useApp');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../api/api', () => ({
  setUserOnlineStatus: jest.fn(),
  createUser: jest.fn(),
}));

describe('Authenticated', () => {
  
  test('redirects to login if user is not authenticated', async () => {
    const mockNavigate = jest.fn();
    const TestChildComponent = () => <div>Test Child</div>;
    
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: '/default-path' });
    useApp.mockReturnValue({ currentUser: null });

    render(
      <Router>
        <Authenticated>
          <TestChildComponent />
        </Authenticated>
      </Router>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login", expect.anything()));
  });
});