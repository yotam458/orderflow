import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mock chainable objects for Supabase using vi.hoisted to prevent initialization errors
const { mockFrom, mockSupabaseQuery } = vi.hoisted(() => {
  const query = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null })
  };
  
  // Mock localStorage and sessionStorage globally before imports are resolved
  const storageMock = {
    getItem: vi.fn((key) => {
      if (key === 'orderflow_current_user') return JSON.stringify({ name: 'TestUser', employeeNumber: 'EMP-123' });
      return null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  globalThis.localStorage = storageMock;
  globalThis.sessionStorage = storageMock;

  return {
    mockSupabaseQuery: query,
    mockFrom: vi.fn().mockReturnValue(query)
  };
});

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: mockFrom
    })
  };
});

// Import the service, which will pick up the mocked createClient
import { dbService } from '../db';

describe('dbService Cloud-First Operations', () => {
  beforeEach(() => {
    // Clear mock history before each test
    vi.clearAllMocks();
    
    // Set up default successful response for most queries
    mockSupabaseQuery.single.mockResolvedValue({ data: { id: 'mock-id', name: 'Mock Data' }, error: null });
  });

  describe('Authentication', () => {
    it('auth.login queries the employees table with email and password', async () => {
      // Mock the specific return for the login query
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'manager' },
        error: null
      });

      const user = await dbService.auth.login('admin@test.com', 'secret');
      
      expect(mockFrom).toHaveBeenCalledWith('employees');
      expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('email', 'admin@test.com');
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('password', 'secret');
      expect(user.name).toBe('Admin');
    });

    it('auth.login throws error on incorrect credentials', async () => {
      // Mock an error response
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found')
      });

      await expect(dbService.auth.login('wrong@test.com', 'wrong')).rejects.toThrow('אימייל או סיסמה שגויים');
    });
  });

  describe('Orders Flow & Audit Logging', () => {
    it('orders.create pushes a log entry to order_audit table', async () => {
      // Mock creating an order returning ID 1001
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: { id: '1001' },
        error: null
      });

      await dbService.orders.create({ customerName: 'Test Customer', items: 'Test Items' });

      // First insert should be to orders
      expect(mockFrom).toHaveBeenCalledWith('orders');
      
      // Second insert should be to order_audit
      expect(mockFrom).toHaveBeenCalledWith('order_audit');
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
        orderId: '1001',
        action: 'יצירת הזמנה חדשה במערכת',
        userName: 'TestUser'
      }));
    });

    it('orders.update generates audit log when status changes', async () => {
      // 1. Mock the first query: fetching current order
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: { id: '1001', status: 'in_progress', logs: [] },
        error: null
      });
      
      // 2. Mock the second query: updating the order
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: { id: '1001', status: 'ready' },
        error: null
      });

      await dbService.orders.update('1001', { status: 'ready' });

      // Verify that it updated the order
      expect(mockSupabaseQuery.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'ready'
      }));

      // Verify that it pushed the audit log
      expect(mockFrom).toHaveBeenCalledWith('order_audit');
      // The status 'ready' maps to 'ממתין לאיסוף' in db.js
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            orderId: '1001',
            action: expect.stringContaining('ממתין לאיסוף')
          })
        ])
      );
    });
  });

  describe('Team Management', () => {
    it('team.addMember inserts into employees table with default password and branch audit', async () => {
      mockSupabaseQuery.single.mockResolvedValueOnce({
        data: { id: 'new-emp-id', name: 'New Guy' },
        error: null
      });

      await dbService.team.addMember({ name: 'New Guy', email: 'new@test.com' });

      expect(mockFrom).toHaveBeenCalledWith('employees');
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'New Guy',
            password: '123456' // Must include the default password
          })
        ])
      );

      // Verify it also generated a branch audit log
      expect(mockFrom).toHaveBeenCalledWith('branch_audit');
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'הוספת עובד'
        })
      );
    });
  });
});
