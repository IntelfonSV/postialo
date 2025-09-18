<?php
// app/Services/Payment/ScheduleGenerator.php
namespace App\Services\Payment;

use Carbon\Carbon;
use Illuminate\Support\Collection;

class ScheduleGenerator
{
    /**
     * Genera fechas de cobro a partir de $start según intervalo en meses
     * para los próximos $years años.
     *
     * @param  \Carbon\Carbon|string  $start          Fecha inicial (Carbon o string parseable).
     * @param  int                   $intervalMonths Intervalo en meses (>=1).
     * @param  int                   $years          Cantidad de años a proyectar (default 5).
     * @param  bool                  $includeStart   Si true incluye la fecha inicial como primer cargo.
     * @return \Illuminate\Support\Collection        Colección de Carbon ordenada asc.
     * @throws \InvalidArgumentException
     */
    public static function generate($start, int $intervalMonths = 1, int $years = 1, bool $includeStart = true): Collection
    {
        if ($intervalMonths < 1) {
            throw new \InvalidArgumentException('intervalMonths debe ser >= 1');
        }

        $cursor = $start instanceof Carbon ? $start->copy() : Carbon::parse($start);
        $cursor->startOfDay();

        $end = $cursor->copy()->addYears($years);
        $dates = collect();

        if ($includeStart) {
            $dates->push($cursor->copy());
        }

        while (true) {
            // addMonthsNoOverflow preserva el "día ancla" lo mejor posible en meses cortos
            $next = $cursor->copy()->addMonthsNoOverflow($intervalMonths);

            if ($next->gt($end)) {
                break;
            }

            $dates->push($next);
            $cursor = $next;
        }

        return $dates;
    }

    /**
     * Devuelve un array de strings 'Y-m-d' a partir de la colección de Carbon.
     *
     * @param \Illuminate\Support\Collection|array $dates
     * @return array
     */
    public static function asYmdArray($dates): array
    {
        return collect($dates)->map(fn($d) => $d instanceof Carbon ? $d->format('Y-m-d') : Carbon::parse($d)->format('Y-m-d'))->all();
    }
}
