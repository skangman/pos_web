import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Package';
import Product from './pages/Product';
import User from './pages/User';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from './pages/Login';
import Dashbord from './pages/Dashbord';
import Home from './pages/Home';
import Sale from './pages/Sale';
import BillSales from './pages/BillSales';
import SumSalePerDay from './pages/SumSalePerDay';
import Stock from './pages/Stock';
import ReportStock from './pages/ReportStock';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Package />
  },
  {
    path: "/Login",
    element: <Login />
  },
  {
    path: "/Dashbord",
    element: <Dashbord />
  },
  {
    path: "/Home",
    element: <Home />
  },
  {
    path: "/Product",
    element: <Product />
  },
  {
    path: "/User",
    element: <User />
  },
  {
    path: "/Sale",
    element: <Sale />
  },
  {
    path: "/billSales",
    element: <BillSales />
  },
  {
    path: "/sumSalePerDay",
    element: <SumSalePerDay />
  },
  {
    path: "/stock",
    element: <Stock />
  },
  {
    path: "/reportStock",
    element: <ReportStock />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Package />
  <RouterProvider router={router} />
);



reportWebVitals();
