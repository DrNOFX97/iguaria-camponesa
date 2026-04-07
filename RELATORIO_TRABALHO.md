# Relatório de Trabalho — Iguaria Camponesa
**Cliente:** Custódio Guerreiro / Restaurante Iguaria Camponesa
**Projecto:** Website + Sistema de Gestão
**Última actualização:** 7 de Abril de 2026

---

## Resumo Executivo

Desenvolvimento de raiz de um website moderno e sistema de gestão completo para o Restaurante Iguaria Camponesa (Faro, desde 1987). A plataforma inclui um site público para clientes e um painel de administração privado para gestão do restaurante, com base de dados em tempo real (Supabase).

---

## Cronologia do Trabalho

### Fase 1 — Protótipo HTML (7 Mar 2026)

Desenvolvimento de um protótipo inicial em HTML/CSS puro (`index.html`) para validação do design e conteúdo com o cliente. Serviu de base para definir a identidade visual e estrutura de conteúdos.

**Entregáveis:**
- Protótipo estático com layout do site
- Levantamento dos conteúdos: texto, secções, identidade visual
- Logos fornecidos pelo cliente (`Logo IC.png`, `Logo IC_limpo1.png`, `Logo IC_limpo2.png`)

---

### Fase 2 — Aplicação React + Base de Dados (7–8 Mar 2026)

Migração do protótipo para uma aplicação web moderna com React 19 + Vite, e implementação do painel de administração com base de dados Supabase (PostgreSQL).

**Stack tecnológico escolhido:**
- **Frontend:** React 19.2 + Vite 7.3 + Tailwind CSS 3.4
- **Base de dados:** Supabase (PostgreSQL + Auth + Storage)
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **Routing:** React Router v7

#### Site Público — Componentes desenvolvidos

| Componente | Descrição | Linhas |
|---|---|---|
| `Header.jsx` | Navegação fixa com scroll suave e menu móvel | 135 |
| `Hero.jsx` | Ecrã inicial com parallax e animações de entrada | 122 |
| `PratosDodia.jsx` | Montra dos pratos do dia (liga à BD) | 81 |
| `Galeria.jsx` | Galeria fotográfica com lightbox | 120 |
| `Sobre.jsx` | Secção "Sobre nós" com história do restaurante | 104 |
| `Reservas.jsx` | Formulário de reservas para clientes | 215 |
| `Footer.jsx` | Rodapé com contactos e redes sociais | 89 |
| `Separador.jsx` | Elemento decorativo de separação de secções | 24 |

#### Painel de Administração — Módulos desenvolvidos

| Módulo | Funcionalidade | Linhas |
|---|---|---|
| `Login.jsx` | Página de autenticação | 63 |
| `AdminLayout.jsx` | Layout do painel com sidebar e navegação | 193 |
| `Dashboard.jsx` | Estatísticas, gráficos de reservas (Recharts) | 169 |
| `Reservas.jsx` | Gestão de reservas (confirmar/cancelar/filtrar) | 198 |
| `PratosDodia.jsx` | Definir pratos do dia por data | 241 |
| `Menu.jsx` | CRUD completo da ementa (criar/editar/apagar pratos) | 252 |
| `Galeria.jsx` | Upload e gestão de fotos (Supabase Storage) | 234 |
| `Calendario.jsx` | Gestão de disponibilidade por data | 199 |

#### Base de Dados — Schema Supabase

5 tabelas criadas com políticas de segurança (RLS):

- **`reservas`** — pedidos de reserva dos clientes
- **`pratos`** — ementa completa com categorias e preços
- **`pratos_do_dia`** — ligação entre pratos e datas específicas
- **`galeria`** — metadados das fotografias
- **`calendario`** — disponibilidade diária (Disponível / Lotado / Fechado)

**Primeiro build de produção** gerado em `dist/` — 8 Mar 2026.

---

### Fase 3 — Conteúdos e Fotografia (9 Mar 2026)

Integração das fotografias reais do restaurante e refinamento dos componentes públicos.

**Fotografias integradas (12 imagens):**
- Frente do restaurante (exterior nocturno)
- 7 fotografias de pratos
- 3 fotografias da sala/interior

**Ajustes de componentes:**
- `Hero.jsx` — fotografia real de fundo com parallax
- `Sobre.jsx` — conteúdo final do restaurante
- `Galeria.jsx` — galeria com fotos reais
- `Header.jsx` e `Footer.jsx` — contactos e informações reais
- `PratosDodia.jsx` — layout final

---

### Fase 4 — Auditoria Técnica (7 Abr 2026)

Revisão completa do código para identificar problemas antes do lançamento ao público.

**Total de código analisado:** ~2.600 linhas em 19 ficheiros

**Problemas identificados:** 35 (classificados por prioridade)

#### Críticos (bloqueiam o lançamento)
1. **Autenticação do admin não está activa** — qualquer pessoa pode aceder ao painel escrevendo o URL directamente
2. **Formulário de reservas não grava na base de dados** — as reservas dos clientes perdem-se
3. **Política de base de dados (RLS) invertida** nas reservas

