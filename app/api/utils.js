// Common utility functions for API routes

/**
 * Returns the start of the given date (00:00:00.000)
 */
export function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Returns the end of the given date (23:59:59.999)
 */
export function endOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

/**
 * Converts a time string (HH:mm) to minutes
 */
export function convertTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
}

/**
 * Converts minutes to a time string (HH:mm)
 */
export function formatMinutesToTime(minutes) {
    if (minutes === null || minutes === undefined) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Standard error response
 */
export function errorResponse(message, status = 500) {
    return {
        json: { error: message },
        status
    };
}

/**
 * Standard success response
 */
export function successResponse(data, status = 200) {
    return {
        json: data,
        status
    };
} 