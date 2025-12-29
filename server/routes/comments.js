const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment
 * @access  Private
 */
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // The ID of the user making the request

    //Fetch the comment from the database to find its original author
    const commentResult = await db.query(
      'SELECT author_id FROM comments WHERE id = $1', 
      [commentId]
    );

    // Check if the comment even exists
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    const commentAuthorId = commentResult.rows[0].author_id;

    //SECURITY CHECK - Is the person deleting the comment its original author?
    if (commentAuthorId !== userId) {
      // 403 Forbidden: You are logged in, but you are not allowed to do this.
      return res.status(403).json({ error: 'User not authorized to delete this comment.' });
    }

    // Step 3: If the check passes, delete the comment
    await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
    
    // Step 4: Send a success response
    res.json({ message: 'Comment deleted successfully.' });

  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'An error occurred while deleting a comment.' });
  }
});

module.exports = router;