const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const commentData = require('./comments')

const validateComment = function(comment) {
  if (!comment || typeof comment != 'object') {
    throw 'You must provide valid comment';
  }

  if (!comment.userId || typeof comment.userId != "string" || !mongoDB.ObjectID.isValid(comment.userId)) {
    throw 'You must provide valid userId';
  }

  if (!comment.datePosted || typeof comment.datePosted != "Date") {
    throw 'You must provide a valid datePosted';
  }

  if (!comment.taskId || typeof comment.taskId != "string" || !mongoDB.ObjectID.isValid(comment.taskId)) {
    throw 'You must provide valid taskId';
  }

  if (!comment.comment || typeof comment.comment != "String") {
    throw 'You must provide a valid comment';
  }

};

let exportedMethods = {

  // GET /comment
  async getAllcomments() {
    const commentCollection = await comments();
    return await commentCollection.find({}).toArray();
  },

  // GET /comment/{id}
  async getCommentById(id) {
    if (!id || typeof id != "string" || !mongoDB.ObjectID.isValid(id)) {
      throw 'You must provide valid id';
    }

    const commentCollection = await comments();
    let comment = await commentCollection.findOne({ _id: mongoDB.ObjectID(String(id)) });
    if (!comment) throw 'comment not found';
    return comment;
  },

  // POST /comment
  async addComment(userId, datePosted, taskId, comment) {
    let newComment = {
      userId: userId,
      datePosted: datePosted,
      taskId: taskId,
      comment: comment,
    };

    validateComment(newComment);

    const commentCollection = await comments();
    const newInsertInformation = await commentCollection.insertOne(newComment);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return await this.getCommentById(newInsertInformation.insertedId);
  }
  
};

module.exports = exportedMethods;
