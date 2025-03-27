import {
  users,
  businesses,
  bookings,
  messages,
  reviews,
  waitlist,
  type User,
  type InsertUser,
  type Business,
  type InsertBusiness,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Waitlist,
  type InsertWaitlist,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Business methods
  getBusinessById(id: number): Promise<Business | undefined>;
  getBusinessesByUserId(userId: number): Promise<Business[]>;
  getBusinesses(category?: string): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;

  // Booking methods
  getBookingById(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getBusinessBookings(businessId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Message methods
  getConversation(userId: number, otherUserId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Review methods
  getBusinessReviews(businessId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Waitlist methods
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businesses: Map<number, Business>;
  private bookings: Map<number, Booking>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  private waitlistEntries: Map<number, Waitlist>;
  
  private userIdCounter: number;
  private businessIdCounter: number;
  private bookingIdCounter: number;
  private messageIdCounter: number;
  private reviewIdCounter: number;
  private waitlistIdCounter: number;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.bookings = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.waitlistEntries = new Map();
    
    this.userIdCounter = 1;
    this.businessIdCounter = 1;
    this.bookingIdCounter = 1;
    this.messageIdCounter = 1;
    this.reviewIdCounter = 1;
    this.waitlistIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Business methods
  async getBusinessById(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessesByUserId(userId: number): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      (business) => business.userId === userId
    );
  }

  async getBusinesses(category?: string): Promise<Business[]> {
    let businesses = Array.from(this.businesses.values());
    
    if (category) {
      businesses = businesses.filter(
        (business) => business.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return businesses;
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.businessIdCounter++;
    const business: Business = { ...insertBusiness, id };
    this.businesses.set(id, business);
    return business;
  }

  // Booking methods
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.customerId === userId
    );
  }

  async getBusinessBookings(businessId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.businessId === businessId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    
    if (!booking) {
      return undefined;
    }
    
    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Message methods
  async getConversation(userId: number, otherUserId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === userId && message.receiverId === otherUserId) ||
        (message.senderId === otherUserId && message.receiverId === userId)
    ).sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      sentAt: now,
      isRead: false 
    };
    this.messages.set(id, message);
    return message;
  }

  // Review methods
  async getBusinessReviews(businessId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.businessId === businessId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const review: Review = { ...insertReview, id, createdAt: now };
    this.reviews.set(id, review);
    return review;
  }

  // Waitlist methods
  async addToWaitlist(insertEntry: InsertWaitlist): Promise<Waitlist> {
    // Check if email already exists in waitlist
    const existingEntry = Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email.toLowerCase() === insertEntry.email.toLowerCase()
    );
    
    if (existingEntry) {
      throw new Error("Email already registered in waitlist");
    }
    
    const id = this.waitlistIdCounter++;
    const now = new Date();
    const entry: Waitlist = { ...insertEntry, id, createdAt: now };
    this.waitlistEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
