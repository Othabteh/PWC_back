'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const mongoose = require('mongoose');

//------------------------------------// Post Schema \\----------------------------------\\
const blog = mongoose.model(
  'blog',
  mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, require: true },
    comments: { type: [] },
    userID: { type: String, require: true },
  }),
);

//---------------------------------// Community Module \\-------------------------------\\
class Blogs {
  constructor() {}

  async getBlogs() {
    const result = await blog.find({});
    return result;
  }

  async submitBlog(user, payload) {
    console.log('hiiiii', user);
    // if (user.account_type === 'c') {
    //   throw new Error(`You need to be employee`);
    // }
    // const id = await helper.getID(user.id, 'person');
    // const profile = await helper.getProfile(id, 'person');

    const record = {
      title: payload.title,
      body: payload.body,
      userID: user.userID,
    };

    const newPost = new blog(record);
    await newPost.save();
    return newPost;
  }

  async updateBlog(user, postID, payload) {
    if (user.role === 'writer') {
      const check = await blog.find({ _id: postID });

      if (check[0].userID == user.userID) {
        await blog.findByIdAndUpdate(postID, payload);
      }
      console.log('saiiiiis', check);
    } else if (user.role == 'admin') {
      await blog.findByIdAndUpdate(postID, payload);
    }
    // if (check.length > 0) {
    // }
  }
  async getBlogs() {
    const check = await blog.find({});
  }

  async addComment(user, postID, payload) {
    console.log('pay;oad', payload);
    const Bolg = await blog.find({ _id: postID });
    console.log('blod', Bolg);
    await blog.findByIdAndUpdate(postID, { comments: [...Bolg[0].comments, { author: user.username, body: payload.body }] });
  }
  //   async addComment(user, postID, payload) {
  //     const idPerson = await helper.getID(user.id, 'person');
  //     const profile = await helper.getProfile(idPerson, 'person');
  //     const newComment = {
  //       writerID: user.id,
  //       comment: payload.comment,
  //       profile: `${profile.first_name} ${profile.last_name}`,
  //       avatar: profile.avatar,
  //       job_title: profile.job_title,
  //       date: new Date().toString(),
  //     };
  //     const targetPost = await this.getPost(postID);
  //     targetPost.comments.push(newComment);
  //     await targetPost.save();
  //     return targetPost.comments.length;
  //   }
}

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = new Blogs();
