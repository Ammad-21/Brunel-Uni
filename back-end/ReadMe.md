EcoMove CO₂ Tracker Backend
Overview
This project is a backend REST API for tracking transportation trips and calculating carbon dioxide (CO₂) emissions based on the transport type and distance travelled.
The system allows users to create, retrieve, update, and delete trip records. CO₂ emissions are automatically calculated when a trip is created.
The backend follows a layered architecture using Spring Boot with an H2 in-memory database.

Technologies: Java Spring Boot Spring Data JPA Apache Maven H2 Database Engine Thunder Client

Architecture

The project follows a standard backend structure:
controller  → REST API endpoints
service     → business logic
repository  → database access
model       → database entities

| Column         | Description             |
| -------------- | ----------------------- |
| trip_id        | Primary key             |
| user_id        | User identifier         |
| transport_mode | Type of transport       |
| distance_km    | Distance travelled      |
| co2_emission   | Calculated CO₂ emission |
| created_at     | Trip timestamp          |

API Endpoints
GET    /api/trips
GET    /api/trips/{id}
POST   /api/trips
PUT    /api/trips/{id}
DELETE /api/trips/{id}

Example POST request:

{
 "userId": 1,
 "transportMode": "car",
 "distanceKm": 10
}

Application runs at http://localhost:8080
Database Console H2 : http://localhost:8080/h2-console
Query example :Select * FROM TRIPS;
