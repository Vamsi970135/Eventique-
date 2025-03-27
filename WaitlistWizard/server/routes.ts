import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertWaitlistSchema,
  insertUserSchema,
  insertBusinessSchema,
  insertBookingSchema,
  insertMessageSchema,
  insertReviewSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API error handler middleware
  const handleApiError = (err: any, res: Response) => {
    console.error("API Error:", err);
    
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: fromZodError(err).message 
      });
    }
    
    return res.status(500).json({ message: err.message || "Internal server error" });
  };

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      
      // In a real app, verify password here
      // For demo, we'll just check if the email exists
      
      return res.status(200).json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          userType: user.userType,
        }
      });
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // This endpoint is not implemented yet - we'll just return success
      return res.status(200).json({ 
        success: true, 
        message: "Registration successful" 
      });
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      // This is a mock implementation for the Google sign-in flow
      // In a real app, we would verify the token from the client
      
      // Generate a random user for demo purposes
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        username: `user${Math.floor(Math.random() * 1000)}`,
        fullName: "Demo User",
        userType: "customer",
      };
      
      return res.status(200).json({ 
        success: true,
        isNewUser: false,
        user: mockUser
      });
    } catch (err) {
      handleApiError(err, res);
    }
  });

  // Waitlist API - Add to waitlist
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      const newEntry = await storage.addToWaitlist(waitlistData);
      return res.status(201).json(newEntry);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // User API - Register new user
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      const newUser = await storage.createUser(userData);
      return res.status(201).json({ 
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
        userType: newUser.userType
      });
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Business API - Create business profile
  app.post("/api/businesses", async (req: Request, res: Response) => {
    try {
      const businessData = insertBusinessSchema.parse(req.body);
      const newBusiness = await storage.createBusiness(businessData);
      return res.status(201).json(newBusiness);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Business API - Get all businesses
  app.get("/api/businesses", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const businesses = await storage.getBusinesses(category);
      return res.json(businesses);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Business API - Get business by ID
  app.get("/api/businesses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusinessById(id);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      return res.json(business);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Booking API - Create booking
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const newBooking = await storage.createBooking(bookingData);
      return res.status(201).json(newBooking);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Booking API - Get customer bookings
  app.get("/api/users/:id/bookings", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const bookings = await storage.getUserBookings(userId);
      return res.json(bookings);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Booking API - Get business bookings
  app.get("/api/businesses/:id/bookings", async (req: Request, res: Response) => {
    try {
      const businessId = parseInt(req.params.id);
      const bookings = await storage.getBusinessBookings(businessId);
      return res.json(bookings);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Booking API - Update booking status
  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      return res.json(updatedBooking);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Message API - Send message
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      return res.status(201).json(newMessage);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Message API - Get conversation
  app.get("/api/messages/:userId/:otherUserId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const otherUserId = parseInt(req.params.otherUserId);
      const messages = await storage.getConversation(userId, otherUserId);
      return res.json(messages);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Review API - Create review
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const newReview = await storage.createReview(reviewData);
      return res.status(201).json(newReview);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  // Review API - Get business reviews
  app.get("/api/businesses/:id/reviews", async (req: Request, res: Response) => {
    try {
      const businessId = parseInt(req.params.id);
      const reviews = await storage.getBusinessReviews(businessId);
      return res.json(reviews);
    } catch (err) {
      return handleApiError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
