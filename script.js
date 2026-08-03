const TWELVE_API_KEY = "f9b05a002b0648ce85dbbd0fb34e017e"; // yo thik cha
const GROQ_API_KEY = "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"; // NAYA KEY HALA

document.getElementById('scanBtn').onclick = runScan;

async function runScan() {
  let pair = document.getElementById('pair').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = "⏳ Data liyara AI lai sodhirako...";

  if (pair === "GOLD") pair = "XAU/USD";

  try {
    const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${pair}&interval=15min&outputsize=10&apikey=${TWELVE_API_KEY}`);
    const data = await res.json();
    if (data.status === "error") { resultDiv.innerText = "TwelveData ERROR: " + data.message; return; }
    const prices = data.values.map(v => parseFloat(v.close)).reverse();

    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + GROQ_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // <-- YO CHANGE GARA
        messages: [{ role: 'user', content: `You are a forex expert. Pair: ${pair}. Last price: ${prices[prices.length-1]}. Last 10 candles: ${prices.slice(-10)}. Give me FINAL SIGNAL: BUY or SELL with ENTRY, TP, SL. Be very short.` }]
      })
    });
    const aiData = await aiRes.json();
    if (aiData.error) { resultDiv.innerText = "Groq ERROR: " + aiData.error.message; return; }

    resultDiv.innerText = "✅ SIGNAL\n\n" + aiData.choices[0].message.content;

  } catch (e) {
    resultDiv.innerText = "ERROR: " + e.message;
  }
}
