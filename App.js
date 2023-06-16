import React, { useState, useContext, useEffect, useRef } from 'react';
import './index.css'

const guns = ['강화군', '동구', '미추홀구', '연수구', '남동구']
const days = ['1', '2', '3', '4', '5']

function fetchData(gun, day) {
  const endPoint = 'https://api.odcloud.kr/api/15067973/v1/uddi:2a956a34-b2cb-413c-8177-f0b86e3dcd69?page=1&perPage=10&serviceKey=VOUp56jiBd%2Bk9tSYhKWkxyYvltX%2BbgOLUPVKgorUTKUHBmpTVOSAEcwCeFD3zGe87x%2BDQN8II7kIUELICUggxA%3D%3D'
  const serviceKey = process.env.REACT_APP_SERVICE_KEY;
  const type = 'json'
  const numOfRows = 10
  const pageNo = 1

  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      if (!res.ok) { 
        throw res;
      }
      return res.json();
    })

  return promise
}

export default function App() {
  const [gun, setGun] = useState(guns[0])
  const [day, setDay] = useState(days[0])

  return (
    <>
      <h1 className='flex justify-center text-2xl font-semibold mt-2'>인천광역시 이음카드 매출현황</h1>
      <div className='flex justify-end mt-4'>
        <select className="flex justify-end items-end h-8 w-32 text-lg border border-gray-300 mr-4 items-center"
          onChange={(e) => setGun(e.target.value)}>
          {guns.map(gun => (
            <option key={gun} value={gun}>{gun}</option>
          ))}
        </select>
        <select className="h-8 w-32 text-lg border border-gray-300 mr-4"
          onChange={(e) => setDay(e.target.value)}>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <Dashboard gun={gun} day={day}/>
    </>
  )
}

function Dashboard({gun, day}){
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() =>{
    setIsLoaded(false); 
    setError(null);

    fetchData(gun, day)
    .then(data => {
      console.log(data)
      setData(data);
    })
    .catch(error =>{
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  })
    
}