#### Importantes (a resolver antes de lançar)
4. Sem tratamento de erros nas queries à base de dados
5. Formulário não verifica disponibilidade (tabela `calendario`) antes de aceitar reserva
6. Problemas de acessibilidade: labels/inputs não associados, contraste insuficiente
7. Layout mobile cortado pelo botão de reserva fixo

#### Melhorias (próximas versões)
8. Imagens sem lazy loading (performance em mobile)
9. Links das redes sociais sem destino
10. Email de confirmação ao cliente após reserva
11. Notificações em tempo real no admin para novas reservas

---

## Estado Actual

| Área | Estado |
|---|---|
| Site público — design e layout | Completo |
| Site público — conteúdos e fotografias | Completo |
| Painel de administração — todos os módulos | Completo |
| Base de dados Supabase — schema e tabelas | Completo |
| Autenticação segura (Google OAuth) | **Em configuração** |
| Formulário de reservas → base de dados | Pendente |
| Tratamento de erros e validações | Pendente |
| Testes e lançamento | Pendente |

---

## Próximos Passos (Plano Acordado)

### Imediato (pré-requisito)
- Configurar Google OAuth no Google Cloud Console
- Activar provider Google no Supabase

### Prioridade 1 — Antes do lançamento
1. Implementar autenticação real no painel de admin (login Google)
2. Ligar formulário de reservas à base de dados
3. Corrigir políticas de segurança da base de dados (RLS)

### Prioridade 2 — Sprint seguinte
4. Tratamento de erros em todas as operações de base de dados
5. Validação de disponibilidade no formulário de reservas
6. Correcções de acessibilidade

### Prioridade 3 — Versões futuras
7. Email de confirmação automático ao cliente
8. Notificações em tempo real no admin
9. Dashboard com filtros de data configuráveis
10. Optimização de imagens para mobile

---

## Registo de Horas

### Sessão 1 — 7 Mar → 8 Mar 2026 (noite)
**Período:** 22:45 – 00:55 | **Total: 3h00**

| Hora | Actividade |
|---|---|
| 22:45 – 23:00 | Setup do ambiente de desenvolvimento, organização de assets |
| 23:00 – 23:29 | Definição da estrutura de conteúdos e identidade visual com base nos materiais do cliente |
| 23:29 – 23:45 | Desenvolvimento do protótipo HTML (49KB — página completa com todas as secções) |
| 23:45 – 00:00 | Inicialização do projecto React + Vite, configuração de Tailwind, PostCSS, ESLint |
| 00:00 – 00:20 | Desenvolvimento dos 8 módulos do painel de administração (Dashboard, Reservas, Pratos do Dia, Menu, Galeria, Calendário) |
| 00:20 – 00:42 | Schema da base de dados Supabase, políticas RLS, integração do cliente Supabase |
| 00:42 – 00:55 | Login, AdminLayout, build de produção e revisão visual com Playwright (7 screenshots) |

---

### Sessão 2 — 9 Mar 2026 (tarde)
**Período:** 15:30 – 17:00 | **Total: 1h30**

| Hora | Actividade |
|---|---|
| 15:30 – 16:10 | Selecção, redimensionamento e preparação das 12 fotografias do restaurante |
| 16:10 – 16:25 | Integração das fotografias no site (Hero, Galeria, Sobre), actualização dos componentes com conteúdo real |
| 16:25 – 17:00 | Ajustes finais ao Header, Footer (contactos reais), PratosDodia, revisão geral do site com conteúdo real |

---

### Sessão 3 — 6–7 Abr 2026 (noite)
**Período:** 23:00 – 01:00 | **Total: 2h00**

| Hora | Actividade |
|---|---|
| 23:00 – 23:45 | Auditoria técnica completa do código — análise de 19 ficheiros, 2.600 linhas, identificação de 35 problemas |
| 23:45 – 00:15 | Elaboração do plano de melhorias por prioridade (P1/P2/P3), guia de configuração Google OAuth + Supabase |
| 00:15 – 01:00 | Documentação técnica (CLAUDE.md), relatório de trabalho, registo de memória do projecto |

---

### Resumo de Horas

| Sessão | Data | Período | Horas |
|---|---|---|---|
| Sessão 1 | 7–8 Mar 2026 | 22:45 – 00:55 | **3h00** |
| Sessão 2 | 9 Mar 2026 | 15:30 – 17:00 | **1h30** |
| Sessão 3 | 6–7 Abr 2026 | 23:00 – 01:00 | **2h00** |
| **TOTAL** | | | **6h30** |

---

## Métricas do Projecto

| Métrica | Valor |
|---|---|
| Ficheiros de código | 19 |
| Linhas de código | ~2.600 |
| Componentes React | 15 |
| Tabelas na base de dados | 5 |
| Fotografias integradas | 12 |
| Módulos do painel admin | 8 |
| Builds de produção | 1 (8 Mar 2026) |

---

*Documento gerado automaticamente com base nos registos do projecto. Actualizar após cada sessão de trabalho.*
