import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [ethData, setEthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);
  const [predLoading, setPredLoading] = useState(false);

  // Récupérer les données historiques ETH sur 7 jours via CoinGecko
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7")
      .then((res) => res.json())
      .then((data) => {
        const chartData = data.prices.map(item => ({
          date: new Date(item[0]).toLocaleDateString(),
          price: parseFloat(item[1]).toFixed(2)
        }));
        setEthData(chartData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données ETH :", error);
        setLoading(false);
      });
  }, []);

  // Fonction pour appeler l'API de prédiction
  const handlePredict = async () => {
    setPredLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict");
      const data = await res.json();
      setPredictions(data);
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);
    } finally {
      setPredLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📈 CryptoVision – Ethereum Tracker
      </h1>

      {loading ? (
        <p className="text-center">Chargement des données ETH...</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl mb-4">Prix sur les 7 derniers jours (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ethData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4ade80"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <button
            onClick={handlePredict}
            disabled={predLoading}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-xl transition"
          >
            {predLoading ? "Prédiction en cours..." : "🔮 Prédire les mouvements d'ETH"}
          </button>

          {predictions && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">
                Prédictions pour les 3 prochains jours :
              </h3>
              <ul>
                {predictions.map((pred, index) => (
                  <li key={index}>
                    {new Date(pred.ds).toLocaleDateString()} :{' '}
                    {parseFloat(pred.yhat).toFixed(2)} USD
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
