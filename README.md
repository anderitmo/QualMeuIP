# QualMeuIP - Consulta de IP, Geolocalização e Whois

Aplicação em JavaScript Puro (Vanilla JS), HTML5 e CSS3 para exibir o endereço IP (IPv4 e IPv6) do visitante, dados detalhados de Whois / geolocalização e mapa interativo em tempo real.

## 🚀 Funcionalidades

- **Detecção de IP**: Exibe o endereço **IPv4** e **IPv6** do visitante em tempo real.
- **Informações de Whois & Localidade**:
  - País (com bandeira), Estado/Região, Cidade e Código Postal (CEP).
  - Provedor de Internet (ISP), Organização e ASN.
  - Fuso horário e coordenadas geográficas (Latitude e Longitude).
- **Mapa Interativo Gratuito**: Exibe a posição exata da localidade no mapa utilizando [Leaflet.js](https://leafletjs.com/) e [OpenStreetMap](https://www.openstreetmap.org/).
- **Busca por IP**: Permite pesquisar qualquer endereço IP v4 ou v6 personalizado.
- **Cópia Rápida**: Botão para copiar facilmente o IP com apenas um clique.
- **Interface Moderna e Responsiva**: Layout escuro (Dark Theme) limpo e adaptado para dispositivos móveis e desktop.

## 🛠️ Tecnologias e Serviços Utilizados

- **HTML5 / CSS3 / JavaScript Pure (Vanilla JS)** (Sem frameworks pesados)
- **APIs de IP & Geocodificação**:
  - `ipify` (`api4.ipify.org` e `api64.ipify.org`) para identificação direta de IPv4 e IPv6.
  - `ipwho.is` para dados de geolocalização, ISP, ASN e fuso horário.
- **Mapa**:
  - `Leaflet.js` com dados e tiles do `OpenStreetMap` (totalmente gratuito e sem necessidade de chave de API).

## 💻 Como Executar

Não é necessária nenhuma instalação ou compilação de pacotes.

1. Clone ou baixe o repositório.
2. Abra o arquivo `index.html` em qualquer navegador web moderno.
3. Ou sirva utilizando um servidor HTTP local simples (ex: `python -m http.server` ou a extensão *Live Server* do VS Code).
