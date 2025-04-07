const PredictionCard = ({ data, coin }) => (
    <div className="max-w-md mx-auto bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2 capitalize">{coin} - Prédictions</h2>
      <ul className="space-y-2">
        {data.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{new Date(item.ds).toLocaleDateString()}</span>
            <span className="text-green-400 font-medium">${item.yhat.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default PredictionCard;
  