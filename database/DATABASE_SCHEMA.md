# Database Schema - Ahliya Task

## 1. Requirements

- 3 roles: SuperAdmin, Admin, User
- Login with JWT + refresh token
- Dynamic menu per role
- Change password with log
- FaceID login per device
- QR reader

## 2. Entities

Roles, Users, Menus, RoleMenus (link), RefreshTokens, UserDevices, PasswordChangeLogs

## 3. Tables

### Roles

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| Name | NVARCHAR(50) UNIQUE | - |

Values: 1=SuperAdmin, 2=Admin, 3=User

### Users

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| FullName | NVARCHAR(100) | - |
| Email | NVARCHAR(150) UNIQUE | - |
| PasswordHash | NVARCHAR(255) | - |
| RoleId | INT | FK -> Roles(Id) |
| IsActive | BIT | - |
| CreatedAt | DATETIME2 | - |

### Menus

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| Title | NVARCHAR(80) | - |
| Icon | NVARCHAR(50) | - |
| Route | NVARCHAR(120) | - |
| ParentId | INT NULL | FK -> Menus(Id) |
| SortOrder | INT | - |
| IsActive | BIT | - |

### RoleMenus

| Column | Type | Key |
| RoleId | INT | PK, FK -> Roles(Id) CASCADE |
| MenuId | INT | PK, FK -> Menus(Id) CASCADE |

### RefreshTokens

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| UserId | INT | FK -> Users(Id) CASCADE |
| Token | NVARCHAR(300) | - |
| ExpiresAt | DATETIME2 | - |
| IsRevoked | BIT | - |
| DeviceInfo | NVARCHAR(200) NULL | - |
| CreatedAt | DATETIME2 | - |

### UserDevices

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| UserId | INT | FK -> Users(Id) CASCADE |
| DeviceId | NVARCHAR(200) | - |
| BiometricEnabled | BIT | - |
| CreatedAt | DATETIME2 | - |

### PasswordChangeLogs

| Column | Type | Key |
| Id | INT IDENTITY | PK |
| UserId | INT | FK -> Users(Id) CASCADE |
| ChangedAt | DATETIME2 | - |
| Ip | NVARCHAR(50) NULL | - |

## 4. Relationships

- Roles 1:N Users (one role has many users, Users.RoleId)
- Roles N:M Menus through RoleMenus (menu per role)
- Users 1:N RefreshTokens (login sessions, revoked on logout)
- Users 1:N UserDevices (faceid per mobile)
- Users 1:N PasswordChangeLogs (audit)
- Menus 1:N Menus (ParentId for sub-menu later)

## 5. Main queries

- Login: SELECT from Users by Email + check IsActive
- my-menu: JOIN RoleMenus + Menus WHERE RoleId + IsActive ORDER BY SortOrder
- Change password: UPDATE Users.PasswordHash + INSERT PasswordChangeLogs
- Logout: UPDATE RefreshTokens SET IsRevoked=1

## 6. Files

- 01_CreateTables.sql : create all tables + indexes
- 02_SeedData.sql : roles + menus + role-menu links
- Users seeded by API on first run
