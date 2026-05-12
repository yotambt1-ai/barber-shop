from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import boto3
import uuid
from botocore.exceptions import ClientError
import uvicorn

# --- AWS Setup (DynamoDB + SNS) ---
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
sns = boto3.client('sns', region_name='eu-north-1')
table = dynamodb.Table('BarberAppointments')

class AppointmentBase(BaseModel):
    barber: str
    date: str
    time: str
    customer_name: str
    phone: str
    email: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: str
    status: Optional[str] = None
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
    appointment_id = str(uuid.uuid4())
    
    item = {
        "appointment_id": appointment_id,
        "name": appointment.customer_name,
        "time": appointment.time,
        "email": appointment.email or "no-email@provided.com",
        "status": "pending",
        "barber": appointment.barber,
        "date": appointment.date,
        "phone": appointment.phone
    }
    
    try:
        # Save to DynamoDB
        table.put_item(Item=item)
        
        # Trigger SNS (Dynamically fetch ARN by getting the topic via name)
        topic_response = sns.create_topic(Name='BarberAppointmentTopic')
        topic_arn = topic_response['TopicArn']
        
        sns.publish(
            TopicArn=topic_arn,
            Message=f"New appointment booked!\nID: {appointment_id}\nName: {item['name']}\nTime: {item['time']}\nBarber: {item['barber']}",
            Subject="New Barber Appointment"
        )
        
        # Format matching payload for the frontend
        response_data = appointment.model_dump()
        response_data["id"] = appointment_id
        response_data["status"] = "pending"
        return response_data
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"AWS Error: {e.response['Error']['Message']}")

@app.get("/appointments/", response_model=List[AppointmentResponse])
async def read_appointments(skip: int = 0, limit: int = 100):
    try:
        response = table.scan(Limit=limit)
        items = response.get('Items', [])
        for app in items:
            app["id"] = app.get("appointment_id")
            app["customer_name"] = app.get("name", app.get("customer_name", ""))
        return items
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"AWS Error: {e.response['Error']['Message']}")

@app.get("/admin/appointments/", response_model=List[AppointmentResponse])
async def admin_read_appointments():
    try:
        response = table.scan()
        items = response.get('Items', [])
        # Sort in Python since DynamoDB scans do not natively sort
        items.sort(key=lambda x: (x.get("date", ""), x.get("time", "")))
        for app in items:
            app["id"] = app.get("appointment_id")
            app["customer_name"] = app.get("name", app.get("customer_name", ""))
        return items
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"AWS Error: {e.response['Error']['Message']}")

@app.put("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(appointment_id: str, appointment: AppointmentCreate):
    try:
        response = table.get_item(Key={"appointment_id": appointment_id})
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        item = {
            "appointment_id": appointment_id,
            "name": appointment.customer_name,
            "time": appointment.time,
            "email": appointment.email or "no-email@provided.com",
            "status": response["Item"].get("status", "pending"),
            "barber": appointment.barber,
            "date": appointment.date,
            "phone": appointment.phone
        }
        table.put_item(Item=item)
        
        response_data = appointment.model_dump()
        response_data["id"] = appointment_id
        response_data["status"] = item["status"]
        return response_data
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"AWS Error: {e.response['Error']['Message']}")

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    try:
        response = table.get_item(Key={"appointment_id": appointment_id})
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        table.delete_item(Key={"appointment_id": appointment_id})
        return {"ok": True}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"AWS Error: {e.response['Error']['Message']}")

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)