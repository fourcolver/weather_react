import './App.css';
import React, { useState, useEffect } from 'react'

function App() {
  const weatherDescription = {
    0: "Clear sky",
    1: "Mainly clear, partly cloudy, and overcast",
    2: "Mainly clear, partly cloudy, and overcast",
    3: "Mainly clear, partly cloudy, and overcast",
    45: "Fog and depositing rime fog",
    48: "Fog and depositing rime fog"
  }
  const defaultCity = [
    {
      "city": "berlin",
      "longitude": 48.8567,
      "latitude": 2.3510
    },
    {
      "city": "warsaw",
      "longitude": 52.2297,
      "latitude": 21.0122
    },
    {
      "city": "sofia",
      "longitude": 42.7105,
      "latitude": 23.3238
    },
  ]

  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checked, setChecked] = useState(false);

  const fetchRandomData = async () => {
    const weatherElement = [];
    for (let i = 0; i < defaultCity.length; i++) {
      const element = defaultCity[i];
      await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${element.latitude}&longitude=${element.longitude}&current_weather=true`)
        .then(res => res.json())
        .then(
          (result) => {
            const pushItem = {
              city: element.city,
              temperature: result.current_weather.temperature,
              weathercode: weatherDescription[result.current_weather.weathercode],
            }
            weatherElement.push(pushItem)
          },
          (error) => {
            setIsLoaded(true);
          }
        )
    }
    setData(weatherElement)
    setFilterData(weatherElement)
    setIsLoaded(true)
  };

  const searchLocation = (e) => {
    const filterKey = e.target.value;
    if (filterKey) {
      const filterItems = data.filter((el) => (
        el.city.includes(e.target.value)
      ));
      setFilterData(filterItems)
    }
    else {
      setFilterData(data)
    }
    setChecked(false)
  }

  const filterFavouriteLocation = (key) => {
    console.log(key)
    if (!checked) {
      const filterItems = data.filter((el) => (
        el.city == key
      ));
      setFilterData(filterItems)
    }
    else {
      setFilterData(data)
    }
    setChecked(!checked)
  }

  useEffect(() => {
    fetchRandomData();
  }, [])

  if (!isLoaded) {
    return <div>Loading</div>
  }

  return (
    <div className="App">
      <div>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Weather</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {filterData && filterData.map((i) => (
              <tr key={i.city}>
                <td>{i.city}</td>
                <td>{i.weathercode}</td>
                <td>{i.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='d-flex mt-2'>
        <input style={{ float: "left" }} type="text" placeholder='Search Here' onChange={(e) => searchLocation(e)} />
      </div>
      <div className='d-flex mt-2'>
        <p style={{ float: "left" }}>Favourite location</p>
        <input style={{ float: "left" }} checked={checked} type="checkbox" onChange={() => filterFavouriteLocation("berlin")} />
      </div>
    </div>
  );
}

export default App;
