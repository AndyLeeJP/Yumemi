import { useEffect, useState } from "react";
import "./App.css";
import Highcharts, { SeriesLineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [val, setVal] = useState(["選択値"]);
  const [save, setSave] = useState<any>([]);
  const [opt, setOptions] = useState<Highcharts.Options>({
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
      line: {},
    },
    series: [],
  });
  // const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

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
        //console.log(json);
        setData(json.result);
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  const handleChange = (e: any) => {
    // change したのはいいとして、ON なのか OFF なのか判定する必要がある
    if (val.includes(e.target.value)) {
      return setVal(val.filter((item) => item !== e.target.value));
    } else {
      console.log(e.target.value);
      // そうでなければ ON と判断し、
      // イベント発行元を末尾に加えた配列を set し直す
      setVal([...val, e.target.value]);
      // state は直接は編集できない
      console.log(e.target.id);
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
          setData2(json.result.data[0].data);
          const tmp: number[] = [];

          for (let i = 0; i < data2.length; i++) {
            //console.log(data2[i]["value"]);
            tmp.push(data2[i]["value"]);
          }

          const select_series: SeriesLineOptions = {
            type: "line",
            name: e.target.id,
            data: tmp,
          };
          //console.log(select_series);
          // options.series!.push(select_series);
          //console.log(options);

          // var save = pushJSON.parse(JSON.stringify(save));
          // save.push(new Date().toString());
          // save.push(JSON.parse(JSON.stringify(select_series)));
          setSave([...save, select_series]);

          console.log(save);
          setOptions((prevState) => ({
            ...prevState,
            series: save,
          }));
        });
    }
  };

  // const options: Highcharts.Options = {
  //   title: {
  //     text: "人口増加率",
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Value",
  //     },
  //   },
  //   xAxis: {
  //     accessibility: {
  //       rangeDescription: "Range: 1980 to 2020",
  //     },
  //   },
  //   legend: {
  //     layout: "vertical",
  //     align: "right",
  //     verticalAlign: "middle",
  //   },
  //   plotOptions: {
  //     series: {
  //       label: {
  //         connectorAllowed: false,
  //       },
  //       pointInterval: 5,
  //       pointStart: 1965,
  //     },
  //     line: {},
  //   },
  //   series: [],
  // };

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   HighchartsReact;

  // });
  return (
    <div className="App">
      <h1>{val.join(", ")}</h1>
      {data.map((item: any) => (
        <div key={item.prefCode}>
          <label>
            {item.prefName}
            <input
              type="checkbox"
              id={item.prefName}
              value={item.prefCode}
              onChange={handleChange}
              //checked={val.includes(item.prefCode)}
            />
          </label>
        </div>
      ))}
      <HighchartsReact
        highcharts={Highcharts}
        options={opt}
        // ref={chartComponentRef}
      />
    </div>
  );
}

export default App;
