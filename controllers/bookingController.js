import Booking from "../models/Booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  // Validate required fields
  if (!date || !time || !guests || !name || !contact) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ date, time });

    if (existingBooking) {
      return res.status(400).json({ message: "Time slot is already booked." });
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created successfully!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking." });
  }
};

// Get bookings for a specific date
export const getBookings = async (req, res) => {
  const { date } = req.query;

  // Validate date parameter
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  try {
    const bookings = await Booking.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
};

// Get available time slots for a specific date
export const getAvailableSlots = async (req, res) => {
  const { date } = req.query;

  // Validate date parameter
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  try {
    const bookedSlots = await Booking.find({ date }).select("time");

    // Assuming your available slots are in an array
    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.some((booking) => booking.time === slot)
    );

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots." });
  }
};

// Delete a Booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  // Validate id parameter
  if (!id) {
    return res.status(400).json({ error: "Booking ID is required." });
  }

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking." });
  }
};
