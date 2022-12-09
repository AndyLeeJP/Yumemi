import { useEffect, useState } from "react";
import "./App.css";
import Highcharts, { SeriesLineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";

type pref = {
  prefCode: number;
  prefName: string;
};

function App() {
  const APIKEY = process.env.REACT_APP_API_KEY;
  const [prefecture, setPrefecture] = useState([]);
  const [select, setSelect] = useState(["選択値"]);
  const [seriesBox, setSeriesBox] = useState<Highcharts.SeriesLineOptions[]>(
    []
  );
  const [informations, setInformations] = useState<Highcharts.Options>({
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

  //全都道府県名取得
  const getApi = () => {
    if (APIKEY === undefined) return;
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      method: "GET",

      headers: {
        "X-API-KEY": APIKEY,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json);
        setPrefecture(json.result);
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    setInformations((prevState) => ({
      ...prevState,
      series: seriesBox,
    }));
  }, [seriesBox]);

  //チェックボックス操作時処理
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (select.includes(e.target.value)) {
      const result = seriesBox.filter(
        (dataBox: SeriesLineOptions) => dataBox.name !== e.target.id
      );
      setSeriesBox(result);
      console.log(result);

      return setSelect(select.filter((item) => item !== e.target.value));
    } else {
      console.log(e.target.value);

      setSelect([...select, e.target.value]);

      //console.log("都道府県名" + e.target.id);
      if (APIKEY === undefined) return;
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${e.target.value}`,
        {
          headers: { "X-API-KEY": APIKEY },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const populationData: number[] = [];
          const fetchPupoData = json.result.data[0].data;

          for (let i = 0; i < fetchPupoData.length; i++) {
            //console.log(data2[i]["value"]);
            populationData.push(fetchPupoData[i]["value"]);
          }

          const select_series: SeriesLineOptions = {
            type: "line",
            name: e.target.id,
            data: populationData,
          };
          //console.log(select_series);
          //console.log(options);

          setSeriesBox([...seriesBox, select_series]);
          //console.log(save);
        });
    }
  };

  return (
    <div className="App">
      <h1>{select.join(", ")}</h1>
      {prefecture.map((item: pref) => (
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
      <HighchartsReact highcharts={Highcharts} options={informations} />
    </div>
  );
}

export default App;
