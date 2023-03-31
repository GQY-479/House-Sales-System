// propertyHandler.js

// Import necessary modules
// const db = require('../db')
const db = require('../db/index')
const Joi = require('joi')

const fs = require('fs')



const createImages = async (house_id, images) => {
  try {
    const sql = 'INSERT INTO HouseImage (house_id, url, description) VALUES (?, ?, ?)'

    for (const image of images) {
      const { url, description } = image
      await new Promise((resolve, reject) => {
        db.query(sql, [house_id, url, description], (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error creating images')
  }
}

const createListing = async (req, res) => {
  try {
    // Data validation is already done in a middleware

    // Extract the necessary data from the request body
    const { location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, description } = req.body

    // Insert the new property listing into the database
    const sql = 'INSERT INTO House (location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)'
    db.query(sql, [location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration, description], async (err, result) => {
      if (err) {
        console.log(err)
        // Return an error message
        res.status(500).json({ message: 'Error creating property listing' })
      } else {

        const oldPath = `uploads/${req.tempId}`
        const newPath = `uploads/${result.insertId}`
        fs.renameSync(oldPath, newPath)
        // Generate image URLs
        const images = req.files.map(file => ({
          url: '/' + newPath + '/' + file.filename,
          description: '', // Add a description if needed
        }))

        try {

          await createImages(result.insertId, images)
          // check if user has the role of propertyOwner
          if (!req.auth.role.includes('propertyOwner')) {
            // let user have the role 'propertyOwner'
            const sql = 'INSERT INTO UserRole (user_id, role_name) VALUES (?, ?)'
            db.query(sql, [req.auth.id, 'propertyOwner'], (err, result) => {
              if (err) {
                console.log(err)
                res.status(500).json({ message: 'Error creating property listing' })
              } else {
                res.status(200).json({ message: 'Property listing created successfully' })
              }
            })
          }
          else {// Return a success message
            res.status(201).json({ message: 'Property listing created successfully', propertyId: result.insertId })
          }
        }
        catch (error) {
          console.log(error)
          res.status(500).json({ message: 'Error creating images for the property listing' })
        }
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating property listing' })
  }
}

// get house by id
const getHouseById = async (req, res) => {
  try {
      // console.log(req.query.houseId)
    const houseId = req.query.houseId
    const sql = 'SELECT * FROM House WHERE id = ?'
    db.query(sql, [houseId], async (err, [house]) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching house information' })
      } else {
        if (!house) {
          res.status(404).json({ message: 'House not found' })
        } else {
          const imagesSql = 'SELECT * FROM HouseImage WHERE house_id = ?'
          db.query(imagesSql, [houseId], (err, images) => {
            if (err) {
              res.status(500).json({ message: 'Error fetching house images' })
            } else {
              house.images = images
              res.status(200).json({ message: 'House information and images', house })
            }
          })
        }
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching house information' })
  }
}

// get agent that manage the house
const getAgentByHouseId = async (req, res) => {
    
  try {
    const houseId = req.query.houseId
    const sql = 'SELECT agent_id FROM agenthouse WHERE house_id = ?'
    db.query(sql, [houseId], async (err, [agent]) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching agent information' })
      } else {
        if (!agent) {
          res.status(404).json({ message: 'Agent not found' })
        } else {
          res.status(200).json({ message: 'Agent information', agent })
        }
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agent information' })
  }
}



// get all houses of a propertyOwner 
const getHousesByPropertyOwner = async (req, res) => {
    
  try {
    const propertyOwnerId = req.auth.id
    const sql = 'SELECT * FROM propertyhouse WHERE property_owner_id = ?'
    db.query(sql, [propertyOwnerId], async (err, houses) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching houses of property owner' })
      } else {
        res.status(200).json({ message: 'Houses of property owner', houses })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching houses of property owner' })
  }
}

// get all houses an agnet manages
// get all houses an agnet manages according to this:

const getHousesByAgentId = async (req, res) => {
    
  try {
    // const agentId = req.query.agentId
    const agentId = req.auth.id
    const sql = 'SELECT id, location, size, unit_price, total_price, layout, opening_date, property_type, house_status, decoration FROM House WHERE id IN (SELECT house_id FROM agenthouse WHERE agent_id = ?)'
    db.query(sql, [agentId], async (err, houses) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching houses managed by agent' })
      } else {
        res.status(200).json({ message: 'Houses managed by agent', houses })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching houses managed by agent' })
  }
}
    
    // view house : a customer to view a house
// create a new record in the view table
const viewHouse = async (req, res) => {
    
  try {
    const { house_id, customer_id, agent_id, scheduled_at } = req.body;
      console.log(scheduled_at)
    const sql = 'INSERT INTO houseviewing (house_id, customer_id, agent_id, scheduled_at) VALUES (?, ?, ?, ?)';
    db.query(sql, [house_id, customer_id, agent_id, scheduled_at], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Error viewing house' });
      } else {
        res.status(200).json({ message: 'House viewed successfully' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error viewing house' });
  }
};

// get all house viewing an agnet manages
// get all house viewing an agnet manages

const getHouseViewingsByAgentId = async (req, res) => {
    
  try {
    // const agentId = req.query.agentId
    const agentId = req.auth.id
    const sql = 'SELECT * FROM houseviewing WHERE agent_id = ?'
    db.query(sql, [agentId], async (err, houseViewings) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching house viewings managed by agent' })
      } else {
        res.status(200).json({ message: 'House viewings managed by agent', houseViewings })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching house viewings managed by agent' })
  }
}

// update house viewing
// update house viewing

const updateHouseViewing = async (req, res) => {
  try {
    const { house_id, customer_id, agent_id, scheduled_at, house_view_id } = req.body;
    // const sql = 'UPDATE houseviewing SET scheduled_at = ? WHERE house_id = ? AND customer_id = ? AND agent_id = ?';
    const sql = 'UPDATE houseviewing SET scheduled_at = ? WHERE id = ?';
    db.query(sql, [scheduled_at, house_view_id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating house viewing' });
      } else {
        res.status(200).json({ message: 'House viewing updated successfully' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating house viewing' });
  }
};

// create a new deal
const createDeal = async (req, res) => {
    
  try {
    // Extract the necessary data from the request body
    const { house_id, agent_id, customer_id, property_owner_id, status, deal_date, price } = req.body
      console.log(price)

    // Insert the new deal into the database
    const sql = 'INSERT INTO deal (house_id, agent_id, customer_id, property_owner_id, status, deal_date, price) VALUES (?, ?, ?, ?, ?, ?,?)'
    db.query(sql, [house_id, agent_id, customer_id, property_owner_id, status, deal_date, price], async (err, result) => {
      if (err) {
        console.log(err)
        // Return an error message
        res.status(500).json({ message: 'Error creating deal' })
      } else {
        // Return a success message
        res.status(201).json({ message: 'Deal created successfully', dealId: result.insertId })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating deal' })
  }
}



// get all deals of a agent
const getDealsByAgentId = async (req, res) => {
    
    try {
    // const agentId = req.query.agentId
    const agentId = req.auth.id
    const sql = 'SELECT * FROM deal WHERE agent_id = ?'
    db.query(sql, [agentId], async (err, deals) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching deals managed by agent' })
      } else {
        res.status(200).json({ message: 'Deals managed by agent', deals })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deals managed by agent' })
  }
}

// get all deals of a customer
const getDealsByCustomerId = async (req, res) => {
    try {
    // const customerId = req.query.agentId
    const customerId = req.auth.id
    const sql = 'SELECT * FROM deal WHERE customer_id = ?'
    db.query(sql, [customerId], async (err, deals) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching deals of a customer' })
      } else {
        res.status(200).json({ message: 'Deals of a customer', deals })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deals of a customer' })
  }
}

// update deal
const updateDeal = async (req, res) => {
    
  try {
    const { deal_id, house_id, agent_id, customer_id, property_owner_id, status, deal_date, price } = req.body

    // const sql = 'UPDATE deal SET house_id = ?, agent_id = ?, customer_id = ?, property_owner_id = ?, status = ?, deal_date = ?, price = ? WHERE id = ?'
    const sql = 'UPDATE deal SET status = ?, deal_date = ?, price = ? WHERE id = ?'
    db.query(sql, [status, deal_date, price, deal_id], async (err, result) => {
      if (err) {
        console.log(err)
        // Return an error message
        res.status(500).json({ message: 'Error updating deal' })
      } else {
        // Return a success message
        res.status(200).json({ message: 'Deal updated successfully' })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating deal' })
  }
}


//The format of require and respond by commenting for the function getHouseWithPagination:

// Route: GET /houses
// Description: Get a list of houses with pagination
// Request:
// - query:
//   - page: number (optional, default: 1)
//   - limit: number (optional, default: 10)
// Response:
// - status: 200
// - body:
//   - message: string
//   - houses: array of objects (each object represents a house)
//     - id: number
//     - location: string
//     - size: number
//     - unit_price: number
//     - total_price: number
//     - layout: string
//     - opening_date: string (in the format of 'YYYY-MM-DD')
//     - property_type: string
//     - house_status: string
//     - decoration: string
//     - description: string
//     - images: array of objects (each object represents an image)
//       - id: number
//       - house_id: number
//       - url: string
//       - description: string

const getHousesWithPagination = async (req, res) => {

  try {
    // Get the page number and limit from the request query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3

    // Calculate the offset for pagination
    const offset = (page - 1) * limit

    // Get the houses from the database with pagination
    const sql = 'SELECT * FROM House LIMIT ? OFFSET ?'
    db.query(sql, [limit, offset], (err, houses) => {
      if (err) {
        // Return an error message
        res.status(500).json({ message: 'Error fetching houses with pagination' })
      } else {
        // Return the paginated houses
        for (let i = 0; i < houses.length; i++) {
          const house = houses[i]
          db.query('SELECT * FROM HouseImage WHERE house_id = ?', [house.id], (err, [images]) => {
            if (err) {
              // Return an error message
              res.status(500).json({ message: 'Error fetching house images' })
            } else {
              house.images = images
              if (i === houses.length - 1) {
                res.status(200).json({ message: 'Houses with pagination', houses })
              }
            }
          })
        }
      }
    })
  } catch (err) {
    // Return an error message
    res.status(500).json({ message: 'Error fetching houses with pagination' })
  }
}


const searchHouseByName = async (req, res) => {
  try {
    // Get the house name, page number, and limit from the request query
    const houseName = req.query.name
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    // Calculate the offset for pagination
    const offset = (page - 1) * limit

    // Search for houses with the given name in the database with pagination
    const [houses] = await db.promise().query('SELECT * FROM House WHERE housename LIKE ? LIMIT ? OFFSET ?', [`%${houseName}%`, limit, offset])

    // Return the search results with pagination
    res.status(200).json({ message: 'Search results with pagination', houses })
  } catch (err) {
    // Return an error message
    res.status(500).json({ message: 'Error searching for house information with pagination' })
  }
}



module.exports = {
  createListing,
  searchHouseByName,
  getHousesWithPagination,
    getHouseById,
    getAgentByHouseId,
    viewHouse,
    createDeal,
    getHousesByPropertyOwner,
    getHousesByAgentId,
    getHouseViewingsByAgentId,
    getDealsByAgentId,
    getDealsByCustomerId,
    updateHouseViewing,
    updateDeal
}


