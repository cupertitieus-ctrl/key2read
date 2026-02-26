-- Store Purchases History table
CREATE TABLE IF NOT EXISTS store_purchases (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_purchases_class_id ON store_purchases(class_id);
CREATE INDEX IF NOT EXISTS idx_store_purchases_student_id ON store_purchases(student_id);

-- Enable RLS and allow anon access
ALTER TABLE store_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON store_purchases FOR ALL TO anon USING (true) WITH CHECK (true);
