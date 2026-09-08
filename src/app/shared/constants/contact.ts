/**
 * Dados de contato da fotógrafa, usados em vários pontos do site
 * (navbar, rodapé, botão flutuante, páginas). Fonte única — mudar o
 * número ou a mensagem padrão aqui atualiza o site inteiro.
 */

// Mensagem já preenchida quando o visitante clica no link do WhatsApp.
const DEFAULT_WHATSAPP_MESSAGE =
  'Olá, Rallyne! Vi seu portfólio no site e gostaria de saber mais sobre um ensaio/cobertura fotográfica.';

// Número em formato de exibição (com máscara, para mostrar na tela).
export const WHATSAPP_PHONE_DISPLAY = '+55 84 99648-6345';

// Link direto para o WhatsApp já com a mensagem preenchida.
export const WHATSAPP_URL = `https://wa.me/5584996486345?text=${encodeURIComponent(
  DEFAULT_WHATSAPP_MESSAGE
)}`;

export const INSTAGRAM_URL = 'https://www.instagram.com/rallynefotografia';
