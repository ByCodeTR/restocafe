export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  // timeString format: "HH:mm"
  return timeString;
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  return `${formatDate(dateString)} ${formatTime(timeString)}`;
};

export const isDateInRange = (date: string, startDate?: string, endDate?: string): boolean => {
  if (!startDate && !endDate) return true;

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (targetDate < start) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (targetDate > end) return false;
  }

  return true;
};

export const isTimeInRange = (time: string, startTime?: string, endTime?: string): boolean => {
  if (!startTime && !endTime) return true;

  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;

  if (startTime) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTimeInMinutes = startHours * 60 + startMinutes;
    if (timeInMinutes < startTimeInMinutes) return false;
  }

  if (endTime) {
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTimeInMinutes = endHours * 60 + endMinutes;
    if (timeInMinutes > endTimeInMinutes) return false;
  }

  return true;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

export const getTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number
): string[] => {
  const slots: string[] = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    slots.push(currentTime);
    currentTime = addMinutesToTime(currentTime, intervalMinutes);
  }

  return slots;
};

export const getCurrentDateString = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const getCurrentTimeString = (): string => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}; 