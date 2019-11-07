const express = require('express');
const uuid = require('uuid/v4');
const validator = require('validator');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, rating, url, desc } = req.body;
    if (!title) {
      logger.error(`A Title is Required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!rating) {
      logger.error(`A Rating is Required`);
      return res
        .status(400)
        .send('Invalid data');
    } 

    if (rating) {
      let num = parseInt(rating);
      if (isNaN(num) || num < 0 || num > 5) {
        logger.error(`A Numerical Rating Between 0 and 5 is Required`);
        return res
          .status(400)
          .send('Invalid data');
      }
    } 

    if (!url) {
      logger.error(`A URL is Required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!validator.isURL(url)) {
      logger.error(`A Valid URL is Required`);
      return res
        .status(400)
        .send('Invalid data');
    }    

    if (!desc) {
      logger.error(`A Description is Required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    let id = uuid();
    let bookmark = {
      id: id,
      title: title,
      rating: rating,
      url: url,
      desc: desc 
    }
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
   })

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('404 Not Found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
    bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter
