const express = require('express')
// 创建路由对象
const router = express.Router()

// Import property handler
const propertyHandler = require('../router_handler/property.js')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { houseRelease, id } = require('../schema/property')

// 文件转url
const multer = require('multer')

const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.tempId) {
      req.tempId = uuidv4() // Generate tempId only once for multiple images
    }
    const uploadPath = `uploads/${req.tempId}`

    // Create the subfolder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true })

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

// Create PropertyListing route with validation middleware
router.post('/create', expressJoi(houseRelease), upload.array('house_images[]'), propertyHandler.createListing)

router.get('/list', expressJoi(houseRelease), propertyHandler.getHousesWithPagination)

router.get('/getHouse', expressJoi(id), propertyHandler.getHouseById)

router.get('/houseAgent', expressJoi(id), propertyHandler.getAgentByHouseId)

router.get('/houseAgentManage', propertyHandler.getHousesByAgentId)

router.get('/propertyOwnerHouses', propertyHandler.getHousesByPropertyOwner)

router.get('/houseViewAgentManage', propertyHandler.getHouseViewingsByAgentId)

router.post('/updateHouseViewing', propertyHandler.updateHouseViewing)

router.get('/agentDeals', propertyHandler.getDealsByAgentId)

router.get('/customerDeals', propertyHandler.getDealsByCustomerId)

router.post('/updateDeal', propertyHandler.updateDeal)

router.post('/viewHouse', propertyHandler.viewHouse)

router.post('/createDeal', propertyHandler.createDeal)
// Edit PropertyListing route with validation middleware
// router.put('/edit/:id', expressJoi(property_schema), propertyHandler.editListing)
// // Delete PropertyListing route with validation middleware
// router.delete('/delete/:id', expressJoi(property_schema), propertyHandler.deleteListing)
// // View PropertyListing route with validation middleware
// router.get('/view/:id', expressJoi(property_schema), propertyHandler.viewListing)
// // List all PropertyListings route with validation middleware
// router.get('/list', expressJoi(property_schema), propertyHandler.listAll)

/*
Create Property Listing: Sellers should be able to create a new property listing by providing essential information such as property type, location, price, images, and a description. You would need to create a route and handler for this, such as router.post('/create', propertyHandler.createListing).

Edit Property Listing: Sellers should be able to edit their property listings to update information or correct any errors. This can be achieved by creating a route and handler for editing listings, such as router.put('/edit/:id', propertyHandler.editListing).

Delete Property Listing: Sellers should be able to delete their property listings when they are no longer relevant or have been sold. You would need a route and handler for this, such as router.delete('/delete/:id', propertyHandler.deleteListing).

View Property Listing: Both buyers and sellers should be able to view individual property listings with all the relevant details. This can be achieved by creating a route and handler for fetching a single property listing, such as router.get('/view/:id', propertyHandler.viewListing).

List All Property Listings: The system should provide a way to fetch and display all property listings, possibly with pagination to handle large numbers of listings. You would need a route and handler for this, such as router.get('/list', propertyHandler.listAll).
*/

// Export the router object
module.exports = router
