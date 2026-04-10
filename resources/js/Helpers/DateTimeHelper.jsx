// resources/js/Helpers/DateTimeHelper.js

function getBrowserTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function normalizeDateValue(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    let normalized = String(value).trim();

    if (!normalized) return null;

    // "2026-03-07 21:00:00" -> "2026-03-07T21:00:00"
    if (normalized.includes(" ") && !normalized.includes("T")) {
        normalized = normalized.replace(" ", "T");
    }

    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

function getFormatterParts(date, timeZone = getBrowserTimeZone()) {
    const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";

    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
        second: get("second"),
    };
}

/**
 * Convierte una fecha del servidor a formato para input datetime-local
 * Salida: YYYY-MM-DDTHH:mm
 *
 * @param {string|Date|null|undefined} value
 * @param {string} timeZone
 * @returns {string}
 */
function formatServerDateToDatetimeLocal(value, timeZone = getBrowserTimeZone()) {
    const date = normalizeDateValue(value);
    if (!date) return "";

    const parts = getFormatterParts(date, timeZone);

    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/**
 * Convierte una fecha del servidor a texto local legible
 * Salida ejemplo: 07/03/2026, 03:00:00 p. m.
 *
 * @param {string|Date|null|undefined} value
 * @param {string} locale
 * @param {string} timeZone
 * @returns {string}
 */
function formatServerDateToLocalString(
    value,
    locale = "es-SV",
    timeZone = getBrowserTimeZone(),
) {
    const date = normalizeDateValue(value);
    if (!date) return "";

    return date.toLocaleString(locale, {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

/**
 * Convierte un valor de input datetime-local + zona horaria a ISO UTC
 * Entrada esperada: YYYY-MM-DDTHH:mm
 * Salida: ISO string UTC
 *
 * Nota:
 * Esta función NO reemplaza la validación/conversión del backend.
 * Sirve para depuración o flujos donde quieras inspeccionar el instante.
 *
 * @param {string} localDateTime
 * @returns {string}
 */
function localDatetimeToUtcIso(localDateTime) {
    if (!localDateTime) return "";

    const date = new Date(localDateTime);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
}

const DateTimeHelper = {
    getBrowserTimeZone,
    formatServerDateToDatetimeLocal,
    formatServerDateToLocalString,
    localDatetimeToUtcIso,
};

export default DateTimeHelper;