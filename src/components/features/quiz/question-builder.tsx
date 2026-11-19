'use client';

import { useState } from 'react';
import { Button, Card, Field, Input, Select, Textarea } from '@/components/ui';

const LABELS = ['A', 'B', 'C', 'D'];

type ChoiceDraft = { label: string; text: string; isCorrect: boolean };

export type QuestionPayload = {
  type: 'PG' | 'ESSAY';
  text: string;
  points: number;
  choices: ChoiceDraft[];
};

export function QuestionBuilder({
  pending,
  onAdd,
}: {
  pending?: boolean;
  onAdd: (q: QuestionPayload) => void | Promise<void>;
}) {
  const [type, setType] = useState<'PG' | 'ESSAY'>('PG');
  const [text, setText] = useState('');
  const [points, setPoints] = useState(10);
  const [choices, setChoices] = useState<ChoiceDraft[]>(
    LABELS.map((label, i) => ({ label, text: '', isCorrect: i === 0 }))
  );
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setText('');
    setPoints(10);
    setChoices(LABELS.map((label, i) => ({ label, text: '', isCorrect: i === 0 })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (type === 'PG') {
      const filled = choices.filter((c) => c.text.trim());
      if (filled.length < 2) {
        setError('Isi minimal 2 pilihan jawaban.');
        return;
      }
      if (filled.filter((c) => c.isCorrect).length !== 1) {
        setError('Pilih tepat 1 kunci jawaban yang benar.');
        return;
      }
      await onAdd({ type, text, points, choices: filled });
    } else {
      await onAdd({ type, text, points, choices: [] });
    }
    reset();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <Field label="Tipe Soal">
            <Select value={type} onChange={(e) => setType(e.target.value as 'PG' | 'ESSAY')}>
              <option value="PG">Pilihan Ganda</option>
              <option value="ESSAY">Esai</option>
            </Select>
          </Field>
          <Field label="Poin">
            <Input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </Field>
        </div>

        <Field label="Pertanyaan">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} required />
        </Field>

        {type === 'PG' && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Pilihan Jawaban (pilih kunci yang benar)</p>
            {choices.map((c, i) => (
              <div key={c.label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={c.isCorrect}
                  onChange={() =>
                    setChoices((cs) => cs.map((x, j) => ({ ...x, isCorrect: j === i })))
                  }
                  title="Tandai sebagai kunci jawaban"
                />
                <span className="w-5 text-sm font-medium">{c.label}.</span>
                <Input
                  value={c.text}
                  placeholder={`Pilihan ${c.label}`}
                  onChange={(e) =>
                    setChoices((cs) =>
                      cs.map((x, j) => (j === i ? { ...x, text: e.target.value } : x))
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Menyimpan...' : 'Tambah Soal'}
        </Button>
      </form>
    </Card>
  );
}
