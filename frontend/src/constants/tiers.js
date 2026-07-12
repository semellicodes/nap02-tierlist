// Gradiente quente -> frio: reforça visualmente a hierarquia, do mais intenso ao mais neutro.
export const TIERS = [
  {
    key: 'S',
    title: 'Imperdível',
    meaning: 'Os favoritos absolutos, sem dúvida nenhuma.',
    color: '#f23545',
    psychology: 'Vermelho transmite paixão e urgência.',
  },
  {
    key: 'A',
    title: 'Muito bom',
    meaning: 'Quase perfeito, recomendo de olhos fechados.',
    color: '#ff8c42',
    psychology: 'Laranja transmite energia e entusiasmo.',
  },
  {
    key: 'B',
    title: 'Bom',
    meaning: 'Vale a pena, mas não é inesquecível.',
    color: '#ffd166',
    psychology: 'Amarelo transmite otimismo e equilíbrio.',
  },
  {
    key: 'C',
    title: 'Ok',
    meaning: 'Mediano — nem marcante, nem ruim.',
    color: '#8bd17c',
    psychology: 'Verde transmite calma e neutralidade.',
  },
  {
    key: 'D',
    title: 'Dispensável',
    meaning: 'Não recomendo, ficou devendo.',
    color: '#5c9df5',
    psychology: 'Azul transmite baixa prioridade e distância.',
  },
]

export const TIER_KEYS = TIERS.map((tier) => tier.key)
