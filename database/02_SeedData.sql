SET IDENTITY_INSERT Roles ON;
INSERT INTO Roles (Id, Name) VALUES (1, 'SuperAdmin'), (2, 'Admin'), (3, 'User');
SET IDENTITY_INSERT Roles OFF;

SET IDENTITY_INSERT Menus ON;
INSERT INTO Menus (Id, Title, Icon, Route, ParentId, SortOrder, IsActive) VALUES
(1, 'Home', 'home', '/home', NULL, 1, 1),
(2, 'Scan QR', 'qr-code', '/qr-scanner', NULL, 2, 1),
(3, 'Dashboard', 'grid', '/dashboard', NULL, 3, 1),
(4, 'Users', 'people', '/users', NULL, 4, 1),
(5, 'Reports', 'document-text', '/reports', NULL, 5, 1),
(6, 'Change Password', 'lock-closed', '/change-password', NULL, 6, 1),
(7, 'Settings', 'settings', '/settings', NULL, 7, 1);
SET IDENTITY_INSERT Menus OFF;

INSERT INTO RoleMenus (RoleId, MenuId) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),
(2,1),(2,2),(2,3),(2,4),(2,6),(2,7),
(3,1),(3,2),(3,6),(3,7);


