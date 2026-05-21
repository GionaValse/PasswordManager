// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatRelativeDate } from './TimeTool';

describe('TimeTool Utility', () => {
  const mockNow = new Date('2024-05-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "now" or "0 minutes ago" for current time', () => {
    const result = formatRelativeDate(mockNow);
    expect(result).toMatch(/this minute|now/);
  });

  it('should format minutes correctly', () => {
    const fiveMinutesAgo = new Date(mockNow.getTime() - 5 * 60 * 1000);
    expect(formatRelativeDate(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('should format hours correctly', () => {
    const twoHoursAgo = new Date(mockNow.getTime() - 2 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoHoursAgo)).toBe('2 hours ago');
  });

  it('should return "yesterday" for 1 day ago', () => {
    const yesterday = new Date(mockNow.getTime() - 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(yesterday)).toBe('yesterday');
  });

  it('should format days correctly', () => {
    const tenDaysAgo = new Date(mockNow.getTime() - 10 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(tenDaysAgo)).toBe('10 days ago');
  });

  it('should return absolute date if older than 30 days', () => {
    const longAgo = new Date('2020-01-01');
    const result = formatRelativeDate(longAgo);

    expect(result).toContain('2020');
    expect(result).toMatch(/\d{2}.\d{2}.2020/);
  });

  it('should handle string input correctly', () => {
    const dateString = '2024-05-14T12:00:00Z'; // 1 day ago
    expect(formatRelativeDate(dateString)).toBe('yesterday');
  });
});
