import { Service } from '@angular/core';
import { Chapter, Lang, Lesson, LessonSummary } from './content.model';
import { curriculum, lessonLoaders } from './generated/curriculum';

export interface LessonNeighbours {
  previous?: LessonSummary & { chapter: string };
  next?: LessonSummary & { chapter: string };
}

@Service()
export class ContentService {
  chapters(lang: Lang): Chapter[] {
    return curriculum[lang];
  }

  allLessons(lang: Lang): (LessonSummary & { chapter: string })[] {
    return curriculum[lang].flatMap((c) => c.lessons.map((l) => ({ ...l, chapter: c.slug })));
  }

  async loadLesson(lang: Lang, id: string): Promise<Lesson | undefined> {
    return lessonLoaders[`${lang}/${id}`]?.();
  }

  neighbours(lang: Lang, id: string): LessonNeighbours {
    const lessons = this.allLessons(lang);
    const index = lessons.findIndex((l) => l.id === id);
    return index < 0 ? {} : { previous: lessons[index - 1], next: lessons[index + 1] };
  }
}
