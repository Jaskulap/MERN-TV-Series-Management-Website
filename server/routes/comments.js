const router = require("express").Router();
const { Comment,validateComment } = require("../models/comment");
const { User } = require("../models/user");
const tokenVerification = require("../middleware/tokenVerification");

router.post('/', tokenVerification, async (req, res) => {
  try {
    const { error } = validateComment(req.body)
    if (error){
      console.log(error.details[0].message)
      return res.status(400).send({ message: error.details[0].message })
    }
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "No such user" });
      
    }
    // Create a new comment object
    const comment = new Comment({
      author: user._id,
      nick: user.nick,
      content: req.body.tresc,
      createdAt: Date.now()
    });
    
    console.log(comment);
    // Save the comment to the database
    await comment.save();
    res.status(201).send();
  } catch (error) {
    console.log(error)
    res.status(500).send('Something went wrong. Please try again.');
  }
});

router.get('/:quantity', tokenVerification, async (req, res) => {
    try {
        
      const quantity = parseInt(req.params.quantity); // Pobierz liczbę komentarzy do zwrócenia jako parametr z URL
      if (isNaN(quantity) || quantity <= 0) {
       
        return res.status(400).send('Invalid quantity'); // Sprawdź, czy wartość quantity jest poprawna
      }
      
  
      // Pobierz quantity najnowszych komentarzy z bazy danych, sortując po createdAt w kolejności malejącej
      const comments = await Comment.find()
        .sort({ createdAt: -1 })
        .limit(quantity)
        
      res.status(200).json({data:comments});
      
    } catch (error) {
        
      res.status(500).send('Something went wrong. Please try again.');
    }
  });

  router.delete('/:id', tokenVerification, async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.user._id;
  
      // Sprawdź, czy istnieje użytkownik o podanym ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Sprawdź, czy istnieje komentarz o podanym ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).send({ message: 'Comment not found' });
      }
  
      // Sprawdź, czy aktualnie zalogowany użytkownik jest autorem komentarza
      if (comment.author.toString() !== userId) {
        return res.status(403).send({ message: 'Unauthorized' });
      }
  
      // Usuń komentarz
      await Comment.findByIdAndDelete(commentId)
      res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  });
  
  module.exports = router;