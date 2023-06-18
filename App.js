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


const incheon = [
  { siDo: 28, goGun: 245, name: '계양구' },
  { siDo: 28, goGun: 200, name: '남동구' },
  { siDo: 28, goGun: 140, name: '동구' },
  { siDo: 28, goGun: 177, name: '미추홀구' },
  { siDo: 28, goGun: 237, name: '부평구' },
  { siDo: 28, goGun: 260, name: '서구' },
  { siDo: 28, goGun: 185, name: '연수구' },
  { siDo: 28, goGun: 110, name: '중구' },
]

const years = [2020, 2021, 2022]

function fetchData(city, year) {

  const endPoint = 'http://apis.data.go.kr/B552061/schoolzoneChild/getRestSchoolzoneChild'
  const serviceKey = process.env.REACT_APP_SERVICE_KEY;
  const type = 'json';
  const numOfRows = 10;
  const pageNo = 1;

  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })

  return promise;
}

export default function App() {

  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(incheon[0]);

  return (
    <>
      <h1 className='text-center py-8 text-2xl font-semibold'>인천 스쿨존 사고조회</h1>
      <div id="select-year" className='w-full ml-4 my-4'>
        <select className='border border-gray-300 w-28 h-8 text-lg' onChange={(e) => setYear(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className='flex justify-center'>
        {incheon.map(city => (
          <button className='border-2 border-black rounded p-4 m-1 hover:bg-sky-300'
            key={city.id}
            onClick={() => setCity(city)}
          >
            {city.name}
          </button>
        ))}
      </div>
      <Dashboard city={city} year={year} />
    </>
  )
}

function Dashboard({ city, year }) {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    setIsLoaded(false);
    setError(null);

    fetchData(city, year)
      .then(data => {
        console.log(data)
        setData(data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));

  }, [city, year])

  if (error) {
    return <p className='mt-4 ml-4'>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p className='mt-4 ml-4'>fetching data...</p>
  }

  return (
    <>
      <h1>{year}년 {city.name} 사고조회 결과</h1>
      {data.totalCount > 0 ? (
        <>
          <Rechart accidents={data.items.item} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}
    </>
  )
}

function Rechart({ accidents }) {
  const chartData = accidents.map(accident => {

    return {
      name: accident.spot_nm.split(' '),
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="#009966" />
          <Bar dataKey="중상자수" fill="#ffcb05" />
          <Bar dataKey="사망자수" fill="#E71D36" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

