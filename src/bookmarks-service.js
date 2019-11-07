const BookmarksService = {
  getAllBookmarks(knex) {
    return knex
             .select('*')
             .from('bookmarks');
  },
  getById(knex, id) {
    return knex.from('bookmarks').select('*').where('id', id).first();
  },
/*  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete()
  },
  updateArticle(knex, id, newArticleFields) {
    return knex('blogful_articles')
      .where({ id })
      .update(newArticleFields)
  },  
 */}

module.exports = BookmarksService
