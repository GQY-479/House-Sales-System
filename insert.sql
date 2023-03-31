insert data into tables
INSERT INTO House (title, description, location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, features) VALUES 
('Luxury Apartment in Downtown', 'This is a luxury apartment located in the heart of downtown.', 'Downtown', 100.00, 10000.00, 1000000.00, '2居', '近期开盘', '住宅', '在售', '精装', '地铁'),
('Spacious Villa with Garden', 'This is a spacious villa with a beautiful garden.', 'Suburb', 300.00, 20000.00, 6000000.00, '4居', '未来三个月', '别墅', '在售', '精装', '公园'),
('Office Space in CBD', 'This is an office space located in the central business district.', 'CBD', 500.00, 15000.00, 7500000.00, '写字楼', '未来半年', '商业', '在售', '简装', '商圈'),
('Retail Space in Shopping Mall', 'This is a retail space located in a popular shopping mall.', 'Shopping Mall', 200.00, 25000.00, 5000000.00, '底商', '过去一个月', '商业', '售罄', '带装修', '商圈');

INSERT INTO HouseImage (house_id, url, description) VALUES 
(1, 'https://example.com/house1-1.jpg', 'Living Room'),
(1, 'https://example.com/house1-2.jpg', 'Bedroom'),
(1, 'https://example.com/house1-3.jpg', 'Kitchen'),
(2, 'https://example.com/house2-1.jpg', 'Living Room'),
(2, 'https://example.com/house2-2.jpg', 'Bedroom'),
(2, 'https://example.com/house2-3.jpg', 'Garden'),
(3, 'https://example.com/house3-1.jpg', 'Office Space'),
(4, 'https://example.com/house4-1.jpg', 'Retail Space');


INSERT INTO House (title, description, location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, features) VALUES 
('Luxury Apartment in Downtown', 'This is a luxury apartment located in the heart of downtown.', 'Downtown', 100.00, 10000.00, 1000000.00, '2居', '近期开盘', '住宅', '在售', '精装', '地铁'),
('Spacious Villa with Garden', 'This is a spacious villa with a beautiful garden.', 'Suburb', 300.00, 20000.00, 6000000.00, '4居', '未来三个月', '别墅', '在售', '精装', '公园'),
('Office Space in CBD', 'This is an office space located in the central business district.', 'CBD', 500.00, 15000.00, 7500000.00, '写字楼', '未来半年', '商业', '在售', '简装', '商圈'),
('Retail Space in Shopping Mall', 'This is a retail space located in a popular shopping mall.', 'Shopping Mall', 200.00, 25000.00, 5000000.00, '底商', '过去一个月', '商业', '售罄', '带装修', '商圈');

INSERT INTO HouseImage (house_id, url, description) VALUES 
(1, 'https://example.com/house1-1.jpg', 'Living Room'),
(1, 'https://example.com/house1-2.jpg', 'Bedroom'),
(1, 'https://example.com/house1-3.jpg', 'Kitchen'),
(2, 'https://example.com/house2-1.jpg', 'Living Room'),
(2, 'https://example.com/house2-2.jpg', 'Bedroom'),
(2, 'https://example.com/house2-3.jpg', 'Garden'),
(3, 'https://example.com/house3-1.jpg', 'Office Space'),
(4, 'https://example.com/house4-1.jpg', 'Retail Space');

INSERT INTO ClientInfo (name, phone, email) VALUES 
('John Doe', '12345678901', 'johndoe@example.com'),
('Jane Smith', '23456789012', 'janesmith@example.com'),
('Bob Johnson', '34567890123', 'bobjohnson@example.com');

INSERT INTO UserRole (user_id, role_name) VALUES 
(1, 'agent'),
(2, 'customer'),
(3, 'propertyOwner');

INSERT INTO Customer (user_id, client_info_id) VALUES 
(2, 1);

INSERT INTO PropertyOwner (user_id, client_info_id) VALUES 
(3, 2);

INSERT INTO AgentHouse (agent_id, house_id) VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4);

INSERT INTO Commission (agent_id, house_id, amount) VALUES 
(1, 1, 10000.00),
(1, 2, 20000.00),
(1, 3, 15000.00),
(1, 4, 25000.00);

INSERT INTO Deal (house_id, agent_id, customer_id, property_owner_id, status, deal_date, price) VALUES 
(1, 1, 2, 3, 'done', '2021-01-01', 900000.00),
(2, 1, 2, 3, 'underway', NULL, NULL),
(3, 1, 2, 3, 'drop', NULL, NULL),
(4, 1, 2, 3, 'done', '2021-02-01', 4500000.00);

INSERT INTO Agent (user_id, name, phone, email, company, introduction, position) VALUES 
(1, 'John Smith', '98765432109', 'johnsmith@example.com', 'ABC Real Estate', 'I have been working in the real estate industry for 10 years.', 'Senior Agent');

INSERT INTO House (title, description, location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, features) VALUES 
('Cozy Apartment in Suburb', 'This is a cozy apartment located in the peaceful suburb.', 'Suburb', 80.00, 8000.00, 640000.00, '1居', '未来一个月', '住宅', '在售', '简装', '公园'),
('Luxury Villa with Pool', 'This is a luxury villa with a private pool.', 'Suburb', 500.00, 30000.00, 15000000.00, '5居+', '未来半年', '别墅', '在售', '精装', '公园'),
('Office Space in Financial District', 'This is an office space located in the financial district.', 'Financial District', 800.00, 20000.00, 16000000.00, '写字楼', '未来三个月', '商业', '在售', '精装', '商圈'),
('Retail Space in High-end Shopping Mall', 'This is a retail space located in a high-end shopping mall.', 'High-end Shopping Mall', 300.00, 35000.00, 10500000.00, '底商', '未来一个月', '商业', '在售', '带装修', '商圈');

INSERT INTO HouseImage (house_id, url, description) VALUES 
(5, 'https://example.com/house5-1.jpg', 'Living Room'),
(5, 'https://example.com/house5-2.jpg', 'Bedroom'),
(5, 'https://example.com/house5-3.jpg', 'Kitchen'),
(6, 'https://example.com/house6-1.jpg', 'Living Room'),
(6, 'https://example.com/house6-2.jpg', 'Bedroom'),
(6, 'https://example.com/house6-3.jpg', 'Pool'),
(7, 'https://example.com/house7-1.jpg', 'Office Space'),
(8, 'https://example.com/house8-1.jpg', 'Retail Space');

-- INSERT INTO ClientInfo (name,('Alice Brown', '45678901234', 'alicebrown@example.com');