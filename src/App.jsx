import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CryptoSelect from "./components/CryptoSelect";
import PredictionCard from "./components/PredictionCard";
import Loader from "./components/Loader";

const App = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("ethereum");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrediction = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://crypto-vision-backend.onrender.com/predict?coin=${selectedCrypto}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setPrediction(null);
      } else {
        // Assure-toi que ton backend renvoie les prédictions dans data.prediction
        setPrediction(data.prediction || data);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [selectedCrypto]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Header />
      <CryptoSelect selected={selectedCrypto} onChange={setSelectedCrypto} />
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500 mt-4">{error}</div>
      ) : (
        prediction && <PredictionCard data={prediction} coin={selectedCrypto} />
      )}
    </div>
  );
};

export default App;
