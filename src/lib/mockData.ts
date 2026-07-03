// LandWatch Mock Data — Propriedades agrícolas realistas do Brasil
// Dados baseados em coordenadas reais do Cerrado, Amazônia e Mata Atlântica
// As séries temporais refletem variações conhecidas (El Niño 2023, seca 2021, etc.)

export type BiomeType = 'Cerrado' | 'Amazônia' | 'Mata Atlântica' | 'Pantanal' | 'Pampa';
export type PropertyStatus = 'productive' | 'declining' | 'degraded' | 'recovering';
export type AlertLevel = 'critical' | 'warning' | 'info' | 'ok';

export interface YearlyScore {
  year: number;
  score: number;              // 0–100 produtividade calculada
  ndvi_proxy: number;         // 0–1 proxy de NDVI
  embedding_change: number;   // dot product com ano anterior (1=idêntico, -1=oposto)
  label: string;              // contexto do ano (El Niño, seca, etc.)
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  year: number;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'recuperação' | 'manejo' | 'irrigação' | 'reflorestamento' | 'rotação';
  title: string;
  description: string;
  estimated_impact: string;
}

export interface PropertyData {
  id: string;
  name: string;
  owner: string;
  area_ha: number;
  biome: BiomeType;
  municipality: string;
  state: string;
  centroid: [number, number]; // [lat, lng]
  polygon: [number, number][]; // array of [lat, lng]
  scores: YearlyScore[];
  current_score: number;
  status: PropertyStatus;
  alerts: Alert[];
  recommendations: Recommendation[];
  car_number: string; // Cadastro Ambiental Rural
}

// ──────────────────────────────────────────────
// PROPRIEDADES MOCK
// ──────────────────────────────────────────────

