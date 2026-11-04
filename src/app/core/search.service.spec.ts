import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

// Runs against the real generated index (npm test builds the content first).
describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    service = TestBed.inject(SearchService);
  });

  const marked = (hit: { snippet: { text: string; hit: boolean }[] }) =>
    hit.snippet.filter((p) => p.hit).map((p) => p.text);

  it('finds the section that matches, with an anchor to jump to', async () => {
    const [first] = await service.search('en', 'toSorted');
    expect(first.doc.id).toBe('state/objects-and-arrays#updating-arrays');
  });

  it('finds camelCase parts exactly ("propagation" → stopPropagation)', async () => {
    const [first] = await service.search('en', 'propagation');
    expect(first.doc.id).toBe('jsx-and-components/events#bubbling');
    expect(marked(first).map((m) => m.toLowerCase())).toContain('propagation');
  });

  it('prefers exact matches over fuzzy ones', async () => {
    const hits = await service.search('de', 'preventDefault');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => marked(h).every((m) => m === 'preventDefault'))).toBe(true);
  });

  it('tolerates typos when nothing matches exactly', async () => {
    const [first] = await service.search('en', 'fragmnet');
    expect(first.doc.lesson).toBe('jsx-and-components/jsx');
  });

  it('returns nothing for very short or unknown queries', async () => {
    expect(await service.search('en', 's')).toEqual([]);
    expect(await service.search('en', 'xyzzy')).toEqual([]);
  });
});
