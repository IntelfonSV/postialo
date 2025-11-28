<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partner;

class PartnerSeeder extends Seeder
{
    /**
     * Ejecuta la carga de datos inicial de partners/alianzas.
     */
    public function run(): void
    {
        $partners = [
            [
                'code' => 'AERO',
                'name' => 'Aeromall Alliance',
                'contact_email' => 'contacto@aeromall.com',
                'logo_path' => '/storage/partners/aeromall/logo.png',
                'restrictions' => [
                    'fixed_fields' => [
                        'logo', 
                        'whatsapp_number', 
                        'make_url'
                    ]
                ],
                'branding' => [
                    'logo'      => '/storage/partners/aeromall/logo.png',
                    'whatsapp'  => '+50370000000',
                    'url'       => 'https://aeromall.red.com.sv',
                    'theme'     => [
                        'primary_color' => '#0056B3',
                        'secondary_color' => '#00AEEF',
                        'background' => '#FFFFFF',
                        'text_color' => '#222222'
                    ]
                ],
                'active' => true,
            ]
        ];

        foreach ($partners as $data) {
            Partner::updateOrCreate(
                ['code' => strtoupper($data['code'])],
                $data
            );
        }

        $this->command->info('✅ Partners iniciales creados exitosamente.');
    }
}
