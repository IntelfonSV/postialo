<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    // Guardar el token cuando se instancia la notificación
    public function __construct($token)
    {
        $this->token = $token;
    }
    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
        return (new MailMessage)
        ->from('postialo@red.com.sv', 'PostIAlo') // tu remitente
        ->subject('Restablece tu contraseña')      // nuevo asunto
        ->greeting('¡Hola!')
        ->line('Recibiste este correo porque solicitaste restablecer tu contraseña.')
        ->action('Restablecer contraseña', $resetUrl)
        ->line('Si no solicitaste este cambio, ignora este correo.')
        ->salutation('Atentamente,')
        ->line('PostIAlo');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
