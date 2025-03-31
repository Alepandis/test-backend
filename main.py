from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
import redis
import json
import time
from typing import List
from bson import ObjectId

app = FastAPI()

@app.middleware("http")
async def measure_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"⏳ Tiempo de respuesta: {process_time:.2f} segundos")
    return response

#Configuracion de CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #allow_origins=["http://localhost:5173"],
    #allow_origins=["mongodb+srv://user1:-ciencias01@cluster0.vvoun7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Configuracióna MongoDB
#MONGO_URL = "mongodb://localhost:27017"
MONGO_URL = "mongodb+srv://user1:-ciencias01@cluster0.vvoun7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client =AsyncIOMotorClient(MONGO_URL)
db=client.football

#Configurar redis
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

#Modelo de datos

class Player(BaseModel):
    nickname: str
    dorsal: int
    posicion: str

class Lineup(BaseModel):
    formacion: str
    type: str
    jugadores: list

class Action(BaseModel):
    type: str
    minute: int
    dorsal: int

# Endpoints

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.post("/players")
async def create_player(player: Player):
    #print(player)
    player_dict = player.dict()
    result = await db.players.insert_one(player_dict)
    player_dict["_id"] = str(result.inserted_id)

    #Limpiar cache de jugadores en Redis 
    redis_client.delete("players")
    return player_dict

@app.get("/players")
async def list_players():

    cached_data =redis_client.get("players")
    if cached_data:
        return json.loads(cached_data)

    players = await db.players.find().to_list(100)
    print(players)
    
    for p in players:
        p["_id"] = str(p["_id"])
    
    #Guardar en cache
    redis_client.delete("players")

    return players

"""
    cached_players = redis_client.get("players")
    if cached_players:
        return json.loads(cached_players)
    
    #players = list(db.players.find())
    #cache.setex("players", 60, json.dumps(players))  # Guardar en caché por 60s
    #return players
"""

@app.delete("/players/{player_id}")
async def delete_player(player_id: str):

    result = await db.players.delete_one({"_id": ObjectId(player_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    
    return {"message": "Jugador eliminado correctamente"}

## Gestion de alineaciones
@app.post("/lineups")
async def create_lineup(lineup: Lineup):
    lineup_dict = lineup.dict()

    result = await db.lineup.insert_one(lineup_dict)
    lineup_dict["_id"] = str(result.inserted_id)

    return lineup_dict

@app.put("/lineups/{lineup_id}")
async def add_players_to_lineup(lineup_id: str, players: List[str]):
    # Buscar la alineación en la base de datos
    lineup = await db.lineup.find_one({"_id": ObjectId(lineup_id)})

    if not lineup:
        raise HTTPException(status_code=404, detail="Lineup not found")

    # Añadir jugadores a la alineación
    updated_lineup = await db.lineup.update_one(
        {"_id": ObjectId(lineup_id)},
        {"$push": {"jugadores": {"$each": players}}}
    )

    if updated_lineup.modified_count > 0:
        return {"msg": "Players added successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to add players")

@app.get("/lineups")
async def list_lineups():
    lineups = await db.lineup.find().to_list(100)

    for l in lineups:
        l["_id"] = str(l["_id"])

    return lineups

@app.delete("/lineups/{alineacion}")
async def delete_lineup(alineacion: str):
    #alineacion = alineacion.strip('"')

    query = {"formacion": alineacion}
    print("Consulta enviada a MongoDB:", query)

    result = await db.lineup.delete_one(query)

    #result["_id"] = str(result["_id"])

    print(f"Documentos eliminados: {result.deleted_count}")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alineacion no encontrada")
    
    return {"message": "Alineacion eliminada correctamente"}

## Gestion de acciones

@app.post("/actions")
async def create_action(action: Action):
    action_dict = action.dict()

    result = await db.action.insert_one(action_dict)

    action_dict["_id"] = str(result.inserted_id)
    return action_dict

@app.get("/actions")
async def list_actions():
    actions = await db.action.find().to_list(100)

    for a in actions:
        a["_id"] = str(a["_id"])

    return actions

@app.delete("/actions/{action_id}")
async def delete_actions(action_id: str):
    print(action_id)
    result = await db.action.delete_one({"_id": ObjectId(action_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Accion no encontrada")
    
    return {"message": "Accion eliminada correctamente"}

