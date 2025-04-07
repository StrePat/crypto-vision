from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import pandas as pd
from prophet import Prophet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend en ligne !"}

@app.get("/predict")
def predict(coin: str = Query("ethereum")):
    """
    Prédit le prix d'une crypto au choix (par défaut: Ethereum) pour les 3 prochains jours.
    """
    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart?vs_currency=usd&days=30"
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": f"Impossible de récupérer les données pour {coin}. Vérifie le nom."}

    data = response.json()
    if "prices" not in data:
        return {"error": f"Données manquantes pour {coin}."}

    df = pd.DataFrame(data["prices"], columns=["timestamp", "price"])
    df["ds"] = pd.to_datetime(df["timestamp"], unit="ms")
    df["y"] = df["price"]
    df = df[["ds", "y"]]

    model = Prophet(daily_seasonality=True)
    model.fit(df)

    future = model.make_future_dataframe(periods=3)
    forecast = model.predict(future)

    forecast_data = forecast[["ds", "yhat"]].tail(3)
    result = forecast_data.to_dict(orient="records")

    return {
        "coin": coin,
        "prediction": result
    }
