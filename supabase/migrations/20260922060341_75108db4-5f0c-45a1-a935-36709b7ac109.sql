
CREATE TYPE public.app_role AS ENUM ('nany','amanda','pastor');
CREATE TYPE public.task_status AS ENUM ('nao_iniciado','preparando','em_implementacao','aguardando','bloqueado','em_validacao','concluido','cancelado');
CREATE TYPE public.request_status AS ENUM ('pending','in_progress','answered','closed');
CREATE TYPE public.request_type AS ENUM ('information','document','access','decision','approval','material','contact');
CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.checkpoint_state AS ENUM ('implemented','validated','pending','blocked');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Não definido',
  title TEXT NOT NULL DEFAULT 'Não definido',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_read" ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.current_role_name()
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE chosen public.app_role;
BEGIN
  BEGIN
    chosen := (NEW.raw_user_meta_data ->> 'role')::public.app_role;
  EXCEPTION WHEN others THEN chosen := NULL;
  END;
  IF chosen IS NULL THEN chosen := 'amanda'; END IF;

  INSERT INTO public.profiles (id, full_name, title)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name',''), 'Não definido'),
    CASE chosen
      WHEN 'nany' THEN 'Estratégia, implementação, criativo e tecnologia'
      WHEN 'amanda' THEN 'Secretariado & Coordenação'
      ELSE 'Direção Pastoral & Visão'
    END
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, chosen)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT 'Não definido',
  status TEXT NOT NULL DEFAULT 'Pending',
  accent TEXT NOT NULL DEFAULT 'website',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_read" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_write" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'nany')) WITH CHECK (public.has_role(auth.uid(),'nany'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PHASES
CREATE TABLE public.phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phases TO authenticated;
GRANT ALL ON public.phases TO service_role;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phases_read" ON public.phases FOR SELECT TO authenticated USING (true);
CREATE POLICY "phases_write" ON public.phases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'nany')) WITH CHECK (public.has_role(auth.uid(),'nany'));
CREATE TRIGGER phases_updated_at BEFORE UPDATE ON public.phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CHECKPOINTS
CREATE TABLE public.checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES public.phases(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  state public.checkpoint_state NOT NULL DEFAULT 'pending',
  next_step TEXT NOT NULL DEFAULT 'Não definido',
  critical BOOLEAN NOT NULL DEFAULT false,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkpoints TO authenticated;
GRANT ALL ON public.checkpoints TO service_role;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkpoints_read" ON public.checkpoints FOR SELECT TO authenticated USING (true);
CREATE POLICY "checkpoints_write" ON public.checkpoints FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'nany') OR public.has_role(auth.uid(),'amanda'))
  WITH CHECK (public.has_role(auth.uid(),'nany') OR public.has_role(auth.uid(),'amanda'));
CREATE TRIGGER checkpoints_updated_at BEFORE UPDATE ON public.checkpoints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TASKS
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.phases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT 'Não definido',
  responsible public.app_role,
  start_date DATE,
  deadline DATE,
  priority TEXT NOT NULL DEFAULT 'Média',
  status public.task_status NOT NULL DEFAULT 'nao_iniciado',
  dependency TEXT NOT NULL DEFAULT 'Não definido',
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  validation_criteria TEXT NOT NULL DEFAULT 'Não definido',
  notes TEXT NOT NULL DEFAULT '',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_read" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_insert" ON public.tasks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'nany'));
CREATE POLICY "tasks_delete" ON public.tasks FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'nany'));
CREATE POLICY "tasks_update" ON public.tasks FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'nany') OR public.has_role(auth.uid(),'amanda') OR public.has_role(auth.uid(),'pastor'))
  WITH CHECK (public.has_role(auth.uid(),'nany') OR public.has_role(auth.uid(),'amanda') OR public.has_role(auth.uid(),'pastor'));
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TASK ACTIVITY
CREATE TABLE public.task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  actor_id UUID,
  actor_label TEXT NOT NULL DEFAULT 'Não definido',
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.task_activity TO authenticated;
GRANT ALL ON public.task_activity TO service_role;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_read" ON public.task_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "activity_insert" ON public.task_activity FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

