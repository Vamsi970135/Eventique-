import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for both customers and service providers)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // 'customer', 'provider', or 'both'
  firebaseUid: text("firebase_uid").unique(),
});

// Business profiles for service providers
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., Photography, Catering, Venue, DJ, etc.
  location: text("location").notNull(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email").notNull(),
  portfolio: jsonb("portfolio"), // Array of image URLs or portfolio items
  pricing: text("pricing"), // Description of pricing or packages
  rating: integer("rating"), // Average rating (1-5)
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  eventDate: timestamp("event_date").notNull(),
  status: text("status").notNull(), // 'pending', 'confirmed', 'cancelled', 'completed'
  details: text("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Waitlist entries
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull(), // 'customer', 'provider', or 'both'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  receivesUpdates: boolean("receives_updates").notNull().default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, sentAt: true, isRead: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertWaitlistSchema = createInsertSchema(waitlist).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
