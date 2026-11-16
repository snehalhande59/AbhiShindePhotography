'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface AdminCalendarProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export default function AdminCalendar({ bookings, onSelectBooking }: AdminCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 11, 1)); // Default Dec 2026 where sample bookings are
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 86400000));
    }
  };

  const nextPeriod = () => {
    if (calendarView === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 86400000));
    }
  };

  const getBookingsForDay = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter((b) => b.eventDate === formatted);
  };

  return (
    <div className="bg-secondary-bg border border-border rounded-2xl p-6 shadow-xl">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-gold" />
          <h3 className="font-serif text-2xl text-white font-bold">
            {monthNames[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="bg-card-bg border border-border rounded-xl p-1 flex items-center text-xs">
            {(['month', 'week', 'day'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  calendarView === view ? 'bg-gold text-black font-bold' : 'text-muted-text hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevPeriod}
              className="p-2 text-white hover:text-gold bg-card-bg border border-border rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 11, 1))}
              className="px-3 py-2 text-xs text-white hover:text-gold bg-card-bg border border-border rounded-xl"
            >
              Dec 2026 Shoots
            </button>
            <button
              onClick={nextPeriod}
              className="p-2 text-white hover:text-gold bg-card-bg border border-border rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {calendarView === 'month' && (
        <div className="mt-6">
          {/* Day of Week Row */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-muted-text uppercase tracking-widest">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[90px] rounded-xl bg-card-bg/20 border border-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayBookings = getBookingsForDay(day);
              const hasBookings = dayBookings.length > 0;

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[95px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                    hasBookings
                      ? 'border-gold/50 bg-gold/5'
                      : 'border-border/60 bg-card-bg/50 hover:border-border'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-semibold ${hasBookings ? 'text-gold' : 'text-muted-text'}`}>
                      {day}
                    </span>
                    {hasBookings && (
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => onSelectBooking(b)}
                        className="text-[10px] p-1.5 rounded-lg bg-card-bg border border-gold/40 hover:bg-gold/20 cursor-pointer text-white truncate"
                        title={`${b.clientName} - ${b.packageName}`}
                      >
                        <span className="text-gold font-bold block truncate">{b.clientName}</span>
                        <span className="text-muted-text block truncate">{b.eventTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK / DAY VIEW FALLBACK */}
      {(calendarView === 'week' || calendarView === 'day') && (
        <div className="mt-6 space-y-4">
          <div className="text-sm text-gold">
            Showing scheduled events for {monthNames[month]} {year}:
          </div>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="p-4 rounded-xl bg-card-bg border border-border hover:border-gold cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gold/20 text-gold border border-gold/40">
                      {b.bookingStatus}
                    </span>
                    <span className="text-xs font-mono text-muted-text">{b.bookingRef}</span>
                  </div>
                  <h4 className="text-white font-serif text-lg">{b.clientName}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-text">
                    <span className="flex items-center gap-1 text-white">
                      <CalendarIcon className="w-3.5 h-3.5 text-gold" /> {b.eventDate} ({b.eventTime})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" /> {b.eventLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold" /> {b.assignedPhotographer || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-gold font-serif font-bold text-lg">{formatINR(b.totalAmount)}</div>
                  <span className="text-xs text-green-400">Advance Paid: {formatINR(b.advanceAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