-- REQUESTS
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type public.request_type NOT NULL DEFAULT 'information',
  requested_from public.app_role NOT NULL,
  requested_by UUID,
  requested_by_role public.app_role,
  deadline DATE,
  priority TEXT NOT NULL DEFAULT 'Média',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  phase_id UUID REFERENCES public.phases(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  message TEXT NOT NULL DEFAULT '',
  reply TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.requests TO authenticated;
GRANT ALL ON public.requests TO service_role;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "requests_read" ON public.requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "requests_insert" ON public.requests FOR INSERT TO authenticated WITH CHECK (requested_by = auth.uid());
CREATE POLICY "requests_update" ON public.requests FOR UPDATE TO authenticated
  USING (requested_by = auth.uid() OR requested_from = public.current_role_name())
  WITH CHECK (requested_by = auth.uid() OR requested_from = public.current_role_name());
CREATE POLICY "requests_delete" ON public.requests FOR DELETE TO authenticated USING (requested_by = auth.uid());
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- APPROVALS
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT 'Não definido',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  phase_id UUID REFERENCES public.phases(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  requested_by UUID,
  requested_by_label TEXT NOT NULL DEFAULT 'Não definido',
  approved_by UUID,
  approved_by_label TEXT,
  status public.approval_status NOT NULL DEFAULT 'pending',
  comment TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.approvals TO authenticated;
GRANT ALL ON public.approvals TO service_role;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approvals_read" ON public.approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "approvals_insert" ON public.approvals FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'nany') OR public.has_role(auth.uid(),'amanda'));
CREATE POLICY "approvals_update" ON public.approvals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'pastor') OR requested_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'pastor') OR requested_by = auth.uid());
CREATE TRIGGER approvals_updated_at BEFORE UPDATE ON public.approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_role public.app_role NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  kind TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_read_own" ON public.notifications FOR SELECT TO authenticated USING (target_role = public.current_role_name());
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (target_role = public.current_role_name()) WITH CHECK (target_role = public.current_role_name());

-- SEED: projects
INSERT INTO public.projects (slug, name, summary, status, accent, position) VALUES
('website','Website','Site institucional AGAPE: estrutura, conteúdo, desenvolvimento e lançamento.','Em implementação','website',1),
('branding','Branding','Identidade visual, aplicações e apresentação da marca AGAPE.','Em implementação','branding',2),
('communication','Communication','E-mail institucional, WhatsApp, atendimento e comunicação interna.','Pending','operations',3),
('social','Social','Presença e conteúdo nas redes sociais.','Pending','audiovisual',4),
('launch','Launch','Checklist, ensaio, lançamento e validação pós-lançamento.','Pending','launch',5);

-- SEED: phases (website)
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 01','Preparação', DATE '2026-09-21', DATE '2026-09-27','Em implementação',1 FROM public.projects WHERE slug='website';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 02','Homepage', DATE '2026-09-28', DATE '2026-09-30','Prioridade atual',2 FROM public.projects WHERE slug='website';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 03','Conteúdo', DATE '2026-10-05', DATE '2026-10-11','Pending',3 FROM public.projects WHERE slug='website';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 04','Desenvolvimento', DATE '2026-10-12', DATE '2026-10-25','Pending',4 FROM public.projects WHERE slug='website';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 05','Testes', DATE '2026-10-26', DATE '2026-11-08','Pending',5 FROM public.projects WHERE slug='website';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id, 'FASE 06','Lançamento', DATE '2026-11-09', DATE '2026-11-15','Pending',6 FROM public.projects WHERE slug='website';

-- SEED: phases (branding / communication / social / launch)
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id,'FASE 01','Identidade', DATE '2026-09-21', DATE '2026-09-30','Em implementação',1 FROM public.projects WHERE slug='branding';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id,'FASE 02','Aplicações', NULL, NULL,'Pending',2 FROM public.projects WHERE slug='branding';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id,'FASE 01','Canais oficiais', DATE '2026-09-23', DATE '2026-09-24','Em implementação',1 FROM public.projects WHERE slug='communication';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id,'FASE 01','Planejamento', NULL, NULL,'Pending',1 FROM public.projects WHERE slug='social';
INSERT INTO public.phases (project_id, code, name, start_date, end_date, status, position)
SELECT id,'FASE 01','Preparação do lançamento', DATE '2026-11-09', DATE '2026-11-15','Pending',1 FROM public.projects WHERE slug='launch';

