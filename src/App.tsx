import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [val, setVal] = useState(["選択値"]);

  const apiGet = () => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      method: "GET",
      headers: {
        "X-API-KEY": "ex7wsKgup5vnO3VgsT3htKKSfNRQlrNkxPCrdzhB",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json.result);
      });
  };

  useEffect(() => {
    apiGet();
  }, []);

  const handleChange = (e: any) => {
    // change したのはいいとして、ON なのか OFF なのか判定する必要がある
    if (val.includes(e.target.value)) {
      // すでに含まれていれば OFF したと判断し、
      // イベント発行元を除いた配列を set し直す
      setVal(val.filter((item) => item !== e.target.value));
    } else {
      // そうでなければ ON と判断し、
      // イベント発行元を末尾に加えた配列を set し直す
      setVal([...val, e.target.value]);
      // state は直接は編集できない
      // つまり val.push(e.target.value) はNG ❌
    }
  };

  return (
    <div className="App">
      <h1>{val.join(", ")}</h1>
      {data.map((item: any) => (
        <div key={item.prefCode}>
          <input
            type="checkbox"
            value={item.prefCode}
            onChange={handleChange}
            checked={val.includes(item.prefCode)}
          />
          <label>{item.prefName}</label>
        </div>
      ))}
    </div>
  );
}

export default App;
