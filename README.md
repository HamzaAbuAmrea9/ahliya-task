# Ahliya Task

Login with 3 roles + dynamic menu + QR + FaceID.
Ionic Angular + .NET 8 + SQL Server.

## Run backend
```
cd backend/Ahliya.Api
dotnet ef database update
dotnet run
```
API: http://localhost:5200 - swagger at /swagger

Test users (password 123456):
- super@test.com (SuperAdmin)
- admin@test.com (Admin)
- user@test.com (User)

## Run mobile
```
cd mobile/ahliya-app
npm install
npx ng serve
```
App: http://localhost:8100 - api url in src/environments/environment.ts

## Database
database/01_CreateTables.sql then 02_SeedData.sql
ERD in database/ERD.txt
