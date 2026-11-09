import { curriculum } from './generated/curriculum';
import { GLOSSARY } from './glossary';

describe('GLOSSARY', () => {
  it('has unique ids and an explanation in every language', () => {
    expect(new Set(GLOSSARY.map((entry) => entry.id)).size).toBe(GLOSSARY.length);
    for (const entry of GLOSSARY) {
      expect(entry.text.de.trim(), entry.id).not.toBe('');
      expect(entry.text.en.trim(), entry.id).not.toBe('');
      expect(entry.text.de.split('`').length % 2, `${entry.id}: unbalanced backticks`).toBe(1);
      expect(entry.text.en.split('`').length % 2, `${entry.id}: unbalanced backticks`).toBe(1);
    }
  });

  it('only links to lessons that exist in both languages', () => {
    for (const lang of ['de', 'en'] as const) {
      const ids = new Set(curriculum[lang].flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)));
      const missing = GLOSSARY.flatMap((entry) => entry.lessons.filter((id) => !ids.has(id)).map((id) => `${entry.id} → ${id}`));
      expect(missing, lang).toEqual([]);
    }
  });
});
