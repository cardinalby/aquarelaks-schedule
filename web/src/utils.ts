export function getTodayDate(): Date {
    const date = new Date()
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}