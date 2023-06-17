import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const terminals = ['T1', 'T2']

function fetchData(terminal) {

  const endPoint = 'http://apis.data.go.kr/B551177/StatusOfArrivals/getArrivalsCongestion'
  const serviceKey = 'VOUp56jiBd%2Bk9tSYhKWkxyYvltX%2BbgOLUPVKgorUTKUHBmpTVOSAEcwCeFD3zGe87x%2BDQN8II7kIUELICUggxA%3D%';
  const type = 'json';
  const numOfRows = 10;
  const pageNo = 1;

  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&terno=${terminal}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })

  return promise;
}

export default function App() {

  const [terminal, setTerminal] = useState(terminals[0])
  const [entrygate, setEntrygate] = useState()
  const [data, setData] = useState([])

  return (
    <>
      <h1 className='text-center py-12 text-2xl font-semibold'>입국장별 대기인원</h1>
      <div id="select-terminal" className="flex w-64 justify-between float-right mr-4 mt-2">
        <select className="border border-gray-300 w-28 h-8 text-lg"
          onChange={(e) => setTerminal(e.target.value)}>
          {terminals.map(terminal => (
            <option key={terminal} value={terminal}>{terminal}</option>
          ))}
        </select>
        <select className="border border-gray-300 w-28 h-8 text-lg"
          onChange={(e) => setEntrygate(e.target.value)}>
         <option key={entrygate} value={entrygate}>{entrygate}</option>
        </select>
      </div>
            
      <Dashboard terminal={terminal} />
    </>
  )
}

function Dashboard({ terminal }) {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    setIsLoaded(false);
    setError(null);

    fetchData(terminal)
      .then(data => {
        console.log(data)
        setData(data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));

  }, [terminal])

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      <h2>{terminal} 승객 조회 결과</h2>

      {data.korea > 0 ? (
        <>
          <Rechart complicate={data.items.item} />

        </>
      ) : (
        <p>자료가 없습니다</p>
      )}
    </>
  )
}


function Rechart({ complicates }) {

  const chartData = complicates.map(complicate => {

    return {
      국내인: complicate.korean,
      외국인: complicate.foreigner,
    }
  })

  return (
    <div className="h={300px}">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="국내인" fill="#FF0060" />
          <Bar dataKey="외국인" fill="#F6FA70" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




