export const getGenres = (): Record<string, string> => ({
  all: 'Todos los Géneros',
  accion: 'Acción',
  aventura: 'Aventura',
  carreras: 'Carreras',
  comedia: 'Comedia',
  demencia: 'Demencia',
  demonios: 'Demonios',
  drama: 'Drama',
  ecchi: 'Ecchi',
  fantasia: 'Fantasía',
  juegos: 'Juegos',
  harem: 'Harem',
  historico: 'Histórico',
  infantil: 'Infantil',
  josei: 'Josei',
  'artes-marciales': 'Artes Marciales',
  mecha: 'Mecha',
  militar: 'Militar',
  misterio: 'Misterio',
  musica: 'Música',
  parodia: 'Parodia',
  policia: 'Policía',
  psicologico: 'Psicológico',
  romance: 'Romance',
  samurai: 'Samurai',
  escolar: 'Escolar',
  'ciencia-ficcion': 'Ciencia Ficción',
  seinen: 'Seinen',
  shoujo: 'Shoujo',
  shounen: 'Shounen',
  'recuentos-de-la-vida': 'Recuentos de la vida',
  espacial: 'Espacial',
  deportes: 'Deportes',
  'super-poderes': 'Superpoderes',
  sobrenatural: 'Sobrenatural',
  suspenso: 'Suspenso',
  terror: 'Terror',
  vampiros: 'Vampiros',
  yaoi: 'Yaoi',
  yuri: 'Yuri',
});

export const getTypes = (): Record<string, string> => ({
  all: 'Todos los Tipos',
  tv: 'TV',
  ova: 'OVA',
  movie: 'Película',
  special: 'Especial',
  ona: 'ONA',
  music: 'Música',
});

export const getStatuses = (): Record<string, string> => ({
  all: 'Todos los Estados',
  emision: 'En emisión',
  finalizado: 'Finalizado',
  proximamente: 'Próximamente'
});

export const getOrders = (): Record<string, string> => ({
  default: 'Por Defecto',
  updated: 'Recientes',
  added: 'Recién Añadidos',
  title: 'Nombre A-Z',
  rating: 'Mejor Calificados'
});