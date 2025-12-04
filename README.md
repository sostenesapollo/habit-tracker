# Habit Tracker

Um aplicativo Next.js para controle de hábitos diários, similar ao gráfico de contribuições do GitHub.

## Características

- ✅ Visualizações: Anual, Semanal e Semestral
- ✅ PWA instalável (funciona offline)
- ✅ Sincronização via export/import
- ✅ Cada hábito tem título, cor e ícone personalizados
- ✅ Interface moderna e responsiva
- ✅ Armazenamento local (localStorage)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Build para Produção

```bash
npm run build
npm start
```

## Funcionalidades

### Gerenciar Hábitos
- Adicionar novos hábitos com título, cor e ícone
- Editar hábitos existentes
- Excluir hábitos

### Visualizações
- **Semanal**: Mostra os últimos 7 dias
- **Semestral**: Mostra os últimos 6 meses
- **Anual**: Mostra todo o ano atual

### Sincronização
- Exportar dados para arquivo JSON
- Importar dados de arquivo JSON
- Dados armazenados localmente no navegador

### PWA
- Instalável como aplicativo
- Funciona offline
- Service Worker para cache

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- date-fns
- lucide-react
- Service Worker (PWA)

## Estrutura do Projeto

```
habit-tracker/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── register-sw.tsx
├── components/
│   ├── HabitManager.tsx
│   ├── HabitGrid.tsx
│   ├── ViewSelector.tsx
│   └── SyncButton.tsx
├── hooks/
│   └── useHabits.ts
├── services/
│   └── storage.ts
├── types/
│   └── index.ts
└── public/
    ├── manifest.json
    └── sw.js
```

