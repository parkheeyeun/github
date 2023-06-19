import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import Header from './components/Header'

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

const years = [2021, 2020, 2019, 2018];

function fetchData(city, year) {

  const endPoint = 'http://apis.data.go.kr/B552061/frequentzoneLg/getRestFrequentzoneLg'
  const serviceKey = "VOUp56jiBd%2Bk9tSYhKWkxyYvltX%2BbgOLUPVKgorUTKUHBmpTVOSAEcwCeFD3zGe87x%2BDQN8II7kIUELICUggxA%3D%3D"
  const type = 'json';
  const numOfRows = 10;
  const pageNo = 1;

  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      // console.log(res)
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })

  // console.log(promise)

  return promise;
}

export default function App() {

  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(incheon[0]);

  return (
    <>
      <Header />
      <div id="select-year" className='w-full ml-4 my-4'>
        <select className='border border-gray-300 w-28 h-8 text-lg' onChange={(e) => setYear(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className='flex justify-center'>
        {incheon.map((city) => (
          <button className='border-2 border-black rounded p-4 m-1 hover:bg-sky-100'
            key={city.goGun}
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
      {data.totalCount > 0 ? (
        <>
          <KakaoMap accidents={data.items.item} />
          <h1 className='m-4'>{year}년 {city.name} 사고다발 구역 사고결과</h1>
          <Rechart accidents={data.items.item} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}
    </>
  )
}

function KakaoMap({ accidents }) {

  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.la_crd}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >

      <div style={{ padding: "5px", color: "#000"}}>
        {accident.spot_nm.split(' ')[2]}
      </div>
    </MapInfoWindow>
  ))

  return (
    <Map
      center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
      style={{ width: "100%", height: "450px", marginTop: "10px"}}
      level={5}
    >
      <MapMarker
        position={{lat: accidents[0].la_crd, lng: accidents[0].lo_crd}}
      >
      </MapMarker>

      {mapInfoWindows}
    </Map>
  )
}

function Rechart({ accidents }) {

  const chartData = accidents.map(accident => {
    const arr = accident.spot_nm.split(' ')
    const spot = arr[2].concat(arr[3])
    // console.log(spot)

    return {
      name: spot,
      발생건수: accident.occrrnc_cnt,
      부상자수: accident.wnd_dnv_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div style={{ height: "300px" }}>
      <ComposedChart
        width={1000}
        height={400}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="발생건수" fill="#009966" />
        <Bar dataKey="부상자수" fill="#a840ff" />
        <Bar dataKey="중상자수" fill="#ffcb05" />
        <Bar dataKey="사망자수" fill="#E71D36" />
        <Line type="monotone" dataKey="발생건수" stroke="#ff7300" />
      </ComposedChart>
    </div>
  )
}

