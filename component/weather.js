import { useEffect, useState } from 'react';
export default Weather;

function Weather () { // 날씨 api 를 사용한 컴포넌트

  useEffect(() => { // 웹에 접속하면 사용자의 geolocation 정보를 알아낸다. 
    // handleGeoSucc -> 위치 정보 불러오기 성공, handleGeoErr -> 위치 정보 불러오기 실패
    navigator.geolocation.getCurrentPosition(handleGeoSucc, handleGeoErr);
  }, [])

  const [coords, saveCoords] = useState(); // 현재 위치의 위도와 경도
  const [name, setName] = useState() // 도시의 이름
  const [temp, setTemp] = useState(); // 현재 날씨 온도
  const [weather, setWeather] = useState() // 현재 날씨 상태

  // 사용자의 Geolocation 정보를 통해 위도와 경도를 알아내는 함수
  function handleGeoSucc(position) {
    const latitude = position.coords.latitude // 경도
    const longitude = position.coords.longitude // 위도
    const coordsObj = {
      latitude,
      longitude
    }
    saveCoords(coordsObj); // 현재 위도와 경도의 객체 데이터를 coords state에 저장
    getWeather(latitude, longitude); // getWeather 함수의 인수로 위도와 경도 값을 전달
  }

  // 사용자의 Geolocation 정보를 알아오지 못했을 때 실행되는 함수
  function handleGeoErr (error) {
    console.log('not finde your location')
  }

  function requestCoords() {
    
  }

  // 받아온 위도와 경도 값을 이용해 API 를 사용하여 현재 날씨 정보를 가져오는 함수
  function getWeather(lat, lon) {
    const base = "https://api.openweathermap.org/data/2.5/" // API 주소
    const key ="12cf99c35db830ceeb7bc888be1ec4ce" //API 키값
    fetch(`${base}weather?lat=${lat}&lon=${lon}&appid=${key}`) 
      .then(res => res.json()) // API 주소를 통해 응답받은 파일은 json 으로 변환
      .then(data => { // json 으로 변환된 data 사용
        const name = data.name.toUpperCase() // 도시 이름을 대문자로 변환
        const temp = Math.round(data.main.temp - 273.15); // 섭씨온도로 변환
        const weather = data.weather[0] // weather 배열의 0번째 인덱스 정보 저장
        setTemp(`${temp}°C`) // 저장된 temp 변수 값에 기호 붙히기
        setWeather(weather.main) // weather의 0번쨰 객체 데이터 중 main 값 불러오기
        setName(name) // 대문자로 변환된 도시 이름 저장
      })
    }

    // 그날 날씨에 따른 아이콘을 불러오는 함수
    const weatherIcon = () => { 
      if (weather === "Clear") {
        return "https://openweathermap.org/img/wn/01d@2x.png"
      } else if ( weather === "Clouds") {
        return "https://openweathermap.org/img/wn/02d@2x.png"
      } else if ( weather === "Rain") {
        return "https://openweathermap.org/img/wn/09d@2x.png"
      } else if ( weather === "Thunderstorm") {
        return "https://openweathermap.org/img/wn/11d@2x.png"
      } else if ( weather === "Snow") {
        return "https://openweathermap.org/img/wn/13d@2x.png"
      } else if ( weather === "Mist") {
        return "https://openweathermap.org/img/wn/50d@2x.png"
      }
    }
    return (
      <div className='w-64 flex justify-center items-center pr-6 absolute right-40 h-24'>
        <img src={weatherIcon()} alt="" />
          <strong className='text-xl'>
            {name}
            <span className='text-red-500 ml-2'>{temp}</span>
          </strong>
      </div>
    )
  }


