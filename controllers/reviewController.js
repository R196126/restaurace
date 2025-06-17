const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("author","username");
    res.json(reviews);
    console.log(reviews);
  } catch (error) {
    res.status(500).json({ message: "Chyba získání recenze" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const userId = req.user?.userId;

    console.log("Uživatel v addReview:", req.user);

    if (!userId) return res.status(401).json({ message: "Nepřihlášený uživatel." });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Obsah a hodnocení jsou povinné." });


    // Zjisti poslední recenzi daného uživatele
    const lastReview = await Review.findOne({ author: userId }).sort({ createdAt: -1 });

    // Pokud už nějakou recenzi má a není starší než 1 hodinu
     if (lastReview) {
       const oneHourAgo = Date.now() - 60 * 60 * 1000;

       if (lastReview.createdAt > oneHourAgo) {
         return res.status(429).json({
           message: "Recenzi můžete přidat pouze jednou za hodinu."
         });
       }
     }

    // Vytvoření nové recenze
    const review = new Review({
      comment,
      author: userId,
      rating
    });

    await review.save();
    res.status(201).json(review);

  } catch (error) {
    console.error("Chyba při ukládání recenze:", error);
    res.status(500).json({ message: "Chyba při ukládání recenze." });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Nepřihlášený uživatel." });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Recenze nenalezena." });
    }

    if (review.author.toString() !== userId) {
      return res.status(403).json({ message: "Nemáte oprávnění smazat tuto recenzi." });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({ message: "Recenze byla úspěšně smazána." });

  } catch (error) {
    console.error("Chyba při mazání recenze:", error);
    return res.status(500).json({ message: "Chyba při mazání recenze." });
  }
};

// exports.deleteReview = async (req, res) => {
//   try {
//     const deleted = await Review.findByIdAndDelete(req.params.reviewId);
//     if (!deleted) return res.status(404).json({ message: "Recenze nenalezena" });
//     res.json({ message: "Recenze smazána" });
//   } catch (err) {
//     res.status(500).json({ message: "Chyba při mazání recenze" });
//   }
// };
