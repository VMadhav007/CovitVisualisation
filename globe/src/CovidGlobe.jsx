import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import * as d3 from "d3";

const CovidGlobe = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/covid_19_data.csv").then((csvData) => {
      const countryCases = {};

      csvData.forEach((row) => {
        const country = row["Country/Region"];
        const confirmed = parseInt(row["Confirmed"], 10) || 0;
        if (countryCases[country]) {
          countryCases[country] += confirmed;
        } else {
          countryCases[country] = confirmed;
        }
      });

      const processedData = Object.entries(countryCases)
        .map(([country, confirmed]) => ({ country, confirmed }))
        .filter((d) => d.confirmed > 0);

      setData(processedData);
    });
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[90vw] h-[90vh]">
        <h1 className="text-2xl font-bold text-center my-4">COVID-19 Cases Visualization</h1>
        <Plot
          data={[
            {
              type: "choropleth",
              locations: data.map((d) => d.country),
              locationmode: "country names",
              z: data.map((d) => d.confirmed),
              colorscale: "Reds",
              text: data.map((d) => `${d.country}: ${d.confirmed} cases`),
              colorbar: { title: "Total Cases", ticksuffix: "" },
            },
          ]}
          layout={{
            title: "COVID-19 Cases on 3D Globe",
            geo: {
              projection: { type: "orthographic" },
              showland: true,
              landcolor: "rgb(217, 217, 217)",
            },
            width: 1000,
            height: 800,
          }}
        />
      </div>
    </div>
  );
};

export default CovidGlobe;
