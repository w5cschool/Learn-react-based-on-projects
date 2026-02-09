天气查询小工具（005）

使用 Open‑Meteo 提供的免费地理编码与天气 API，无需注册密钥。

运行

1. 安装依赖：
npm install

2. 开发启动：
npm run dev

3. 生产构建与本地预览：
npm run build
npm run preview

如何使用
- 输入城市名（例如：北京、上海、广州、深圳），点击“查询”。
- 若城市存在多种翻译或地区名称，默认取第一个结果。

数据源
- 地理编码：https://geocoding-api.open-meteo.com/v1/search
- 天气接口：https://api.open-meteo.com/v1/forecast

注意：接口返回的 weather_code 已简单映射为常见中文描述。


