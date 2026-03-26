-- Levion Health Tracker - Database Schema
-- Paste this in Supabase SQL Editor and click "Run"

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dose TEXT NOT NULL,
  alarm_time TEXT DEFAULT '09:00',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medicine_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE NOT NULL,
  taken BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  taken_at TIMESTAMPTZ,
  UNIQUE(medicine_id, date)
);

CREATE TABLE water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE exercise_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coffee_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cups INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5) NOT NULL,
  short_note TEXT,
  journal TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own medicines" ON medicines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own medicine_logs" ON medicine_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own water_logs" ON water_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own exercise_logs" ON exercise_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own coffee_logs" ON coffee_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own mood_entries" ON mood_entries FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
