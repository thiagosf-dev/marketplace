const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    const filters = {}

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min // preços maiores do que (método do mongoose)
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max // preços menor do que (método do mongoose)
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i') // 'i' transforma para caseInsensitive
    }

    // find padrão sem paginação
    // const ads = await Ad.find()

    // find do plugin paginate (adiciona paginação)
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt',
      populate: ['author']
    })

    return res.json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json(ad)
  }

  async store (req, res) {
    const ad = await Ad.create({
      ...req.body,
      author: req.userId
    })

    return res.json(ad)
  }

  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }

  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.json('record deleted')
  }
}

module.exports = new AdController()
