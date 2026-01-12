-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('learner', 'teacher', 'grade_head', 'principal', 'admin');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create enum for grade levels
CREATE TYPE public.grade_level AS ENUM ('R', '1', '2', '3', '4', '5', '6', '7');

-- Create enum for class sections
CREATE TYPE public.class_section AS ENUM ('A', 'B', 'C');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  identity_number TEXT NOT NULL,
  age INTEGER NOT NULL,
  physical_address TEXT NOT NULL,
  next_of_kin_contact TEXT,
  backup_email TEXT,
  identity_document_url TEXT,
  proof_of_address_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  application_status application_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create learner_registrations table for student-specific info
CREATE TABLE public.learner_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  student_number TEXT UNIQUE,
  previous_grade grade_level,
  applying_for_grade grade_level NOT NULL,
  assigned_grade grade_level,
  assigned_section class_section,
  parent_guardian_name TEXT NOT NULL,
  parent_guardian_phone TEXT NOT NULL,
  parent_guardian_email TEXT,
  parent_guardian_id_url TEXT NOT NULL,
  previous_report_url TEXT NOT NULL,
  banking_details_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create staff_registrations table for teacher/grade_head/principal info
CREATE TABLE public.staff_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  staff_number TEXT UNIQUE,
  qualification_document_url TEXT NOT NULL,
  grades_teaching grade_level[] DEFAULT '{}',
  subjects_teaching TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade grade_level NOT NULL,
  section class_section NOT NULL,
  grade_head_id UUID REFERENCES auth.users(id),
  max_capacity INTEGER DEFAULT 40 NOT NULL,
  current_count INTEGER DEFAULT 0 NOT NULL,
  academic_year INTEGER DEFAULT EXTRACT(YEAR FROM now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (grade, section, academic_year)
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_roles app_role[] NOT NULL,
  target_grades grade_level[],
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create teacher_ratings table
CREATE TABLE public.teacher_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (teacher_id, student_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_present BOOLEAN DEFAULT true NOT NULL,
  marked_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (student_id, class_id, date)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_name TEXT NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  total_marks DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained / total_marks) * 100) STORED,
  feedback TEXT,
  term INTEGER CHECK (term >= 1 AND term <= 4) NOT NULL,
  academic_year INTEGER DEFAULT EXTRACT(YEAR FROM now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create content table (for ebooks, homework, tasks)
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'ebook', 'homework', 'task', 'notes', 'timetable'
  file_url TEXT,
  target_grades grade_level[] NOT NULL,
  target_subjects TEXT[],
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create past_papers table
CREATE TABLE public.past_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade grade_level NOT NULL,
  year INTEGER NOT NULL,
  term INTEGER CHECK (term >= 1 AND term <= 4),
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create parent_subscriptions table
CREATE TABLE public.parent_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create meetings table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_roles app_role[] NOT NULL,
  target_grades grade_level[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create merchandise table
CREATE TABLE public.merchandise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_count INTEGER DEFAULT 0 NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create merchandise_orders table
CREATE TABLE public.merchandise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  merchandise_id UUID REFERENCES public.merchandise(id) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_proof_url TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'confirmed', 'delivered'
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchandise_orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND application_status = 'accepted'
  )
$$;

-- Create function to check if user is admin or principal
CREATE OR REPLACE FUNCTION public.is_admin_or_principal(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'principal')
      AND application_status = 'accepted'
  )
$$;

-- Create function to check if user is staff (teacher, grade_head, principal, admin)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('teacher', 'grade_head', 'principal', 'admin')
      AND application_status = 'accepted'
  )
$$;

-- Create function to generate student number
CREATE OR REPLACE FUNCTION public.generate_student_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  year_prefix TEXT;
  sequence_num INTEGER;
