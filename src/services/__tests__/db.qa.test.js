import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFrom, mockSupabaseQuery } = vi.hoisted(() => {
  const query = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null })
  };
  
  const storageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  globalThis.localStorage = storageMock;
  globalThis.sessionStorage = storageMock;

  return { mockSupabaseQuery: query, mockFrom: vi.fn().mockReturnValue(query) };
});

vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ from: mockFrom }) }));

import { dbService } from '../db';

describe('dbService QA & Limits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Orders Limits', () => {
    it('throws clean error when updating non-existent order', async () => {
      mockSupabaseQuery.single.mockResolvedValueOnce({ data: null, error: null }); // Mock order not found
      await expect(dbService.orders.update('999', { status: 'ready' })).rejects.toThrow('הזמנה לא נמצאה');
    });
  });

  describe('Team Management QA', () => {
    it('prevents deleting the last manager', async () => {
      // Mock the select query for employees to return only one manager
      mockSupabaseQuery.select.mockResolvedValueOnce({
        data: [{ id: 'admin1', role: 'manager' }],
        error: null
      });

      await expect(dbService.team.removeMember('admin1')).rejects.toThrow('לא ניתן למחוק את המנהל האחרון במערכת');
    });

    it('allows deleting an employee who is not the last manager', async () => {
      // First select query for the QA check
      mockSupabaseQuery.select.mockResolvedValueOnce({
        data: [
          { id: 'admin1', role: 'manager' },
          { id: 'emp1', role: 'employee' }
        ],
        error: null
      });
      // The delete query error response
      mockSupabaseQuery.delete.mockReturnThis();
      mockSupabaseQuery.eq.mockResolvedValueOnce({ error: null });

      await expect(dbService.team.removeMember('emp1')).resolves.not.toThrow();
    });
  });

  describe('Auth Edge Cases', () => {
    it('throws error for missing or empty email', async () => {
      mockSupabaseQuery.single.mockResolvedValueOnce({ data: null, error: new Error('Not found') });
      await expect(dbService.auth.login('', '123456')).rejects.toThrow('אימייל או סיסמה שגויים');
    });
  });
});
