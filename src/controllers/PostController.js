import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel
      .find()
      .populate('user')
      .exec()

    res.json(posts)
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось загрузить статьи',
      })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel
      .find()
      .limit(5)
      .exec()

    const tags = posts
      .map(obj => obj.tags)
      .flat()
      .slice(0, 5)

    res.json(Array.from(new Set(tags)))
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось загрузить теги',
      })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    const doc = await PostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $inc: { viewsCount: 1 },
        },
        {
          returnDocument: 'after',
        },
      )
      .populate('user')


    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      })
    }

    res.json(doc)
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось загрузить статью',
      })
  }
}

export const create = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body

    const doc = new PostModel({
      title,
      text,
      tags,
      imageUrl,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось создать статью',
      })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const { title, text, tags, imageUrl } = req.body

    const doc = await PostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          title,
          text,
          tags,
          imageUrl,
          user: req.userId,
        }
      )

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      })
    }

    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось обновить статью',
      })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    const doc = await PostModel.findOneAndDelete(
      {
        _id: postId,
      },
    )

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      })
    }

    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: 'Не удалось удалить статью',
      })
  }
}
