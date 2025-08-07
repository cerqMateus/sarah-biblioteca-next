import { NextRequest, NextResponse } from 'next/server';
import { createReminderNotifications, createCompletionNotifications } from '@/lib/notificationService';

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        if (action === 'reminders') {
            await createReminderNotifications();
            return NextResponse.json({
                success: true,
                message: 'Lembretes processados com sucesso'
            });
        }

        if (action === 'completions') {
            await createCompletionNotifications();
            return NextResponse.json({
                success: true,
                message: 'Notificações de conclusão processadas com sucesso'
            });
        }

        if (action === 'all') {
            await createReminderNotifications();
            await createCompletionNotifications();
            return NextResponse.json({
                success: true,
                message: 'Todas as notificações processadas com sucesso'
            });
        }

        return NextResponse.json(
            { error: 'Ação inválida. Use: reminders, completions, ou all' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Erro ao processar notificações:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
