import Login from "./components/Login";
import Main from "./components/Main";

const routers = [
  {
    url: "/",
    component: <Main />,
  },
  {
    url: "/login",
    component: <Login />,
  },
];

export const getPage = (url) =>
  routers.find((route) => route.url === url)?.component || <h4>Not Found</h4>;
