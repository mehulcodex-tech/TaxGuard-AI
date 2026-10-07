from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="TaxGuard-AI ML Service")


class TransactionFeatures(BaseModel):
    amount: float
    taxRate: float
    taxAmount: float
    vendorAverage: float
    vendorTransactionCount: int
    amountDeviation: float
    transactionFrequency: float
    taxDifference: float


@app.get("/")
def root():
    return {
        "success": True,
        "message": "TaxGuard-AI ML service is running"
    }


@app.post("/predict")
def predict(features: TransactionFeatures):
    return {
        "success": True,
        "message": "Transaction features received",
        "features": features.model_dump()
    }