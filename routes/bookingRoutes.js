import express from "express";
import {
  createBooking,
  getBookings,
  deleteBooking,
  getAvailableSlots,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/available-slots", getAvailableSlots);
router.delete("/:id", deleteBooking);

export default router;
