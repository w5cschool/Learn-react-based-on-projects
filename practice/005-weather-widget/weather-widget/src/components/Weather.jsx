import { useMemo, useState } from 'react'

const WEATHER_CODE_MAP = {
  0: '晴',
  1: '多云',
  2: '云',
  3: '阴',
  45: '雾',
  48: '霾',
  51: '毛毛雨',
  53: '小雨',
  55: '中雨',
  56: '冻毛毛雨',
  57: '冻小雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨',
  67: '暴冻雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '冰粒',
  80: '阵雨(小)',
  81: '阵雨(中)',
  82: '阵雨(大)',
  85: '阵雪(小)',
  86: '阵雪(大)',
  95: '雷阵雨',
  96: '雷阵雨(小冰雹)',
  99: '雷阵雨(大冰雹)'
}

async function geocodeCity(name) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', name)
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'zh')
  url.searchParams.set('format', 'json')

  const res = await fetch(url)
  if (!res.ok) throw new Error('地理编码失败')
  const data = await res.json()
  if (!data || !data.results || data.results.length === 0) {
    throw new Error('未找到该城市')
  }
  const { latitude, longitude, name: displayName, country, admin1 } = data.results[0]
  return { latitude, longitude, displayName, country, admin1 }
}

async function fetchCurrentWeather(latitude, longitude) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url)
  if (!res.ok) throw new Error('天气数据获取失败')
  const data = await res.json()
  return data.current
}

export default function Weather() {
  const [city, setCity] = useState('北京')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const prettyLocation = useMemo(() => {
    if (!result?.location) return ''
    const { displayName, admin1, country } = result.location
    return [displayName, admin1, country].filter(Boolean).join(' · ')
  }, [result])

  async function onSearch(e) {
    e?.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const loc = await geocodeCity(city.trim())
      const current = await fetchCurrentWeather(loc.latitude, loc.longitude)
      setResult({ location: loc, current })
    } catch (err) {
      setError(err?.message || '查询失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-card">
      <form className="search" onSubmit={onSearch}>
        <input
          placeholder="输入城市名，例如：北京"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? '查询中…' : '查询'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <div className="loc">{prettyLocation}</div>
          <div className="metrics">
            <div className="temp">
              <span className="num">{result.current.temperature_2m}</span>
              <span className="unit">°C</span>
            </div>
            <div className="row">
              <span>湿度</span>
              <span>{result.current.relative_humidity_2m}%</span>
            </div>
            <div className="row">
              <span>风速</span>
              <span>{result.current.wind_speed_10m} m/s</span>
            </div>
            <div className="row">
              <span>天气</span>
              <span>{WEATHER_CODE_MAP[result.current.weather_code] ?? '未知'}</span>
            </div>
            <div className="time">更新时间：{new Date(result.current.time).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}


