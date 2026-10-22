/**
 * Converte uma string em um slug amigável para URLs.
 * Exemplo: "Eletrônicos e Celulares" -> "eletronicos-e-celulares"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/--+/g, '-'); // Remove hifens duplicados
}