export const MOCK_PROPERTIES: PropertyData[] = [
  {
    id: 'prop-001',
    name: 'Fazenda São Benedito',
    owner: 'Carlos Rezende',
    area_ha: 1240,
    biome: 'Cerrado',
    municipality: 'Sorriso',
    state: 'MT',
    centroid: [-12.2500, -55.6000],
    car_number: 'MT-5107909-4F2A3B1C8D',
    polygon: [
      [-12.240, -55.580],
      [-12.240, -55.620],
      [-12.270, -55.620],
      [-12.270, -55.580],
      [-12.240, -55.580],
    ],
    scores: [
      { year: 2017, score: 82, ndvi_proxy: 0.71, embedding_change: 1.0, label: 'Ano base' },
      { year: 2018, score: 79, ndvi_proxy: 0.68, embedding_change: 0.94, label: 'Leve queda' },
      { year: 2019, score: 77, ndvi_proxy: 0.66, embedding_change: 0.91, label: 'Expansão de soja' },
      { year: 2020, score: 74, ndvi_proxy: 0.63, embedding_change: 0.88, label: 'Seca regional' },
      { year: 2021, score: 71, ndvi_proxy: 0.60, embedding_change: 0.85, label: 'Seca severa MT' },
      { year: 2022, score: 73, ndvi_proxy: 0.62, embedding_change: 0.89, label: 'Recuperação parcial' },
      { year: 2023, score: 68, ndvi_proxy: 0.57, embedding_change: 0.82, label: 'El Niño 2023' },
      { year: 2024, score: 65, ndvi_proxy: 0.55, embedding_change: 0.80, label: 'Queda acumulada' },
    ],
    current_score: 65,
    status: 'declining',
    alerts: [
      {
        id: 'a001',
        level: 'warning',
        title: 'Queda acumulada de 21% (2017–2024)',
        description: 'Score de produtividade caiu de 82 para 65 em 7 anos. Tendência de degradação confirmada.',
        year: 2024,
      },
      {
        id: 'a002',
        level: 'info',
        title: 'El Niño afetou a produtividade em 2023',
        description: 'Redução de 7% no score em relação a 2022 correlacionada com anomalias climáticas.',
        year: 2023,
      },
    ],
    recommendations: [
      {
        id: 'r001',
        priority: 'high',
        category: 'rotação',
        title: 'Implementar rotação soja–milho–pastagem',
        description: 'A alternância de culturas com pastagem plantada recupera matéria orgânica do solo. Estimativa: recuperação de 8–12 pontos de score em 2 anos.',
        estimated_impact: '+10 pontos de score estimados',
      },
      {
        id: 'r002',
        priority: 'medium',
        category: 'manejo',
        title: 'Plantio direto com cobertura de palhada',
        description: 'Reduz erosão e mantém umidade do solo. Cerrado perde 30% mais umidade após El Niño em solo exposto.',
        estimated_impact: 'Redução de 40% da erosão',
      },
      {
        id: 'r003',
        priority: 'medium',
        category: 'irrigação',
        title: 'Verificar eficiência do sistema de irrigação',
        description: 'Área com quedas em anos de seca pode se beneficiar de gotejamento subsidiário.',
        estimated_impact: 'Estabilização em anos de déficit hídrico',
      },
    ],
  },
  {
    id: 'prop-002',
    name: 'Fazenda Boa Esperança',
    owner: 'Grupo Agropastoril Meireles',
    area_ha: 3800,
    biome: 'Cerrado',
    municipality: 'Lucas do Rio Verde',
    state: 'MT',
    centroid: [-12.8000, -55.7000],
    car_number: 'MT-5105259-9A1B2C3D4E',
    polygon: [
      [-12.780, -55.680],
      [-12.780, -55.720],
      [-12.820, -55.720],
      [-12.820, -55.680],
      [-12.780, -55.680],
    ],
    scores: [
      { year: 2017, score: 88, ndvi_proxy: 0.76, embedding_change: 1.0, label: 'Pico de produção' },
      { year: 2018, score: 91, ndvi_proxy: 0.79, embedding_change: 0.97, label: 'Expansão irrigada' },
      { year: 2019, score: 89, ndvi_proxy: 0.77, embedding_change: 0.95, label: 'Estável' },
      { year: 2020, score: 85, ndvi_proxy: 0.74, embedding_change: 0.92, label: 'Seca pontual' },
      { year: 2021, score: 84, ndvi_proxy: 0.73, embedding_change: 0.91, label: 'Recuperação rápida' },
      { year: 2022, score: 87, ndvi_proxy: 0.75, embedding_change: 0.94, label: 'Safra recorde' },
      { year: 2023, score: 83, ndvi_proxy: 0.72, embedding_change: 0.90, label: 'El Niño impacto leve' },
      { year: 2024, score: 86, ndvi_proxy: 0.74, embedding_change: 0.93, label: 'Recuperação em curso' },
    ],
    current_score: 86,
    status: 'productive',
    alerts: [
      {
        id: 'a003',
        level: 'ok',
        title: 'Propriedade estável e produtiva',
        description: 'Score acima de 80 em todos os anos. Boas práticas de manejo sustentável detectadas.',
        year: 2024,
      },
    ],
    recommendations: [
      {
        id: 'r004',
        priority: 'low',
        category: 'reflorestamento',
        title: 'Ampliar APP e reserva legal',
        description: 'Propriedade pode explorar créditos de carbono com ampliação de vegetação nativa além do CAR.',
        estimated_impact: 'Potencial de R$180/ha em créditos de carbono',
      },
    ],
  },
  {
    id: 'prop-003',
    name: 'Sítio Duas Barras',
    owner: 'Ana Luíza Ferreira',
    area_ha: 320,
    biome: 'Cerrado',
    municipality: 'Jataí',
    state: 'GO',
    centroid: [-18.1000, -51.8000],
    car_number: 'GO-5221700-3B4C5D6E7F',
    polygon: [
      [-18.080, -51.780],
      [-18.080, -51.820],
      [-18.120, -51.820],
      [-18.120, -51.780],
      [-18.080, -51.780],
    ],
    scores: [
      { year: 2017, score: 61, ndvi_proxy: 0.52, embedding_change: 1.0, label: 'Estado inicial' },
      { year: 2018, score: 55, ndvi_proxy: 0.46, embedding_change: 0.87, label: 'Abandono parcial' },
      { year: 2019, score: 47, ndvi_proxy: 0.39, embedding_change: 0.76, label: 'Degradação avançando' },
      { year: 2020, score: 38, ndvi_proxy: 0.31, embedding_change: 0.65, label: 'Solo exposto detectado' },
      { year: 2021, score: 33, ndvi_proxy: 0.27, embedding_change: 0.60, label: 'Crítico — pior ano' },
      { year: 2022, score: 35, ndvi_proxy: 0.29, embedding_change: 0.63, label: 'Início de recuperação' },
      { year: 2023, score: 41, ndvi_proxy: 0.34, embedding_change: 0.70, label: 'Recuperação em curso' },
      { year: 2024, score: 48, ndvi_proxy: 0.41, embedding_change: 0.78, label: 'Tendência positiva' },
    ],
    current_score: 48,
    status: 'recovering',
    alerts: [
      {
        id: 'a004',
        level: 'warning',
        title: 'Score ainda abaixo do nível mínimo (50)',
        description: 'Apesar da recuperação, a propriedade ainda está em zona de risco. Score atingiu mínimo de 33 em 2021.',
        year: 2024,
      },
      {
        id: 'a005',
        level: 'info',
        title: 'Tendência positiva confirmada desde 2021',
        description: 'Recuperação de +15 pontos nos últimos 3 anos. Continue as práticas de recuperação.',
        year: 2024,
      },
    ],
    recommendations: [
      {
        id: 'r005',
        priority: 'high',
        category: 'recuperação',
        title: 'Manter pastagem rotacionada com braquiária',
        description: 'A cobertura vegetal detectada indica início de recuperação. Pastagem rotacionada evita recompactação do solo.',
        estimated_impact: '+20 pontos de score em 3 anos',
      },
      {
        id: 'r006',
        priority: 'high',
        category: 'reflorestamento',
        title: 'Reflorestamento de faixas de APP',
        description: 'Áreas de preservação permanente detectadas como solo exposto. Replantio urgente para evitar multas e erosão.',
        estimated_impact: 'Compliance CAR + redução de erosão hídrica',
      },
    ],
  },
  {
    id: 'prop-004',
    name: 'Fazenda Nova Aliança',
    owner: 'Cooperativa COOPRATA',
    area_ha: 5600,
    biome: 'Amazônia',
    municipality: 'Novo Progresso',
    state: 'PA',
    centroid: [-7.3000, -55.1000],
    car_number: 'PA-1505809-1A9B8C7D6E',
    polygon: [
      [-7.280, -55.080],
      [-7.280, -55.120],
      [-7.320, -55.120],
      [-7.320, -55.080],
      [-7.280, -55.080],
    ],
    scores: [
      { year: 2017, score: 78, ndvi_proxy: 0.67, embedding_change: 1.0, label: 'Uso misto floresta-pastagem' },
      { year: 2018, score: 70, ndvi_proxy: 0.59, embedding_change: 0.86, label: 'Desmatamento detectado' },
      { year: 2019, score: 58, ndvi_proxy: 0.48, embedding_change: 0.74, label: 'Queimadas 2019' },
      { year: 2020, score: 44, ndvi_proxy: 0.36, embedding_change: 0.61, label: 'Conversão agropecuária' },
      { year: 2021, score: 37, ndvi_proxy: 0.29, embedding_change: 0.55, label: 'Solo degradado' },
      { year: 2022, score: 34, ndvi_proxy: 0.27, embedding_change: 0.52, label: 'Pior ano — intervenção necessária' },
      { year: 2023, score: 36, ndvi_proxy: 0.29, embedding_change: 0.55, label: 'Estabilização mínima' },
      { year: 2024, score: 39, ndvi_proxy: 0.32, embedding_change: 0.58, label: 'Tímida recuperação' },
    ],
    current_score: 39,
    status: 'degraded',
    alerts: [
      {
        id: 'a006',
        level: 'critical',
        title: '🚨 CRÍTICO — Queda de 50% em 5 anos',
        description: 'Score caiu de 78 para 39 entre 2017 e 2024. Desmatamento e queimadas identificados. Risco de embargo.',
        year: 2024,
      },
      {
        id: 'a007',
        level: 'critical',
        title: 'Queimadas detectadas em 2019',
        description: 'Mudança abrupta de embedding detectada entre 2018 e 2019 (dot product: 0.74). Consistente com queimadas registradas no Atlas do INPE.',
        year: 2019,
      },
    ],
    recommendations: [
      {
        id: 'r007',
        priority: 'high',
        category: 'recuperação',
        title: 'Acionar programa de recuperação de pastagens degradadas (RP) do ABC+',
        description: 'Programa federal oferece crédito rural com juros subsidiados para recuperação de pastagens. Propriedade se qualifica.',
        estimated_impact: 'Acesso a R$2.5M em crédito rural a 6% a.a.',
      },
      {
        id: 'r008',
        priority: 'high',
        category: 'reflorestamento',
        title: 'Verificar conformidade com CAR e desembargos',
        description: 'Área na Amazônia Legal com desmatamento detectado pode estar sujeita a embargo do IBAMA.',
        estimated_impact: 'Regularização fundiária e acesso a crédito',
      },
    ],
  },
  {
    id: 'prop-005',
    name: 'Fazenda Panorama',
    owner: 'Henrique Lacerda',
    area_ha: 890,
    biome: 'Cerrado',
    municipality: 'Campo Grande',
    state: 'MS',
    centroid: [-20.1000, -54.2000],
    car_number: 'MS-5002704-5E6F7A8B9C',
    polygon: [
      [-20.080, -54.180],
      [-20.080, -54.220],
      [-20.120, -54.220],
      [-20.120, -54.180],
      [-20.080, -54.180],
    ],
    scores: [
      { year: 2017, score: 72, ndvi_proxy: 0.62, embedding_change: 1.0, label: 'Pastagem extensiva' },
      { year: 2018, score: 74, ndvi_proxy: 0.64, embedding_change: 0.96, label: 'Melhoria gradual' },
      { year: 2019, score: 76, ndvi_proxy: 0.65, embedding_change: 0.97, label: 'Introdução ILPF' },
      { year: 2020, score: 78, ndvi_proxy: 0.67, embedding_change: 0.98, label: 'ILPF consolidado' },
      { year: 2021, score: 80, ndvi_proxy: 0.69, embedding_change: 0.99, label: 'Produtividade crescente' },
      { year: 2022, score: 83, ndvi_proxy: 0.72, embedding_change: 0.99, label: 'Melhor ano histórico' },
      { year: 2023, score: 81, ndvi_proxy: 0.70, embedding_change: 0.97, label: 'Leve queda El Niño' },
      { year: 2024, score: 82, ndvi_proxy: 0.71, embedding_change: 0.98, label: 'Estável e em alta' },
    ],
    current_score: 82,
    status: 'productive',
    alerts: [
      {
        id: 'a008',
        level: 'ok',
        title: 'Trajetória positiva consistente (+14pts em 7 anos)',
        description: 'Sistema ILPF (Integração Lavoura-Pecuária-Floresta) implementado em 2019 resultou em melhoria contínua.',
        year: 2024,
      },
    ],
    recommendations: [
      {
        id: 'r009',
        priority: 'low',
        category: 'manejo',
        title: 'Certificação de boas práticas agropecuárias',
        description: 'Com score acima de 80 e trajetória positiva, a propriedade se qualifica para certificações premium que aumentam valor do produto.',
        estimated_impact: 'Premium de 15–25% no preço do produto final',
      },
    ],
  },
  {
    id: 'prop-006',
    name: 'Fazenda Santa Rita de Cássia',
    owner: 'João Marcos de Almeida',
    area_ha: 2100,
    biome: 'Cerrado',
    municipality: 'Uberaba',
    state: 'MG',
    centroid: [-19.5000, -47.7000],
    car_number: 'MG-3170404-6B7C8D9E0F',
    polygon: [
      [-19.480, -47.680],
      [-19.480, -47.720],
      [-19.520, -47.720],
      [-19.520, -47.680],
      [-19.480, -47.680],
    ],
    scores: [
      { year: 2017, score: 69, ndvi_proxy: 0.59, embedding_change: 1.0, label: 'Cana-de-açúcar' },
      { year: 2018, score: 66, ndvi_proxy: 0.56, embedding_change: 0.91, label: 'Mudança cultural' },
      { year: 2019, score: 59, ndvi_proxy: 0.49, embedding_change: 0.83, label: 'Transição' },
      { year: 2020, score: 52, ndvi_proxy: 0.43, embedding_change: 0.77, label: 'Implantação soja' },
      { year: 2021, score: 55, ndvi_proxy: 0.46, embedding_change: 0.80, label: 'Adaptação' },
      { year: 2022, score: 60, ndvi_proxy: 0.51, embedding_change: 0.85, label: 'Primeira safra ok' },
      { year: 2023, score: 57, ndvi_proxy: 0.48, embedding_change: 0.82, label: 'El Niño impacto' },
      { year: 2024, score: 62, ndvi_proxy: 0.53, embedding_change: 0.87, label: 'Recuperação' },
    ],
    current_score: 62,
    status: 'declining',
    alerts: [
      {
        id: 'a009',
        level: 'warning',
        title: 'Score abaixo do potencial produtivo da região',
        description: 'Cerrado de MG com solo preparado deveria alcançar score 70+. Histórico de mudança cultural impactou produtividade.',
        year: 2024,
      },
    ],
    recommendations: [
      {
        id: 'r010',
        priority: 'high',
        category: 'manejo',
        title: 'Calagem e correção de solo',
        description: 'Transição de cana para soja frequentemente exige calagem profunda. Solo com pH inadequado reduz absorção de nutrientes.',
        estimated_impact: '+12 pontos de score em 1 safra',
      },
    ],
  },
  {
    id: 'prop-007',
    name: 'Fazenda Matopiba Ouro',
    owner: 'Agrícola Chapada',
    area_ha: 7500,
    biome: 'Cerrado',
    municipality: 'Formosa do Rio Preto',
    state: 'BA',
    centroid: [-11.0000, -45.5000],
    car_number: 'BA-2911105-7G8H9I0J1K',
    polygon: [
      [-10.970, -45.470],
      [-10.970, -45.530],
      [-11.030, -45.530],
      [-11.030, -45.470],
      [-10.970, -45.470],
    ],
    scores: [
      { year: 2017, score: 85, ndvi_proxy: 0.73, embedding_change: 1.0, label: 'Ano base produtivo' },
      { year: 2018, score: 87, ndvi_proxy: 0.75, embedding_change: 0.98, label: 'Expansão de área' },
      { year: 2019, score: 82, ndvi_proxy: 0.70, embedding_change: 0.92, label: 'Estiagem no Matopiba' },
      { year: 2020, score: 79, ndvi_proxy: 0.68, embedding_change: 0.90, label: 'Seca regional prolongada' },
      { year: 2021, score: 84, ndvi_proxy: 0.72, embedding_change: 0.94, label: 'Clima favorável' },
      { year: 2022, score: 89, ndvi_proxy: 0.77, embedding_change: 0.96, label: 'Safra recorde de soja' },
      { year: 2023, score: 88, ndvi_proxy: 0.76, embedding_change: 0.96, label: 'Manejo otimizado' },
      { year: 2024, score: 86, ndvi_proxy: 0.74, embedding_change: 0.95, label: 'Produção consolidada' },
    ],
    current_score: 86,
    status: 'productive',
    alerts: [],
    recommendations: [],
  },
  {
    id: 'prop-008',
    name: 'Sítio Novo Horizonte',
    owner: 'Família Torres',
    area_ha: 420,
    biome: 'Cerrado',
    municipality: 'Balsas',
    state: 'MA',
    centroid: [-7.8000, -46.2000],
    car_number: 'MA-2101400-8L9M0N1O2P',
    polygon: [
      [-7.780, -46.180],
      [-7.780, -46.220],
      [-7.820, -46.220],
      [-7.820, -46.180],
      [-7.780, -46.180],
    ],
    scores: [
      { year: 2017, score: 58, ndvi_proxy: 0.50, embedding_change: 1.0, label: 'Pastagem de baixo vigor' },
      { year: 2018, score: 54, ndvi_proxy: 0.45, embedding_change: 0.88, label: 'Degradação inicial' },
      { year: 2019, score: 49, ndvi_proxy: 0.40, embedding_change: 0.78, label: 'Invasoras detectadas' },
      { year: 2020, score: 42, ndvi_proxy: 0.35, embedding_change: 0.69, label: 'Déficit hídrico agravante' },
      { year: 2021, score: 38, ndvi_proxy: 0.30, embedding_change: 0.64, label: 'Ponto crítico' },
      { year: 2022, score: 41, ndvi_proxy: 0.33, embedding_change: 0.68, label: 'Intervenção no solo' },
      { year: 2023, score: 45, ndvi_proxy: 0.38, embedding_change: 0.73, label: 'Recuperação tímida' },
      { year: 2024, score: 47, ndvi_proxy: 0.40, embedding_change: 0.75, label: 'Sinais de melhora' },
    ],
    current_score: 47,
    status: 'recovering',
    alerts: [
      {
        id: 'a010',
        level: 'warning',
        title: 'Score vulnerável a anomalias climáticas',
        description: 'Propriedade em região de balanço hídrico sensível. Necessidade de adoção de práticas de conservação de solo.',
        year: 2024,
      }
    ],
    recommendations: [
      {
        id: 'r011',
        priority: 'high',
        category: 'manejo',
        title: 'Manter cobertura morta no solo (Mulching)',
        description: 'Técnica essencial para minimizar temperatura do solo e maximizar retenção hídrica na região do MATOPIBA.',
        estimated_impact: '+10 pontos em 2 safras',
      }
    ],
  },
  {
    id: 'prop-009',
    name: 'Fazenda Três Riachos',
    owner: 'Investimentos Verdes SA',
    area_ha: 1560,
    biome: 'Cerrado',
    municipality: 'Rondonópolis',
    state: 'MT',
    centroid: [-16.6000, -54.7000],
    car_number: 'MT-5107602-1Q2W3E4R5T',
    polygon: [
      [-16.580, -54.680],
      [-16.580, -54.720],
      [-16.620, -54.720],
      [-16.620, -54.680],
      [-16.580, -54.680],
    ],
    scores: [
      { year: 2017, score: 71, ndvi_proxy: 0.61, embedding_change: 1.0, label: 'Sistemas tradicionais' },
      { year: 2018, score: 68, ndvi_proxy: 0.58, embedding_change: 0.90, label: 'Queda de produtividade' },
      { year: 2019, score: 63, ndvi_proxy: 0.53, embedding_change: 0.85, label: 'Problemas de nematoides' },
      { year: 2020, score: 55, ndvi_proxy: 0.46, embedding_change: 0.79, label: 'Impacto severo' },
      { year: 2021, score: 52, ndvi_proxy: 0.43, embedding_change: 0.74, label: 'Solo fadigado' },
      { year: 2022, score: 50, ndvi_proxy: 0.41, embedding_change: 0.71, label: 'Perda de rentabilidade' },
      { year: 2023, score: 48, ndvi_proxy: 0.39, embedding_change: 0.68, label: 'Limiar de viabilidade' },
      { year: 2024, score: 45, ndvi_proxy: 0.37, embedding_change: 0.65, label: 'Transição para agricultura regenerativa' },
    ],
    current_score: 45,
    status: 'declining',
    alerts: [
      {
        id: 'a011',
        level: 'critical',
        title: 'Queda acentuada de rentabilidade e produtividade',
        description: 'Vem sofrendo com ocorrência severa de nematoides e compactação do solo. Requer manejo imediato.',
        year: 2024,
      }
    ],
    recommendations: [
      {
        id: 'r012',
        priority: 'high',
        category: 'rotação',
        title: 'Uso de plantas de cobertura e crotalária',
        description: 'Implementação de culturas para quebra do ciclo de pragas e doenças do solo, e melhoria estrutural e biológica do solo.',
        estimated_impact: 'Redução de 80% na população de nematoides',
      }
    ],
  },
];

