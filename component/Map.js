import React, { useEffect, useState } from 'react';

const { kakao } = window;

const Map = () => {

    useEffect(()=>{ 

      // geolocation 을 통해 사용자의 위치정보를 얻음
      // 위치정보를 얻는 것을 성공했을 떄 handleGeoSucc 실행
      navigator.geolocation.getCurrentPosition(handleGeoSucc);

      function handleGeoSucc(position) {
        // position -> geolocation.position
        const latitude = position.coords.latitude 
        const longitude = position.coords.longitude 
        getMap(latitude, longitude);
      }

      function getMap (lat,lon) { 

        const container = document.getElementById('map'); 
        // 지도를 생성할 DOM 요소

        const options = { 
          center: new kakao.maps.LatLng(lat, lon), 
          level : 5 
         };
         
        const kakaoMap = new kakao.maps.Map(container, options); 
      }
    },[])
    return (
      <>
        <main className='p-8'>
        <div className='h-full w-full flex justify-center'>
          <div
          id='map'
          >
          </div>
          
      </div>
        </main>
      </>
    );
};

export default Map;