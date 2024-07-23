import './App.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Table from './components/Table/Table.jsx';

function App() {



  let routers = createHashRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <Table /> },
      ]
    }
  ]);













  return (
    <RouterProvider router={routers} />
  );
}

export default App;