// Estatísticas agregadas para o dashboard
export const DASHBOARD_STATS = {
  total_area_ha: MOCK_PROPERTIES.reduce((sum, p) => sum + p.area_ha, 0),
  total_properties: MOCK_PROPERTIES.length,
  degraded_count: MOCK_PROPERTIES.filter(p => p.status === 'degraded').length,
  declining_count: MOCK_PROPERTIES.filter(p => p.status === 'declining').length,
  productive_count: MOCK_PROPERTIES.filter(p => p.status === 'productive').length,
  recovering_count: MOCK_PROPERTIES.filter(p => p.status === 'recovering').length,
  critical_alerts: MOCK_PROPERTIES.flatMap(p => p.alerts).filter(a => a.level === 'critical').length,
  avg_score: Math.round(MOCK_PROPERTIES.reduce((sum, p) => sum + p.current_score, 0) / MOCK_PROPERTIES.length),
};

// Centroide do Brasil para o mapa inicial
export const BRAZIL_CENTER: [number, number] = [-15.0, -53.0];
export const BRAZIL_ZOOM = 5;

// Mapa de cores por status
export const STATUS_COLORS: Record<PropertyStatus, { fill: string; stroke: string; label: string }> = {
  productive: { fill: 'rgba(34, 197, 94, 0.3)', stroke: '#22c55e', label: 'Produtivo' },
  declining: { fill: 'rgba(245, 158, 11, 0.3)', stroke: '#f59e0b', label: 'Em queda' },
  degraded: { fill: 'rgba(239, 68, 68, 0.3)', stroke: '#ef4444', label: 'Degradado' },
  recovering: { fill: 'rgba(96, 165, 250, 0.3)', stroke: '#60a5fa', label: 'Recuperando' },
};

export const SCORE_TO_STATUS = (score: number): PropertyStatus => {
  if (score >= 70) return 'productive';
  if (score >= 50) return 'declining';
  if (score >= 35) return 'recovering';
  return 'degraded';
};
