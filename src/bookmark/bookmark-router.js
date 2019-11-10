const express = require('express');
const validator = require('validator');
const logger = require('../logger');
const xss = require('xss');
const BookmarksService = require('./bookmarks-service');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks.map(serializeBookmark));
    })
    .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const { title, rating, url, desc } = req.body;

    if (rating) {
      let num = parseInt(rating);
      if (isNaN(num) || num < 0 || num > 5) {
        logger.error(`A Numerical Rating Between 0 and 5 is Required`);
        return res
          .status(400)
          .send({ 
            error: { message: `'rating' must be a number between 0 and 5` }
          });
      }
    } 

    if (!validator.isURL(url)) {
      logger.error(`A Valid URL is Required`);
      return res
        .status(400)
        .send({
          error: { message: `'url' must be a valid URL` }
        });
    }    
 
    const newBookmark = { title, url, description, rating }
    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created.`)
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
   })

bookmarkRouter
  .route('/bookmarks/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    BookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res.status(404)
            .json(
            {
              error: { message: 'Bookmark Not Found'}
            });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    BookmarksService.deleteBookmark(
      req.app.get('db'),
      id
    )
      .then(numRowsAffected => {
        logger.info(`Bookmark with id ${id} deleted.`)
        res.status(204)
        .end()
      })
      .catch(next)
  });

module.exports = bookmarkRouter
