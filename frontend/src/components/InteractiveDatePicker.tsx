'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X, Sparkles, Clock } from 'lucide-react';
import { db } from '@/lib/store';

interface InteractiveDatePickerProps {
  label: string;
  selectedDate: string; // ISO YYYY-MM-DD
  onSelectDate: (dateIso: string) => void;
  minDate?: string; // ISO YYYY-MM-DD (defaults to today)
  required?: boolean;
  helperText?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function InteractiveDatePicker({
  label,
  selectedDate,
  onSelectDate,
  minDate,
  required = false,
  helperText = 'Selected date will be verified by Abhi Shinde against the master shoot calendar.',
}: InteractiveDatePickerProps) {
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];
  const effectiveMinIso = minDate || todayIso;

  // View state: current displayed year and month (0-11)
  const initialYear = selectedDate ? parseInt(selectedDate.split('-')[0]) : today.getFullYear();
  const initialMonth = selectedDate ? parseInt(selectedDate.split('-')[1]) - 1 : today.getMonth();

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth);
  const [isOpen, setIsOpen] = useState(false);

  // Sync when selectedDate changes from outside
  useEffect(() => {
    if (selectedDate && selectedDate.includes('-')) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0]));
        setViewMonth(parseInt(parts[1]) - 1);
      }
    }
  }, [selectedDate]);

  // Compute calendar days for viewMonth and viewYear
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  // In JS, getDay() returns 0 for Sunday. We want Monday = 0, Sunday = 6
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Format ISO YYYY-MM-DD to DD/MM/YYYY
  const formatToDDMMYYYY = (iso: string) => {
    if (!iso || !iso.includes('-')) return '';
    const [y, m, d] = iso.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  };

  // Format nicely for human label
  const formatHumanDate = (iso: string) => {
    if (!iso || !iso.includes('-')) return 'No date selected';
    const [y, m, d] = iso.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Available year choices: current year to current year + 3
  const currentYearNum = today.getFullYear();
  const yearOptions = [currentYearNum, currentYearNum + 1, currentYearNum + 2, currentYearNum + 3];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-muted-text font-medium flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-gold" />
          <span>{label} {required && <span className="text-red-400">*</span>}</span>
        </label>
        {selectedDate && (
          <span className="text-xs text-gold font-mono font-bold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-full">
            {formatToDDMMYYYY(selectedDate)}
          </span>
        )}
      </div>

      {/* TRIGGER DISPLAY CARD */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-card-bg border rounded-2xl p-3.5 cursor-pointer flex items-center justify-between transition-all ${
          isOpen ? 'border-gold shadow-md' : 'border-border hover:border-gold/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-bg border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">
              {selectedDate ? formatHumanDate(selectedDate) : 'Click to select shoot date on calendar'}
            </div>
            <div className="text-[11px] text-muted-text">
              {selectedDate ? `Format: ${formatToDDMMYYYY(selectedDate)} (ISO: ${selectedDate})` : 'Browse dates with live crew availability'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedDate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDate('');
              }}
              className="text-[11px] text-muted-text hover:text-foreground px-2 py-1 rounded bg-secondary-bg hover:bg-zinc-200 border border-border"
              title="Clear date"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-gold font-bold px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/30">
            {isOpen ? 'Close' : 'Choose Date'}
          </span>
        </div>
      </div>

      {/* INTERACTIVE CALENDAR DROPDOWN */}
      {isOpen && (
        <div className="bg-card-bg border border-gold/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* CALENDAR HEADER: MONTH NAV & YEAR SELECTOR */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg bg-secondary-bg hover:bg-zinc-200 border border-border flex items-center justify-center text-foreground transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg text-foreground font-bold">
                {MONTH_NAMES[viewMonth]}
              </span>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="bg-secondary-bg border border-border rounded-lg text-xs text-gold font-bold px-2 py-1 focus:outline-none focus:border-gold"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="bg-white text-foreground">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg bg-secondary-bg hover:bg-zinc-200 border border-border flex items-center justify-center text-foreground transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* WEEKDAY LABELS */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="text-[11px] font-bold text-muted-text uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* CALENDAR DAYS GRID */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before first day */}
            {Array.from({ length: startDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              
              const isPast = dateIso < effectiveMinIso;
              const isToday = dateIso === todayIso;
              const isSelected = dateIso === selectedDate;
              
              // Real availability check
              const availCheck = db.checkDateAvailability(dateIso);
              const isAvailable = availCheck.available;
              const existingCount = availCheck.existingBookings;

              return (
                <button
                  key={dateIso}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onSelectDate(dateIso);
                    setIsOpen(false);
                  }}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all group ${
                    isSelected
                      ? 'bg-[#181818] text-white font-bold shadow-md scale-105 z-10'
                      : isPast
                      ? 'text-zinc-400 opacity-40 cursor-not-allowed bg-transparent'
                      : isToday
                      ? 'border border-gold text-gold font-bold bg-gold/10'
                      : 'text-foreground bg-secondary-bg/50 hover:bg-secondary-bg hover:border-gold/40 border border-transparent'
                  }`}
                  title={`${dateIso} - ${isPast ? 'Past date' : isAvailable ? 'Open for shoot' : 'Fully booked'}`}
                >
                  <span>{dayNum}</span>

                  {/* Availability Dot Indicator */}
                  {!isPast && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected
                          ? 'bg-black'
                          : !isAvailable
                          ? 'bg-red-500'
                          : existingCount === 1
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CALENDAR LEGEND & QUICK SHORTCUTS */}
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            {/* Legend */}
            <div className="flex items-center gap-3 text-muted-text">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> 1 Slot Left
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Booked
              </span>
            </div>

            {/* Quick date picks */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectDate(todayIso);
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded bg-secondary-bg hover:bg-zinc-200 text-foreground border border-border"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const tmrw = new Date(today);
                  tmrw.setDate(tmrw.getDate() + 1);
                  onSelectDate(tmrw.toISOString().split('T')[0]);
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded bg-secondary-bg hover:bg-zinc-800 text-zinc-300 border border-border"
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-zinc-400 italic">
          {helperText}
        </p>
      )}
    </div>
  );
}
