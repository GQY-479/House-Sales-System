-- tables for house sale system
use housesales;

CREATE TABLE House (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  location VARCHAR(255) NOT NULL,
  size DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  layout ENUM('1居', '2居', '3居', '4居', '5居', '5居+') NOT NULL,
  opening_date ENUM('近期开盘', '未来一个月', '未来三个月', '未来半年', '过去一个月', '过去三个月') NOT NULL,
  property_type ENUM('住宅', '别墅', '商业', '写字楼', '底商') NOT NULL,
  house_status ENUM('在售', '未开盘', '售罄') NOT NULL,
  decoration ENUM('带装修', '毛坯', '简装', '精装') NOT NULL,
  features ENUM('地铁', '学区', '商圈', '公园', '医院', '景观')
);

-- -- I need to use English when convert the sql to edml
-- CREATE TABLE House (
-- id INT PRIMARY KEY AUTO_INCREMENT,
-- title VARCHAR(255),
-- description TEXT,
-- location VARCHAR(255) NOT NULL,
-- size DECIMAL(10,2) NOT NULL,
-- unit_price DECIMAL(10,2) NOT NULL,
-- total_price DECIMAL(10,2) NOT NULL,
-- layout ENUM('1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5 bedrooms', '5 bedrooms or more') NOT NULL,
-- opening_date ENUM('recently opened', 'within one month', 'within three months', 'within six months', 'past one month', 'past three months') NOT NULL,
-- property_type ENUM('residential', 'villa', 'commercial', 'office building', 'commercial ground floor') NOT NULL,
-- house_status ENUM('on sale', 'not yet open', 'sold out') NOT NULL,
-- decoration ENUM('with decoration', 'bare shell', 'simple decoration', 'high-end decoration') NOT NULL,
-- features ENUM('subway', 'school district', 'business district', 'park', 'hospital', 'scenery')
-- );

CREATE TABLE HouseImage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  house_id INT,
  url VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  FOREIGN KEY (house_id) REFERENCES House(id)
);

-- alter table house add column title VARCHAR(255);
-- alter table house add column description TEXT;
-- drop table house;


-- User System

CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE UserRole (
  user_id INT,
  role_name ENUM('customer', 'propertyOwner', 'agent') NOT NULL,
  PRIMARY KEY (user_id, role_name),
  FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE ClientInfo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  phone VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Customer (
  user_id INT PRIMARY KEY,
  client_info_id INT,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (client_info_id) REFERENCES ClientInfo(id)
);

CREATE TABLE PropertyOwner (
  user_id INT PRIMARY KEY,
  client_info_id INT,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (client_info_id) REFERENCES ClientInfo(id)
);

CREATE TABLE Agent (
  user_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255) NOT NULL,
  introduction TEXT,
  position VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES User(id)
);

-- For Customers

CREATE TABLE BrowseHistory (
  customer_id INT,
  house_id INT,
  viewed_at DATETIME NOT NULL,
  PRIMARY KEY (customer_id, house_id),
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
  FOREIGN KEY (house_id) REFERENCES House(id)
);

CREATE TABLE FavoriteHouse (
  customer_id INT,
  house_id INT,
  favorited_at DATETIME NOT NULL,
  PRIMARY KEY (customer_id, house_id),
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
  FOREIGN KEY (house_id) REFERENCES House(id)
);

-- For PropertyOwner 


CREATE TABLE Property (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_owner_id INT,
  house_id INT,
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id),
  FOREIGN KEY (house_id) REFERENCES House(id)
);



-- Manage house viewings: To store scheduled house viewings
CREATE TABLE HouseViewing (
    
  id INT PRIMARY KEY AUTO_INCREMENT,
  house_id INT,
  customer_id INT,
  agent_id INT,
  scheduled_at DATETIME NOT NULL,
  FOREIGN KEY (house_id) REFERENCES House(id),
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
);

-- drop table HouseViewing;

-- For Agents:


-- Manage house viewings: To store scheduled house viewings

-- houses that the agent is responsible for
CREATE TABLE AgentHouse (
  agent_id INT,
  house_id INT unique,
  PRIMARY KEY (agent_id, house_id),
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id),
  FOREIGN KEY (house_id) REFERENCES House(id)
);

-- Track performance and commissions: To store agent commissions
CREATE TABLE Commission (
  id INT PRIMARY KEY AUTO_INCREMENT,
  agent_id INT,
  house_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id),
  FOREIGN KEY (house_id) REFERENCES House(id)
);

CREATE TABLE Deal (
  id INT PRIMARY KEY AUTO_INCREMENT,
  house_id INT NOT NULL,
  agent_id INT NOT NULL,
  customer_id INT NOT NULL,
  property_owner_id INT NOT NULL,
  status ENUM('done', 'underway', 'drop') NOT NULL,
  deal_date DATE,
  price DECIMAL(10,2),
  FOREIGN KEY (house_id) REFERENCES House(id),
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id),
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id)
);

-- drop table Deal;

CREATE TABLE Conversation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  property_owner_id INT,
  agent_id INT,
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id),
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
);

CREATE TABLE Message (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT,
  sender_id INT,
  content TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES Conversation(id),
  FOREIGN KEY (sender_id) REFERENCES User(id)
);


CREATE VIEW ClientInfoCP AS
SELECT ci.id AS client_info_id, ci.name, ci.phone, ci.email, c.user_id AS customer_id, po.user_id AS property_owner_id
FROM ClientInfo ci
LEFT JOIN Customer c ON ci.id = c.client_info_id
LEFT JOIN PropertyOwner po ON ci.id = po.client_info_id;


-- a tuple only has one image
CREATE VIEW HouseWithImages AS
SELECT h.id, h.title, h.description, h.location, h.size, h.unit_price, h.total_price, h.layout, h.opening_date, h.property_type, h.house_status, h.decoration, h.features, hi.url, hi.description AS image_description
FROM House h
LEFT JOIN HouseImage hi ON h.id = hi.house_id;

CREATE VIEW CustomerFavorites AS
SELECT c.user_id, ci.name, ci.phone, ci.email, h.title, h.location, h.total_price, fh.favorited_at
FROM Customer c
JOIN ClientInfo ci ON c.client_info_id = ci.id
JOIN FavoriteHouse fh ON c.user_id = fh.customer_id
JOIN House h ON fh.house_id = h.id;

CREATE VIEW AgentCommissions AS
SELECT a.user_id, a.name, a.phone, a.email, a.company, a.introduction, c.amount, c.house_id, c.id AS commission_id
FROM Agent a
JOIN Commission c ON a.user_id = c.agent_id;

CREATE VIEW HouseAgentManage AS
SELECT h.id, h.title, h.description, h.location, h.size, h.unit_price, h.total_price, h.layout, h.opening_date, h.property_type, h.house_status, h.decoration, h.features, ah.agent_id
FROM House h
LEFT JOIN AgentHouse ah ON h.id = ah.house_id;

-- a view that combines table property and house
CREATE VIEW PropertyHouse AS
    
SELECT p.id AS property_id, h.id AS house_id, h.title, h.description, h.location, h.size, h.unit_price, h.total_price, h.layout, h.opening_date, h.property_type, h.house_status, h.decoration, h.features, p.property_owner_id
FROM Property p
JOIN House h ON p.house_id = h.id;

-- drop view PropertyHouse;




