from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, ConfigDict
from typing import List
import uvicorn

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.barber_db
appointments_collection = db.appointments

class AppointmentBase(BaseModel):
    barber: str
    date: str
    time: str
    customer_name: str
    phone: str

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

app = FastAPI(title="Barber Appointments API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === הוספנו את הנתיב הזה בשביל ה-Load Balancer ===
@app.get("/")
async def root():
    return {"status": "ok", "message": "Barber API is up and running!"}

@app.post("/appointments/", response_model=AppointmentResponse)
async def create_appointment(appointment: AppointmentCreate):
    existing = await appointments_collection.find_one({
        "barber": appointment.barber,
        "date": appointment.date,
        "time": appointment.time
    })
    if existing:
        raise HTTPException(status_code=400, detail="The selected time slot is already booked.")
        
    app_dict = appointment.model_dump()
    result = await appointments_collection.insert_one(app_dict)
    created_appointment = await appointments_collection.find_one({"_id": result.inserted_id})
    created_appointment["id"] = str(created_appointment["_id"])
    return created_appointment

@app.get("/appointments/", response_model=List[AppointmentResponse])
async def read_appointments(skip: int = 0, limit: int = 100):
    appointments = await appointments_collection.find().skip(skip).limit(limit).to_list(limit)
    for app in appointments:
        app["id"] = str(app["_id"])
    return appointments

@app.get("/admin/appointments/", response_model=List[AppointmentResponse])
async def admin_read_appointments():
    appointments = await appointments_collection.find().sort([("date", 1), ("time", 1)]).to_list(1000)
    for app in appointments:
        app["id"] = str(app["_id"])
    return appointments

@app.put("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(appointment_id: str, appointment: AppointmentCreate):
    try:
        obj_id = ObjectId(appointment_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await appointments_collection.update_one({"_id": obj_id}, {"$set": appointment.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    updated_app = await appointments_collection.find_one({"_id": obj_id})
    updated_app["id"] = str(updated_app["_id"])
    return updated_app

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    try:
        obj_id = ObjectId(appointment_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await appointments_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"ok": True}

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)