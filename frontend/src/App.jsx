import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Contact } from "./pages/Contact";
import { Person } from "./pages/Person";
import { Group } from "./pages/Group";
import { CreateGroup } from "./pages/CreateGroup";

const App=()=>{

  const {checkAuth,isChecking,authUser}=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isChecking && !authUser){
    return <h1>Loading!!</h1>
  }

  const router=createBrowserRouter([
    {
      path: "/signUp",
      element: <SignUp/>
    },
    {
      path: "/signIn",
      element: <SignIn/>
    },
    {
      path: "/",
      element: <AppLayout/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/contact",
          element: <Contact/>
        },
        {
          path: "/dashboard",
          element: <Dashboard/>
        },
        {
          path: "/dashboard/createGroup",
          element: <CreateGroup/>
        },
        {
          path: "/person/:id",
          element: <Person/>
        },
        {
          path: "/group/:id",
          element: <Group/>
        }
      ]
    }
  ])

  return <RouterProvider router={router}></RouterProvider>
}

export default App;