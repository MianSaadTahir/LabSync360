const express = require("express");
const { body } = require("express-validator");
const {
  extractFromMessage,
  processMessageToEvent,
} = require("../controllers/extractionController");

const router = express.Router();

router.post("/:message_id", extractFromMessage);
// Automated workflow: Extract + Create Event in one call
router.post(
  "/:message_id/complete",
  [
    body("tag")
      .optional()
      .isIn(["meeting", "reminder", "task", "none"])
      .withMessage("Invalid tag"),
  ],
  processMessageToEvent
);

module.exports = router;
