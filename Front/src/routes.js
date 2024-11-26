import { createBrowserRouter } from "react-router-dom";
import SignIn from "./components/signin";
import Signup from "./components/signup"
import Category from "./components/categories";
import DrawerAppBar from './components/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/dashboard',
    element: <DrawerAppBar />,
    children: [
      {
        path: '/dashboard',
        element: <Category />
      }
      
    ]
  }
])