-- SEED: tasks
INSERT INTO public.tasks (project_id, phase_id, title, description, responsible, start_date, deadline, priority, status, dependency, validation_criteria, notes, checklist)
SELECT p.id, f.id, t.title, t.description, t.responsible::public.app_role, t.start_date, t.deadline, t.priority, t.status::public.task_status, t.dependency, t.validation, t.notes, '[]'::jsonb
FROM (VALUES
 ('website','FASE 01','Consolidar planejamento','Mapear projetos, fases e decisões já registradas.','amanda',DATE '2026-09-21',DATE '2026-09-21','Alta','em_implementacao','Não definido','Plano operacional aprovado para a semana da homepage.','Separar decisão oficial de prazo proposto.'),
 ('website','FASE 01','Responsáveis + decisões','Definir responsável, prazo e próximo passo de cada task crítica.','amanda',DATE '2026-09-22',DATE '2026-09-22','Alta','em_implementacao','Consolidar planejamento','Cada task crítica tem responsável, prazo e próximo passo.','Amanda centraliza follow-up.'),
 ('communication','FASE 01','Acessos / contas','Confirmar contas, domínios, e-mails e ferramentas.','amanda',DATE '2026-09-23',DATE '2026-09-23','Média','aguardando','Responsáveis + decisões','Nenhuma etapa técnica crítica depende de acesso pendente.','Registrar bloqueios e proprietário de cada acesso.'),
 ('communication','FASE 01','Canais oficiais','Documentar canais digitais prioritários da implantação.','amanda',DATE '2026-09-24',DATE '2026-09-24','Média','aguardando','Acessos / contas','Canais digitais documentados para lançamento.','Website, WhatsApp, e-mail, social e comunicação interna.'),
 ('website','FASE 01','Checkpoint 01','Validação de direção antes da fase Homepage.','pastor',DATE '2026-09-25',DATE '2026-09-25','Checkpoint','em_validacao','Plano, responsáveis e riscos atualizados','Pastor valida direção e libera próxima fase.','Reunião curta, focada em decisões e bloqueios.'),
 ('website','FASE 01','Infraestrutura digital','Preparar ambiente técnico para implementação visual.','nany',DATE '2026-09-26',DATE '2026-09-26','Alta','em_implementacao','Acessos / contas','Ambiente pronto para implementação visual da homepage.','Checar base técnica antes da etapa visual.'),
 ('website','FASE 01','Preparação Homepage','Organizar conteúdo, identidade e arquitetura de seções.','nany',DATE '2026-09-27',DATE '2026-09-27','Alta','em_implementacao','Infraestrutura digital','Homepage pronta para construção estrutural.','Header, hero, seções, CTAs e footer.'),
 ('website','FASE 02','Homepage — estrutura','Construir estrutura navegável com as seções principais.','nany',DATE '2026-09-28',DATE '2026-09-28','Alta','em_implementacao','Preparação Homepage','Estrutura navegável com seções principais no lugar.','Prioridade operacional imediata.'),
 ('website','FASE 02','Homepage — visual + responsividade','Refinar visual, imagens, proporções e responsividade.','nany',DATE '2026-09-29',DATE '2026-09-29','Alta','preparando','Homepage — estrutura','Visual e responsividade validados em desktop, tablet e mobile.','Checar todos os breakpoints.'),
 ('website','FASE 02','Homepage — teste + validação','Teste completo e validação para avançar.','pastor',DATE '2026-09-30',DATE '2026-09-30','Checkpoint','nao_iniciado','Homepage — visual + responsividade','Teste completo e aprovação registrada.','Registrar ajustes finais e decisão de entrega.'),
 ('branding','FASE 01','Identidade — apresentação','Apresentar o sistema visual AGAPE para validação.','nany',DATE '2026-09-28',DATE '2026-09-28','Média','aguardando','Sistema visual AGAPE consolidado','Identidade apresentada em formato claro para validação.','Profissional, AGAPE, sem aparência religiosa literal.'),
 ('website','FASE 03','Conteúdo das páginas internas','Textos, imagens e estrutura das páginas internas.','nany',DATE '2026-10-05',DATE '2026-10-11','Média','nao_iniciado','Homepage — teste + validação','Conteúdo revisado e pronto para desenvolvimento.',''),
 ('website','FASE 04','Desenvolvimento das páginas','Implementar páginas internas e integrações.','nany',DATE '2026-10-12',DATE '2026-10-25','Média','nao_iniciado','Conteúdo das páginas internas','Páginas implementadas conforme conteúdo aprovado.',''),
 ('website','FASE 05','Testes gerais','Testes de navegação, responsividade e regressões.','nany',DATE '2026-10-26',DATE '2026-11-08','Média','nao_iniciado','Desenvolvimento das páginas','Sem erros críticos em desktop, tablet e mobile.',''),
 ('launch','FASE 01','Checklist de lançamento','Checklist final, ensaio e validação pós-lançamento.','pastor',DATE '2026-11-09',DATE '2026-11-15','Checkpoint','nao_iniciado','Testes gerais','Lançamento validado.','')
) AS t(project_slug, phase_code, title, description, responsible, start_date, deadline, priority, status, dependency, validation, notes)
JOIN public.projects p ON p.slug = t.project_slug
JOIN public.phases f ON f.project_id = p.id AND f.code = t.phase_code;

-- SEED: checkpoints for Homepage phase
INSERT INTO public.checkpoints (phase_id, label, state, next_step, critical, position)
SELECT f.id, c.label, c.state::public.checkpoint_state, c.next_step, c.critical, c.position
FROM (VALUES
 ('Estrutura implementada','pending','Implementar estrutura em 28/09',true,1),
 ('Visual e responsividade validados','pending','Refinar visual em 29/09',true,2),
 ('Teste e validação final','pending','Validar em 30/09',true,3)
) AS c(label, state, next_step, critical, position)
JOIN public.phases f ON f.code = 'FASE 02'
JOIN public.projects p ON p.id = f.project_id AND p.slug = 'website';

-- SEED: approvals (pending only, no invented decisions)
INSERT INTO public.approvals (title, context, project_id, status, requested_by_label)
SELECT 'Homepage', 'Aguardando validação final da fase Homepage (30/09).', id, 'pending', 'Não definido' FROM public.projects WHERE slug='website';
INSERT INTO public.approvals (title, context, project_id, status, requested_by_label)
SELECT 'Brand Presentation', 'Aguardando aprovação da apresentação de identidade.', id, 'pending', 'Não definido' FROM public.projects WHERE slug='branding';
