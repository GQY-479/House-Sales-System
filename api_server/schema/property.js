const Joi = require('joi')

const propertySchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  size: Joi.number().required(),
  unit_price: Joi.number().required(),
  total_price: Joi.number().required(),
  layout: Joi.string().valid('1居', '2居', '3居', '4居', '5居', '5居+').required(),
  opening_date: Joi.string().valid('近期开盘', '未来一个月', '未来三个月', '未来半年', '过去一个月', '过去三个月').required(),
  property_type: Joi.string().valid('住宅', '别墅', '商业', '写字楼', '底商').required(),
  house_status: Joi.string().valid('在售', '未开盘', '售罄').required(),
  decoration: Joi.string().valid('带装修', '毛坯', '简装', '精装').required(),
  features: Joi.string().valid('地铁', '学区', '商圈', '公园', '医院', '景观')
})

const fileSchema = Joi.object({
  path: Joi.string().required(),
  description: Joi.string(),
})

const houseRelease = Joi.object({
  property: propertySchema,
  file: fileSchema
})

const id = Joi.object({
    id: Joi.number().required()
})


module.exports = { propertySchema, fileSchema, houseRelease, id };
