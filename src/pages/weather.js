// pages/api/weather.js
export default async function handler(req, res) {
    const API_KEY = '729d42b6df004d3cb8d102651242211';
    const LAT_LONG = '14.235,100.5018';
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LAT_LONG}&lang=th`
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
  