BEGIN
  year_prefix := EXTRACT(YEAR FROM now())::TEXT;
  SELECT COALESCE(MAX(SUBSTRING(student_number FROM 5)::INTEGER), 0) + 1
  INTO sequence_num
  FROM public.learner_registrations
  WHERE student_number LIKE year_prefix || '%';
  new_number := year_prefix || LPAD(sequence_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Create function to generate staff number
CREATE OR REPLACE FUNCTION public.generate_staff_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  sequence_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(SUBSTRING(staff_number FROM 4)::INTEGER), 0) + 1
  INTO sequence_num
  FROM public.staff_registrations;
  new_number := 'STF' || LPAD(sequence_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own role"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admin can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for learner_registrations
CREATE POLICY "Learners can view their own registration"
  ON public.learner_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all learner registrations"
  ON public.learner_registrations FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Learners can insert their own registration"
  ON public.learner_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update learner registrations"
  ON public.learner_registrations FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for staff_registrations
CREATE POLICY "Staff can view their own registration"
  ON public.staff_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all staff registrations"
  ON public.staff_registrations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can insert their own registration"
  ON public.staff_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update staff registrations"
  ON public.staff_registrations FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Anyone can view classes"
  ON public.classes FOR SELECT
  USING (true);

CREATE POLICY "Only admin can manage classes"
  ON public.classes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for announcements
CREATE POLICY "Users can view announcements for their role"
  ON public.announcements FOR SELECT
  USING (true);

CREATE POLICY "Staff can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Authors can update their announcements"
  ON public.announcements FOR UPDATE
  USING (auth.uid() = author_id);

-- RLS Policies for teacher_ratings
CREATE POLICY "Students can rate teachers"
  ON public.teacher_ratings FOR INSERT
  WITH CHECK (auth.uid() = student_id AND public.has_role(auth.uid(), 'learner'));

CREATE POLICY "Students can view their own ratings"
  ON public.teacher_ratings FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Grade heads and principals can view ratings"
  ON public.teacher_ratings FOR SELECT
  USING (public.has_role(auth.uid(), 'grade_head') OR public.has_role(auth.uid(), 'principal'));

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Staff can view all attendance"
  ON public.attendance FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Teachers can mark attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Teachers can update attendance"
  ON public.attendance FOR UPDATE
  USING (public.is_staff(auth.uid()));

-- RLS Policies for subjects
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage subjects"
  ON public.subjects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for marks
CREATE POLICY "Students can view their own marks"
  ON public.marks FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Staff can view all marks"
  ON public.marks FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Teachers can insert marks"
  ON public.marks FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Teachers can update marks they entered"
  ON public.marks FOR UPDATE
  USING (auth.uid() = teacher_id);

-- RLS Policies for content
CREATE POLICY "Authenticated users can view content"
  ON public.content FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can upload content"
  ON public.content FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Authors can update their content"
  ON public.content FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- RLS Policies for past_papers
CREATE POLICY "Authenticated users can view past papers"
  ON public.past_papers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can upload past papers"
  ON public.past_papers FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

-- RLS Policies for parent_subscriptions
CREATE POLICY "Parents can view their own subscription"
  ON public.parent_subscriptions FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Admin can view all subscriptions"
  ON public.parent_subscriptions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can insert their subscription"
  ON public.parent_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

-- RLS Policies for meetings
CREATE POLICY "Authenticated users can view meetings"
  ON public.meetings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can create meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

-- RLS Policies for merchandise
CREATE POLICY "Anyone can view merchandise"
  ON public.merchandise FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage merchandise"
  ON public.merchandise FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for merchandise_orders
CREATE POLICY "Students can view their own orders"
  ON public.merchandise_orders FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Staff can view all orders"
  ON public.merchandise_orders FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Students can create orders"
  ON public.merchandise_orders FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Staff can update order status"
  ON public.merchandise_orders FOR UPDATE
  USING (public.is_staff(auth.uid()));

-- Insert default subjects
INSERT INTO public.subjects (name, description) VALUES
  ('Mathematics', 'Basic arithmetic, geometry, and problem-solving'),
  ('English', 'Reading, writing, and comprehension'),
  ('Life Skills', 'Personal and social development'),
  ('Natural Sciences', 'Introduction to science concepts'),
  ('Social Sciences', 'Geography and history basics'),
  ('Technology', 'Basic technology and computer skills'),
  ('Creative Arts', 'Art, music, and creative expression'),
  ('Physical Education', 'Sports and physical activities');

-- Insert default classes for all grades
INSERT INTO public.classes (grade, section) VALUES
  ('R', 'A'), ('R', 'B'), ('R', 'C'),
  ('1', 'A'), ('1', 'B'), ('1', 'C'),
  ('2', 'A'), ('2', 'B'), ('2', 'C'),
  ('3', 'A'), ('3', 'B'), ('3', 'C'),
  ('4', 'A'), ('4', 'B'), ('4', 'C'),
  ('5', 'A'), ('5', 'B'), ('5', 'C'),
  ('6', 'A'), ('6', 'B'), ('6', 'C'),
  ('7', 'A'), ('7', 'B'), ('7', 'C');