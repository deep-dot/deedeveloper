
const BlogPost = require('../../models/BlogPost.js');
const cloudinary = require("cloudinary").v2;

module.exports = async (req, res) => {
  //  console.log('Updating post:', req.body);
    let success, error;

    try {
        // Prepare update fields
        const updateFields = { post: req.body.post };
        if (req.file) {
            updateFields.image = req.file.path;
        }

        // Update the document
        const post = await BlogPost.updateOne(
            { _id: req.params.id },
            { $set: updateFields }
        );

        if (post.modifiedCount > 0) {
            success = `Project has been updated successfully`;
            req.flash('success', success);
            return res.redirect('/readAll');
        } else {
            throw new Error('No document was updated');
        }
    } catch (error) {
        console.error('Error updating post:', error);

        // Clean up uploaded file if present
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }

        error = `Post update unsuccessful`;
        req.flash('error', error);
        return res.redirect(`/project/${req.params.id}`);
    }
};
