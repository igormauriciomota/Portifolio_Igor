CREATE TABLE `profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`name` text DEFAULT 'Igor Mota' NOT NULL,
	`headline` text DEFAULT 'Desenvolvedor Python & Analista de Dados' NOT NULL,
	`location` text DEFAULT 'Belo Horizonte, MG' NOT NULL,
	`email` text,
	`linkedin_url` text,
	`github_url` text,
	`photo_key` text,
	`resume_key` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`eyebrow` text NOT NULL,
	`description` text NOT NULL,
	`stack` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'Planejado' NOT NULL,
	`accent` text DEFAULT '#ffd24a' NOT NULL,
	`github_url` text,
	`live_url` text,
	`video_url` text,
	`image_key` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT OR IGNORE INTO `profile` (`id`, `name`, `headline`, `location`)
VALUES (1, 'Igor Mota', 'Desenvolvedor Python & Analista de Dados', 'Belo Horizonte, MG');
--> statement-breakpoint
INSERT INTO `projects` (`title`, `eyebrow`, `description`, `stack`, `status`, `accent`, `featured`, `sort_order`) VALUES
('Finance MindShift', 'Mini ERP financeiro', 'Contas a pagar e receber, fluxo de caixa, perfis de acesso, relatórios e indicadores conectados ao banco de dados.', '["Flask","SQLite","Chart.js"]', 'Em desenvolvimento', '#ffd24a', 1, 1),
('Fiscal Audit Engine', 'Auditoria de NF-e', 'Leitura de XML 4.00 e validações de CFOP, CST, NCM, ICMS, PIS e COFINS com trilha de auditoria.', '["Python","Pandas","Flask"]', 'Planejado', '#4ae0c1', 1, 2),
('Data Insight Lab', 'Análise de dados', 'Exploração, limpeza e visualização de dados empresariais com indicadores claros para apoiar decisões.', '["Pandas","Power BI","SQL"]', 'Em evolução', '#7c8cff', 1, 3),
('Inventory Intelligence', 'Estoque e custos', 'CRUD de produtos, movimentações, custo médio, margem e alertas de reposição para pequenos negócios.', '["Flask","SQLAlchemy","Bootstrap"]', 'Planejado', '#ff8c68', 1, 4),
('Business API', 'API REST', 'API documentada para clientes, produtos e lançamentos com autenticação, validação e testes automatizados.', '["FastAPI","PostgreSQL","Pytest"]', 'Planejado', '#57b8ff', 1, 5),
('Python Practice Lab', 'Evolução documentada', 'Laboratório com exercícios de fundamentos a Flask, separando aprendizado contínuo de aplicações completas.', '["Python","SQLite","Git"]', 'Em evolução', '#b47cff', 1, 6);
