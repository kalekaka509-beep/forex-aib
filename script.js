const API_KEY = "YOUR_GEMINI_API_KEY"; // Yaha timro key halne

document.getElementById('signalBtn').addEventListener('click', getSignal);

async function getSignal() {
  const pair = document.getElementById('pair').value;
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('resultBox');
  
  loading.style.display = 'block';
  resultBox.innerHTML = '';

  // Note: Real ma yaha TradingView ko H4 data fetch garnu parchha
  // Ahile demo ko lagi dummy data pathako
  const h4Candles = "Last 20 H4 Candles: Open:1.0850 High:1.0870 Low:1.0840 Close:1.0865...";
  
  const prompt = `You are a professional Forex H4 trader with 15 years experience.
  Pair: ${pair}
  Data: ${h4Candles}
  
  Analyze using RSI, MACD, Support, Resistance, Trendline on H4 timeframe.
  Give only 1 signal: BUY, SELL or HOLD.
  
  Reply in this exact JSON format:
  {
    "signal": "BUY",
    "entry": "1.0860",
    "tp": "1.0920",
    "sl": "1.0810",
    "confidence": "85%",
    "reason": "2 line technical reason in English"
  }`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    const aiText = data.candidates[0].content.parts[0].text;
    const json = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, ''));
    
    loading.style.display = 'none';
    resultBox.innerHTML = `
      <div class="signal ${json.signal}">SIGNAL: ${json.signal}</div>
      <p><b>Entry:</b> ${json.entry}</p>
      <p><b>TP:</b> ${json.tp}</p>
      <p><b>SL:</b> ${json.sl}</p>
      <p><b>Confidence:</b> ${json.confidence}</p>
      <p><b>Reason:</b> ${json.reason}</p>
    `;
    
  } catch(e) {
    loading.style.display = 'none';
    resultBox.innerHTML = "Error: API Key check gara or try again";
  }
}
