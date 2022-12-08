import { useEffect, useState } from "react";
import "./App.css";
import Highcharts, { SeriesLineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";

function App() {
  const [data, setData] = useState([]);
  const [select, setSelect] = useState(["選択値"]);
  const [dataBoxes, setDataBoxes] = useState<any>([]);
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

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      series: dataBoxes,
    }));
  }, [dataBoxes]);

  const handleChange = (e: any) => {
    if (select.includes(e.target.value)) {
      const result = dataBoxes.filter(
        (dataBoxes: any) => dataBoxes.name !== e.target.id
      );
      setDataBoxes(result);
      console.log(result);

      return setSelect(select.filter((item) => item !== e.target.value));
    } else {
      console.log(e.target.value);

      setSelect([...select, e.target.value]);

      console.log("都道府県名" + e.target.id); //

      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${e.target.value}`,
        {
          headers: { "X-API-KEY": "ex7wsKgup5vnO3VgsT3htKKSfNRQlrNkxPCrdzhB" },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const tmp: number[] = [];
          const x = json.result.data[0].data;

          for (let i = 0; i < x.length; i++) {
            //console.log(data2[i]["value"]);
            tmp.push(x[i]["value"]);
          }

          const select_series: SeriesLineOptions = {
            type: "line",
            name: e.target.id,
            data: tmp,
          };
          //console.log(select_series);
          //console.log(options);

          setDataBoxes([...dataBoxes, select_series]);
          //console.log(save);
        });
    }
  };

  return (
    <div className="App">
      <h1>{select.join(", ")}</h1>
      {data.map((item: any) => (
        <div key={item.prefCode}>
          <label>
            {item.prefName}
            <input
              type="checkbox"
              id={item.prefName}
              value={item.prefCode}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
      <HighchartsReact highcharts={Highcharts} options={opt} />
    </div>
  );
}

export default App;
