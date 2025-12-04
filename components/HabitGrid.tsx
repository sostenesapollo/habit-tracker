'use client';

import { format, startOfWeek, endOfWeek, startOfYear, endOfYear, eachDayOfInterval, subMonths, startOfMonth, endOfMonth, isSameMonth, getMonth } from 'date-fns';
import { Habit, ViewType } from '@/types';
import { useHabits } from '@/hooks/useHabits';

interface HabitGridProps {
  habit: Habit;
  view: ViewType;
}

export function HabitGrid({ habit, view }: HabitGridProps) {
  const { toggleHabitDate } = useHabits();

  const getDatesForView = (): Date[] => {
    const today = new Date();
    
    switch (view) {
      case 'weekly': {
        const start = startOfWeek(today);
        const end = endOfWeek(today);
        return eachDayOfInterval({ start, end });
      }
      case 'semester': {
        const sixMonthsAgo = subMonths(today, 6);
        const start = startOfMonth(sixMonthsAgo);
        const end = endOfMonth(today);
        return eachDayOfInterval({ start, end });
      }
      case 'annual':
      default: {
        const start = startOfYear(today);
        const end = endOfYear(today);
        return eachDayOfInterval({ start, end });
      }
    }
  };

  const dates = getDatesForView();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Organize dates into weeks (columns)
  const organizeIntoWeeks = (dates: Date[]): (Date | null)[][] => {
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];
    
    dates.forEach((date, index) => {
      const dayOfWeek = date.getDay();
      
      if (index === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(null);
        }
      }
      
      currentWeek.push(date);
      
      if (currentWeek.length === 7 || index === dates.length - 1) {
        if (index === dates.length - 1 && currentWeek.length < 7) {
          while (currentWeek.length < 7) {
            currentWeek.push(null);
          }
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };
  
  const weeks = view === 'weekly' ? [dates] : organizeIntoWeeks(dates);

  // Transpose: organize by day of week (rows) and weeks (columns)
  // Each row represents a day of week (0=Sunday, 1=Monday, etc)
  const organizeByDayOfWeek = (): (Date | null)[][] => {
    const dayRows: (Date | null)[][] = [];
    
    // Initialize 7 rows (one for each day of week)
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      dayRows[dayOfWeek] = [];
      // For each week, get the day at this dayOfWeek position
      weeks.forEach((week) => {
        dayRows[dayOfWeek].push(week[dayOfWeek] || null);
      });
    }
    
    return dayRows;
  };

  const dayRows = view === 'weekly' ? [dates] : organizeByDayOfWeek();
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Get month labels for each week column
  const getMonthForWeek = (weekIndex: number): { month: string; show: boolean } => {
    if (view === 'weekly') return { month: '', show: false };
    
    const week = weeks[weekIndex];
    const firstDay = week.find(d => d !== null);
    if (!firstDay) return { month: '', show: false };
    
    // Show label if it's the first week or if previous week was different month
    const show = weekIndex === 0 || (weeks[weekIndex - 1] && weeks[weekIndex - 1][0] && !isSameMonth(weeks[weekIndex - 1][0]!, firstDay));
    
    return {
      month: getMonthLabel(firstDay),
      show,
    };
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    toggleHabitDate(habit.id, dateStr);
  };

  const getIntensity = (dateStr: string): number => {
    if (!habit.completedDates.includes(dateStr)) return 0;
    
    let streak = 0;
    const date = new Date(dateStr);
    let checkDate = new Date(date);
    
    while (habit.completedDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    if (streak >= 30) return 4;
    if (streak >= 14) return 3;
    if (streak >= 7) return 2;
    return 1;
  };

  const getSquareStyle = (dateStr: string, date: Date, intensity: number, rowIndex?: number, colIndex?: number, isLastRow?: boolean, isLastCol?: boolean) => {
    const isToday = dateStr === today;
    const isFuture = date > new Date();
    
    let backgroundColor = 'var(--grid-bg-empty)';
    
    if (intensity > 0) {
      backgroundColor = habit.color;
    }
    
    const size = view === 'weekly' ? '32px' : view === 'semester' ? '10px' : '10px';
    
    // Calculate border radius for corners
    let borderRadius = '2px';
    if (rowIndex !== undefined && colIndex !== undefined && isLastRow !== undefined && isLastCol !== undefined) {
      const isFirstRow = rowIndex === 0;
      const isFirstCol = colIndex === 0;
      
      if (isFirstRow && isFirstCol) {
        borderRadius = '4px 0 0 0'; // top-left
      } else if (isFirstRow && isLastCol) {
        borderRadius = '0 4px 0 0'; // top-right
      } else if (isLastRow && isFirstCol) {
        borderRadius = '0 0 0 4px'; // bottom-left
      } else if (isLastRow && isLastCol) {
        borderRadius = '0 0 4px 0'; // bottom-right
      } else if (isFirstRow) {
        borderRadius = '2px 2px 0 0'; // top
      } else if (isLastRow) {
        borderRadius = '0 0 2px 2px'; // bottom
      } else if (isFirstCol) {
        borderRadius = '2px 0 0 2px'; // left
      } else if (isLastCol) {
        borderRadius = '0 2px 2px 0'; // right
      } else {
        borderRadius = '2px'; // middle
      }
    }
    
    return {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      backgroundColor,
      opacity: isFuture ? 0.3 : intensity === 0 ? 0.1 : intensity === 1 ? 0.4 : intensity === 2 ? 0.6 : intensity === 3 ? 0.8 : 1,
      borderRadius,
      cursor: isFuture ? 'not-allowed' : 'pointer',
      border: isToday
        ? '2px solid var(--accent)'
        : '1px solid var(--grid-border)',
      transition: 'all 0.15s ease',
      outline: 'none',
    };
  };

  const getMonthLabel = (date: Date): string => {
    const month = format(date, 'MMM');
    return month.length > 3 ? month.substring(0, 3).toUpperCase() : month.toUpperCase();
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: `1px solid var(--border)`,
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{habit.icon}</span>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', flex: 1 }}>
          {habit.title}
        </h3>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: habit.color,
          }}
        />
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'inline-block', minWidth: 'fit-content' }}>
          {/* Month labels row - only for annual/semester */}
          {view !== 'weekly' && (
            <div style={{ display: 'flex', gap: '1px', marginBottom: '2px', paddingLeft: '20px' }}>
              {weeks.map((_, weekIndex) => {
                const { month, show } = getMonthForWeek(weekIndex);
                return (
                  <div
                    key={weekIndex}
                    style={{
                      width: '10px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      fontSize: '9px',
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                    }}
                  >
                    {show && month}
                  </div>
                );
              })}
            </div>
          )}

          {/* Grid: rows = days of week, columns = weeks */}
          <div style={{ display: 'flex', gap: '1px' }}>
            {/* Day labels column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                marginRight: '4px',
                flexShrink: 0,
              }}
            >
              {view !== 'weekly' && <div style={{ height: '16px' }} />}
              {dayLabels.map((label, dayIndex) => (
                <div
                  key={dayIndex}
                  style={{
                    width: view === 'weekly' ? '20px' : '16px',
                    height: view === 'weekly' ? '32px' : '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    paddingRight: '4px',
                  }}
                >
                  {view === 'weekly' ? label : label}
                </div>
              ))}
            </div>

            {/* Grid content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {view === 'weekly' ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '1px',
                  }}
                >
                  {dates.map((date, index) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const intensity = getIntensity(dateStr);
                    const isFirstRow = true;
                    const isLastRow = true;
                    const isFirstCol = index === 0;
                    const isLastCol = index === dates.length - 1;
                    return (
                      <div
                        key={dateStr}
                        style={getSquareStyle(dateStr, date, intensity, 0, index, isLastRow, isLastCol)}
                        onClick={() => {
                          if (date <= new Date()) {
                            handleDateClick(date);
                          }
                        }}
                        title={`${format(date, 'dd/MM/yyyy')} - ${intensity > 0 ? 'Completo' : 'Incompleto'}`}
                      />
                    );
                  })}
                </div>
              ) : (
                dayRows.map((row, dayIndex) => {
                  const isLastRow = dayIndex === dayRows.length - 1;
                  return (
                    <div
                      key={dayIndex}
                      style={{
                        display: 'flex',
                        gap: '1px',
                      }}
                    >
                      {row.map((date, weekIndex) => {
                        if (date === null) {
                          return (
                            <div
                              key={`empty-${dayIndex}-${weekIndex}`}
                              style={{
                                width: '10px',
                                height: '10px',
                                minWidth: '10px',
                                minHeight: '10px',
                              }}
                            />
                          );
                        }
                        
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const intensity = getIntensity(dateStr);
                        const isFirstRow = dayIndex === 0;
                        const isFirstCol = weekIndex === 0;
                        const isLastCol = weekIndex === row.length - 1;
                        return (
                          <div
                            key={dateStr}
                            style={getSquareStyle(dateStr, date, intensity, dayIndex, weekIndex, isLastRow, isLastCol)}
                            onClick={() => {
                              if (date <= new Date()) {
                                handleDateClick(date);
                              }
                            }}
                            title={`${format(date, 'dd/MM/yyyy')} - ${intensity > 0 ? 'Completo' : 'Incompleto'}`}
                          />
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          marginTop: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>
          {habit.completedDates.length} {habit.completedDates.length === 1 ? 'dia' : 'dias'} completados
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem' }}>Menos</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: level === 0 ? 'var(--grid-bg-empty)' : habit.color,
                  opacity: level === 0 ? 0.1 : level === 4 ? 1 : level * 0.25 + 0.2,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.7rem' }}>Mais</span>
        </div>
      </div>
    </div>
  );
}
