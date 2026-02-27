// resources/js/Pages/Schedules/Index.jsx
import React, { useMemo, useState } from "react";
import { router } from "@inertiajs/react";

import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO, addMinutes } from "date-fns";
import esES from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// Localizer (date-fns)
const locales = { es: esES };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: esES }),
  getDay,
  locales,
});

function safeParseDate(isoString) {
  // scheduled_date viene como "2025-12-26T11:13:00.000000Z"
  // parseISO maneja Z correctamente
  try {
    return isoString ? parseISO(isoString) : null;
  } catch {
    return null;
  }
}

export default function Index({ schedules }) {

  // Calendario controlado (evita glitches)
  const [calendarView, setCalendarView] = useState(Views.MONTH);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Filtrar solo schedules generados y aprobados
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => 
      schedule.status === 'generated' || schedule.status === 'approved'
    );
  }, [schedules]);

  // Transform schedules -> events
  const calendarEvents = useMemo(() => {
    return filteredSchedules
      .map((s) => {
        const start = safeParseDate(s.scheduled_date);
        if (!start) return null;

        // Si no tenés end en backend, definimos duración default (30 min)
        const end = addMinutes(start, 30);

        const networks = Array.isArray(s.networks) ? s.networks.join(", ") : "";
        const titleBase = s.idea ? String(s.idea).split("\n")[0] : `Schedule #${s.id}`;
        const title = `${titleBase}${networks ? ` (${networks})` : ""}`;

        return {
          id: s.id,
          title,
          start,
          end,
          resource: s,
        };
      })
      .filter(Boolean);
  }, [filteredSchedules]);

  const onSelectEvent = (ev) => {
    const id = ev?.resource?.id ?? ev?.id;
    if (!id) return;

    // Ajustá si tu ruta real es distinta
    router.visit(`/schedules/${id}`);
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header con indicador de filtro */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                Calendario de Publicaciones
              </h1>
              <p className="mt-2 text-gray-600">
                Mostrando <span className="font-semibold text-blue-600">{calendarEvents.length}</span> publicaciones generadas y aprobadas programadas
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Se muestran publicaciones con estado "generated" o "approved"</span>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="flex gap-4">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{calendarEvents.length}</div>
                <div className="text-xs text-gray-500">Generadas/Aprobadas</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-400">{schedules.length - calendarEvents.length}</div>
                <div className="text-xs text-gray-500">Otros estados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor del calendario con mejor diseño */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#002073] px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Vista de Calendario</h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Publicaciones Generadas/Aprobadas</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                popup
                selectable={false}
                view={calendarView}
                onView={setCalendarView}
                date={calendarDate}
                onNavigate={setCalendarDate}
                onSelectEvent={onSelectEvent}
                style={{ height: "100%", width: "100%" }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                tooltipAccessor="title"
                messages={{
                  next: "Siguiente",
                  previous: "Anterior",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  date: "Fecha",
                  time: "Hora",
                  event: "Publicación",
                  noEventsInRange: "No hay publicaciones generadas o aprobadas en este rango",
                }}
                eventPropGetter={(event) => ({
                  className: "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white rounded-lg shadow-sm",
                  style: {
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    padding: '2px 6px',
                  }
                })}
              />
            </div>
          </div>
        </div>

        {/* Pie informativo */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Generadas/Aprobadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Otros estados</span>
              </div>
            </div>
            <button
              onClick={() => router.visit(route('schedules.index'))}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
            >
              Ver todas las publicaciones
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}