import { useEffect, useRef, useState } from "react";
import "./App.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "人口増加率",
  },
  yAxis: {
    title: {
      text: "Value",
    },
  },
  xAxis: {
    accessibility: {
      rangeDescription: "Range: 1980 to 2020",
    },
  },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle",
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      pointInterval: 5,
      pointStart: 1965,
    },
  },
  series: [
    {
      name: "Installation & Developers",
      data: [
        43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
        161454, 154610,
      ],
    },
    {
      name: "Manufacturing",
      data: [
        24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
        31050,
      ],
    },
    {
      name: "Sales & Distribution",
      data: [
        11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
        25663,
      ],
    },
    {
      name: "Operations & Maintenance",
      data: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        11164,
        11218,
        10077,
      ],
    },
    {
      name: "Other",
      data: [
        21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
        10073,
      ],
    },
  ],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
};

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [val, setVal] = useState(["選択値"]);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // const state = {
  //   selected: Array(47).fill(false),
  //   prefectures: {},
  //   series: [],
  // };

  const getApi = () => {
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
    getApi();
  }, []);

  const handleChange = (e: any) => {
    // change したのはいいとして、ON なのか OFF なのか判定する必要がある
    if (val.includes(e.target.value)) {
      // console.log(setVal)

      setVal(val.filter((item) => item !== e.target.value));
    } else {
      // そうでなければ ON と判断し、
      // イベント発行元を末尾に加えた配列を set し直す
      setVal([...val, e.target.value]);
      // state は直接は編集できない
      // つまり val.push(e.target.value) はNG ❌
      // すでに含まれていれば OFF したと判断し、
      // イベント発行元を除いた配列を set し直す
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${e.target.value}`,
        {
          headers: { "X-API-KEY": "ex7wsKgup5vnO3VgsT3htKKSfNRQlrNkxPCrdzhB" },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setData2(json.result.data[0].data); //今日はここをいじれ
          //   state({
          //     selected:
          //   })
          for (let i = 0; i < data2.length; i++) {}
        });
    }
  };

  return (
    <div className="App">
      <h1>{val.join(", ")}</h1>
      {data.map((item: any) => (
        <div key={item.prefCode}>
          <label>
            {item.prefName}
            <input
              type="checkbox"
              value={item.prefCode}
              onChange={handleChange}
              //checked={val.includes(item.prefCode)}
            />
          </label>
        </div>
      ))}

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
}

export default App;
