import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../helper/api';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';



export default function Table() {
  const columns = ['id', 'name', 'date', 'amount'];

  const [dataCustomers, setDataCustomers] = useState([]);
  const [dataTransactions, setDataTransactions] = useState([]);
  const [transPerCustomer, setTransPerCustomer] = useState([]);


  async function getCustomers() {
    let { data } = await axios.get(`${baseUrl}/customers`);
    // console.log(data)
    setDataCustomers(data);
  }

  async function getTransactions() {
    let { data } = await axios.get(`${baseUrl}/transactions`);
    // console.log(data)
    setDataTransactions(data);
  }

  useEffect(() => {
    getCustomers();
    getTransactions();
  }, []);




  //manipulation on data that come from api, I make new array
  useEffect(() => {
    let transPerCustomer = [];
    for (let i = 0; i < dataCustomers.length; i++) {
      transPerCustomer.push({
        id: dataCustomers[i].id,
        name: dataCustomers[i].name,
        transactions: dataTransactions.filter(transaction => transaction.customer_id === parseInt(dataCustomers[i].id)),
      })
    }
    setTransPerCustomer(transPerCustomer)
  }, [dataCustomers, dataTransactions])



  // filered search by name
  const [filtredCustomers, setFiltredCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (searchValue) {
      const filtered = transPerCustomer.filter((customer) => customer.name.toLowerCase().includes(searchValue.toLowerCase()))
      setFiltredCustomers(filtered)
    }
    else {
      setFiltredCustomers(transPerCustomer)
    }
  }, [searchValue, transPerCustomer])




  //display graph for the selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  function getSelectedCustomer(id) {
    const selectedCustomer = filtredCustomers.filter((customer) => customer.id === id);
    setSelectedCustomer(selectedCustomer)
  }




  return (
    <>
      <div className="container py-5">

        <div className="row">
          <div className="col-6 pe-5 ps-0">
            <input className='form-control mb-3' type="text" placeholder='Search...' onChange={(e) => setSearchValue(e.target.value)} />


            <table className='transactions-table text-center'>
              <thead>
                <tr>
                  {columns.map((column) => <th className='border p-2' key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody>

                {filtredCustomers.map((customer) => customer.transactions.map((transaction, index, transactions) =>
                  <tr key={`${customer.id}-${transaction.id}`}>
                    {index === 0 ? <td rowSpan={transactions.length} className='border p-2'>{customer.id}</td> : null}
                    {index === 0 ? <td rowSpan={transactions.length} className='border p-2 cursor-pointer text-primary' onClick={() => getSelectedCustomer(customer.id)} >{customer.name}</td> : null}
                    <td className='border p-2'>{transaction.date}</td>
                    <td className='border p-2'>{transaction.amount}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>


          <div className="col-6 d-flex align-items-center">
            {selectedCustomer ? <BarChart width={800} height={300} data={selectedCustomer[0].transactions}>
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" barSize={30} />
            </BarChart> : ''}
          </div>
        </div>


      </div>
    </>
  );
}
