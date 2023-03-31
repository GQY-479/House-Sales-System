Table House {
    
  id INT [pk increment]
  title VARCHAR(255)
  description TEXT
  location VARCHAR(255) [not null]
  size DECIMAL(10,2) [not null]
  unit_price DECIMAL(10,2) [not null]
  total_price DECIMAL(10,2) [not null]
  layout ENUM('1居', '2居', '3居', '4居', '5居', '5居+') [not null]
  opening_date ENUM('近期开盘', '未来一个月', '未来三个月', '未来半年', '过去一个月', '过去三个月') [not null]
  property_type ENUM('住宅', '别墅', '商业', '写字楼', '底商') [not null]
  house_status ENUM('在售', '未开盘', '售罄') [not null]
  decoration ENUM('带装修', '毛坯', '简装', '精装') [not null]
  features text [check in ('地铁', '学区', '商圈', '公园', '医院', '景观')]
}

Table HouseImage {
  id INT [pk increment]
  house_id INT
  url VARCHAR(255) [not null]
  description VARCHAR(255)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table User {
  id INT [pk increment]
  username VARCHAR(255) [not null unique]
  password VARCHAR(255) [not null]
}

Table UserRole {
  user_id INT
  role_name ENUM('customer', 'propertyOwner', 'agent') [not null]
  PRIMARY KEY (user_id, role_name)
  FOREIGN KEY (user_id) REFERENCES User(id)
}

Table ClientInfo {
  id INT [pk increment]
  name VARCHAR(255)
  phone VARCHAR(255) [unique]
  email VARCHAR(255) [not null unique]
}

Table Customer {
  user_id INT [pk]
  client_info_id INT
  FOREIGN KEY (user_id) REFERENCES User(id)
  FOREIGN KEY (client_info_id) REFERENCES ClientInfo(id)
}

Table PropertyOwner {
  user_id INT [pk]
  client_info_id INT
  FOREIGN KEY (user_id) REFERENCES User(id)
  FOREIGN KEY (client_info_id) REFERENCES ClientInfo(id)
}

Table Agent {
  user_id INT [pk]
  name VARCHAR(255) [not null]
  phone VARCHAR(255) [not null unique]
  email VARCHAR(255) [not null unique]
  company VARCHAR(255) [not null]
  introduction TEXT
  position VARCHAR(45)
  FOREIGN KEY (user_id) REFERENCES User(id)
}

Table BrowseHistory {
  customer_id INT
  house_id INT
  viewed_at DATETIME [not null]
  PRIMARY KEY (customer_id, house_id)
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table FavoriteHouse {
  customer_id INT
  house_id INT
  favorited_at DATETIME [not null]
  PRIMARY KEY (customer_id, house_id)
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table Property {
  id INT [pk increment]
  property_owner_id INT
  house_id INT
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table HouseViewing {
  id INT [pk increment]
  house_id INT
  customer_id INT
  agent_id INT
  scheduled_at DATETIME [not null]
  FOREIGN KEY (house_id) REFERENCES House(id)
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id)
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
}

Table AgentHouse {
  agent_id INT
  house_id INT [unique]
  PRIMARY KEY (agent_id, house_id)
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table Commission {
  id INT [pk increment]
  agent_id INT
  house_id INT
  amount DECIMAL(10, 2) [not null]
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
  FOREIGN KEY (house_id) REFERENCES House(id)
}

Table Deal {
  id INT [pk increment]
  house_id INT [not null]
  agent_id INT [not null]
  customer_id INT [not null]
  property_owner_id INT [not null]
  status ENUM('done', 'underway', 'drop') [not null]
  deal_date DATE
  price DECIMAL(10,2)
  FOREIGN KEY (house_id) REFERENCES House(id)
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id)
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id)
}

Table Conversation {
  id INT [pk increment]
  customer_id INT
  property_owner_id INT
  agent_id INT
  FOREIGN KEY (customer_id) REFERENCES Customer(user_id)
  FOREIGN KEY (property_owner_id) REFERENCES PropertyOwner(user_id)
  FOREIGN KEY (agent_id) REFERENCES Agent(user_id)
}

Table Message {
  id INT [pk increment]
  conversation_id INT
  sender_id INT
  content TEXT [not null]
  sent_at DATETIME [not null]
  FOREIGN KEY (conversation_id) REFERENCES Conversation(id)
  FOREIGN KEY (sender_id) REFERENCES User(id)
}
