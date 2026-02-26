
-- Helper functions
CREATE OR REPLACE FUNCTION public.is_finance(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'finance' AND application_status = 'accepted'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
      AND role IN ('teacher', 'grade_head', 'principal', 'admin', 'sgb', 'finance')
      AND application_status = 'accepted'
  );
$$;

-- Fee payments table
CREATE TABLE public.fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('school_fees', 'monthly_subscription', 'levy')),
  amount numeric(10,2) NOT NULL,
  reference text,
  proof_of_payment_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by uuid,
  notes text,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own payments" ON public.fee_payments
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Finance manage payments" ON public.fee_payments
  FOR ALL TO authenticated USING (public.is_finance(auth.uid()));
CREATE POLICY "Parents view child payments" ON public.fee_payments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.learner_registrations lr
      JOIN public.profiles p ON p.user_id = auth.uid()
      WHERE lr.user_id = fee_payments.student_id
        AND lr.parent_guardian_email = p.email
    )
  );
CREATE POLICY "Students insert own payments" ON public.fee_payments
  FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Parents insert payments" ON public.fee_payments
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.learner_registrations lr
      JOIN public.profiles p ON p.user_id = auth.uid()
      WHERE lr.user_id = fee_payments.student_id
        AND lr.parent_guardian_email = p.email
    )
  );

-- School account info
CREATE TABLE public.school_account_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  branch_code text NOT NULL,
  account_holder text NOT NULL,
  reference_instructions text,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.school_account_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view" ON public.school_account_info
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance can manage" ON public.school_account_info
  FOR ALL TO authenticated USING (public.is_finance(auth.uid()));

-- Quizzes
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  grade_level text NOT NULL,
  created_by uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  time_limit_minutes integer DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own quizzes" ON public.quizzes
  FOR ALL TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Students view active quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (is_active = true);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text,
  option_d text,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  points integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage quiz questions" ON public.quiz_questions
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND created_by = auth.uid())
  );
CREATE POLICY "Students view questions" ON public.quiz_questions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND is_active = true)
  );

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  score integer,
  total_points integer,
  completed_at timestamptz,
  started_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own attempts" ON public.quiz_attempts
  FOR ALL TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Teachers view attempts for own quizzes" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_attempts.quiz_id AND created_by = auth.uid())
  );

-- Timetables
CREATE TABLE public.timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level text NOT NULL,
  title text NOT NULL,
  file_url text,
  timetable_data jsonb,
  uploaded_by uuid NOT NULL,
  academic_year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::integer,
  term integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Grade heads manage timetables" ON public.timetables
  FOR ALL TO authenticated USING (uploaded_by = auth.uid());
CREATE POLICY "Staff view timetables" ON public.timetables
  FOR SELECT TO authenticated USING (true);

-- Anonymous grade head ratings (by students rating teachers, and teachers rating grade heads)
CREATE TABLE public.staff_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rated_user_id uuid NOT NULL,
  rated_role text NOT NULL CHECK (rated_role IN ('teacher', 'grade_head')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  rater_role text NOT NULL CHECK (rater_role IN ('learner', 'teacher')),
  created_at timestamptz NOT NULL DEFAULT now()
  -- NO rater_id to ensure anonymity
);
ALTER TABLE public.staff_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can insert rating" ON public.staff_ratings
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Rated user and leadership view ratings" ON public.staff_ratings
  FOR SELECT TO authenticated USING (
    rated_user_id = auth.uid()
    OR public.is_staff(auth.uid())
  );

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('timetables', 'timetables', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated upload payment proofs" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-proofs');
CREATE POLICY "Users view own payment proofs" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'payment-proofs');
CREATE POLICY "Finance view all payment proofs" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'payment-proofs' AND public.is_finance(auth.uid()));

CREATE POLICY "Grade heads upload timetables" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'timetables');
CREATE POLICY "Anyone view timetables" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'timetables');
