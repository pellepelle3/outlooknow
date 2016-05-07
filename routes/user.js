'use strict'
let routes = []
let Joi = require('joi')
let api = require('../api')

routes.push({
  method: 'GET',
  path: '/user',
  config:{
    description: 'Get users',
    tags: ['api','user'],
    handler: api.users.list,
    validate:{
      query:{
        limit: Joi.number().default(100),
        offset: Joi.number().default(0)
      }
    }
  }
})

routes.push({
  method: 'GET',
  path: '/user/{id}',
  config:{
    description: 'Get user',
    tags: ['api','user'],
    handler: api.users.get,
    validate:{
      params:{
        id: Joi.number().min(0)
      }
    }
  }
})

routes.push({
  method: 'POST',
  path: '/user/email',
  config:{
    description: 'User Find by email',
    tags: ['api','user'],
    handler: api.users.infoByEmail,
    validate:{
      payload:{
        email: Joi.string().required()
      }
    }
  }
})

routes.push({
  method: 'POST',
  path: '/user',
  config:{
    description: 'User create',
    tags: ['api','user'],
    handler: api.users.create,
    validate:{
      payload:{
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().allow('').required(),
        note: Joi.string().allow('').default('')
      }
    }
  }
})



routes.push({
  method: 'PUT',
  path: '/user/{id}',
  config:{
    description: 'User update ',
    tags: ['api','user'],
    handler: api.users.update,
    validate:{
      params:{
        id: Joi.number()
      },
      payload:{
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string(),
        phoneNumber: Joi.string().allow(''),
        note: Joi.string().allow('')
      }
    }
  }
})

routes.push({
  method: 'DELETE',
  path: '/user/{id}',
  config:{
    description: 'User delete',
    tags: ['api','user'],
    handler: api.users.delete,
    validate:{
      params:{
        id: Joi.number()
      }
    }
  }
})


module.exports = routes