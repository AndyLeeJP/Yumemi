import {useEffect, useState} from 'react';
import './App.css';

function App() {
  
const [data, setData] = useState([]);

  const apiGet = () => {
  fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures",{
    method: 'GET',
    headers: {
      'X-API-KEY':'ex7wsKgup5vnO3VgsT3htKKSfNRQlrNkxPCrdzhB',
      'Content-Type':'application/json;charset=UTF-8'
    }
  })
  .then((response) => response.json())
  .then((json) => {
    console.log(json)
    setData(json.result);
    
    });
};

useEffect(() => {
  apiGet()

}, []);

  return (

    <div className="App">
      
        {data.map((item: any) => (
          <div key={item.prefCode}>
          <input type="checkbox" name={item.prefName}/>
          <label>{item.prefName}</label>
          </div>
        ))}
      
    </div>
  );
}


export default App;