import Home from '../pages/Home';
import Test from '../pages/Test';

// 회원가입
import Signup from '../pages/Signup/Signup';
import SignupIndex from '../pages/Signup/SignupIndex';
import SignupTypeSelection from '../pages/Signup/SignupTypeSelection';
import SignupFormCustomer from '../pages/Signup/SignupFormCustomer';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Signup />,
    children: [
      {
        index: true,
        element: <SignupIndex />,
      },
      {
        path: 'type',
        element: <SignupTypeSelection />,
      },
      {
        path: 'form-customer',
        element: <SignupFormCustomer />,
      },
    ],
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '*',
    element: <div>Not Found</div>,
  },
];
