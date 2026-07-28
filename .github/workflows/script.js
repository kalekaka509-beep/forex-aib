const API_KEY = "AIzaSyAfA4lVgqru3ef1Ytj9QD3000qZ7ojTnrk"; // Timro Gemini Key

document.getElementById('signalBtn').addEventListener('click', getSignal);

async function getSignal() {
  const pair = document.getElementById('pair').value;
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('resultBox');
  
  loading.style.display = 'block';
  resultBox.innerHTML = '';

  // Demo H4 data. Pachi yaha real candle data jodamla
  const h4Candles = `Pair: ${pair}. Last 20 H4 Candles: Uptrend, RSI 62, Price 1.0865, Near Resistance 1.0870`;
  
  const prompt = `You are a professional Forex H4 trader with 15 years experience.
  Data: ${h4Candles}
  
  Analyze using RSI, MACD, Support, Resistance, Trend on H4 timeframe.
  Reply ONLY in valid JSON format, no extra text, no markdown:
  {
    "signal": "BUY",
    "entry": "1.0860",
    "tp": "1.0920", 
    "sl": "1.0810",
    "confidence": "85%",
    "reason": "Price broke resistance with bullish candle on H4"
  }`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json" // JSON fix garna
        }
      })
    });
    
    const data = await res.json();
    const aiText = data.candidates[0].content.parts[0].text;
    const json = JSON.parse(aiText);
    
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
    resultBox.innerHTML = "Error: API fail bhayo. Key check gara. " + e;
    console.log(e);
  }
          }
