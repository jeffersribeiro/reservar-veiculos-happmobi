import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type TabKey = 'home' | 'bookings' | 'help' | 'profile';

type ContactVm = {
  label: string;
  value: string;
  hint?: string;
  icon: 'whatsapp' | 'phone' | 'email' | 'location';
};

type FaqVm = {
  q: string;
  a: string;
  open?: boolean;
};

@Component({
  selector: 'app-help-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-screen.component.html',
  styleUrls: ['./help-screen.component.css'],
})
export class HelpScreenComponent {
  activeTab: TabKey = 'help';

  contacts: ContactVm[] = [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+55 (81) 99999-0000',
      hint: 'Resposta rápida',
    },
    {
      icon: 'phone',
      label: 'Telefone',
      value: '0800 123 456',
      hint: 'Seg–Sex • 08:00–18:00',
    },
    {
      icon: 'email',
      label: 'Email',
      value: 'suporte@reservacarros.com',
      hint: 'Até 24h úteis',
    },
    {
      icon: 'location',
      label: 'Endereço',
      value: 'Recife • PE',
      hint: 'Somente para referência',
    },
  ];

  faq: FaqVm[] = [
    {
      q: 'Como faço uma reserva?',
      a: 'Na tela inicial, escolha um veículo disponível e toque em “Reservar”. Depois, confirme o período e finalize.',
      open: true,
    },
    {
      q: 'Posso cancelar uma reserva?',
      a: 'Sim. Vá em “Minhas Reservas”, abra a reserva ativa e selecione “Cancelar”.',
    },
    {
      q: 'Por que um veículo aparece como indisponível?',
      a: 'Ele pode estar reservado por outro usuário, em manutenção ou aguardando liberação.',
    },
    {
      q: 'Como falar com o suporte?',
      a: 'Use o WhatsApp, telefone ou email na seção “Contatos” abaixo.',
    },
  ];

  setTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  toggleFaq(item: FaqVm): void {
    item.open = !item.open;
  }

  startChat(): void {}
  reportIssue(): void {}
  viewPolicies(): void {}
}
