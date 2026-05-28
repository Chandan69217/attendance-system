

export const formatTo12Hour = (time24?: string | null): string | null | undefined => {
    try {
        if (!time24) return time24

        const parts = time24.split(":")
        if (parts.length < 2) return time24

        let hours = parseInt(parts[0], 10)
        const minutes = parts[1]

        if (isNaN(hours)) return time24

        const ampm = hours >= 12 ? "PM" : "AM"
        hours = hours % 12
        hours = hours === 0 ? 12 : hours

        return `${hours}:${minutes.padStart(2, "0")} ${ampm}`
    } catch {
        return time24
    }
}