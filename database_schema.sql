-- =====================================================
-- SCHEMA DO BANCO DE DADOS HEAL+ - AVALIAÇÃO DE FERIDAS
-- Baseado no formulário TIMERS do frontend
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS healplus_db;
USE healplus_db;

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de Pacientes
CREATE TABLE Paciente (
    idPaciente INT AUTO_INCREMENT PRIMARY KEY,
    nomePaciente VARCHAR(255) NOT NULL,
    dataNascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    profissao VARCHAR(100),
    estadoCivil ENUM('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel', 'separado'),
    cpfPaciente VARCHAR(14) UNIQUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Profissionais de Saúde
CREATE TABLE ProfissionalDeSaude (
    idProfissional INT AUTO_INCREMENT PRIMARY KEY,
    nomeProfissional VARCHAR(255) NOT NULL,
    especialidadeProfissional VARCHAR(100),
    coren VARCHAR(20),
    crm VARCHAR(20),
    email VARCHAR(255),
    telefone VARCHAR(20),
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Consultas
CREATE TABLE Consulta (
    idConsulta INT AUTO_INCREMENT PRIMARY KEY,
    idPaciente INT NOT NULL,
    idProfissional INT NOT NULL,
    dataConsulta DATE NOT NULL,
    horaConsulta TIME,
    situacaoConsulta ENUM('agendada', 'realizada', 'cancelada', 'reagendada') DEFAULT 'agendada',
    observacoes TEXT,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idProfissional) REFERENCES ProfissionalDeSaude(idProfissional)
);

-- Tabela de Feridas
CREATE TABLE Ferida (
    idFerida INT AUTO_INCREMENT PRIMARY KEY,
    idConsulta INT NOT NULL,
    localFerida VARCHAR(100),
    tipoFerida VARCHAR(100),
    largura DECIMAL(5,2),
    comprimento DECIMAL(5,2),
    profundidade DECIMAL(5,2),
    tempoEvolucao VARCHAR(100),
    etiologia ENUM('Lesão por Pressão', 'Úlcera Venosa', 'Úlcera Arterial', 'Pé Diabético', 'Ferida Cirúrgica', 'Ferida Traumática', 'Queimadura', 'Outra'),
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idConsulta) REFERENCES Consulta(idConsulta)
);

-- Tabela de Imagens de Feridas
CREATE TABLE ImagemFerida (
    idImagem INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    nomeArquivo VARCHAR(255),
    caminhoArquivo VARCHAR(500),
    tipoArquivo VARCHAR(50),
    tamanhoArquivo BIGINT,
    dataUpload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida)
);

-- =====================================================
-- TABELAS TIMERS - AVALIAÇÃO DETALHADA
-- =====================================================

-- T - Tecido (Leito da Ferida)
CREATE TABLE AvaliacaoTecido (
    idAvaliacaoTecido INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    percentualGranulacao INT DEFAULT 0 CHECK (percentualGranulacao >= 0 AND percentualGranulacao <= 100),
    percentualEpitelizacao INT DEFAULT 0 CHECK (percentualEpitelizacao >= 0 AND percentualEpitelizacao <= 100),
    percentualEsfacelo INT DEFAULT 0 CHECK (percentualEsfacelo >= 0 AND percentualEsfacelo <= 100),
    percentualNecrose INT DEFAULT 0 CHECK (percentualNecrose >= 0 AND percentualNecrose <= 100),
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida),
    CONSTRAINT check_tissue_percentages CHECK (percentualGranulacao + percentualEpitelizacao + percentualEsfacelo + percentualNecrose <= 100)
);

-- I - Infecção e Inflamação
CREATE TABLE AvaliacaoInfeccao (
    idAvaliacaoInfeccao INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    dorEscala INT DEFAULT 0 CHECK (dorEscala >= 0 AND dorEscala <= 10),
    dorFatores TEXT,
    -- Sinais de Inflamação
    inflamacaoRubor BOOLEAN DEFAULT FALSE,
    inflamacaoCalor BOOLEAN DEFAULT FALSE,
    inflamacaoEdema BOOLEAN DEFAULT FALSE,
    inflamacaoDorLocal BOOLEAN DEFAULT FALSE,
    inflamacaoPerdaFuncao BOOLEAN DEFAULT FALSE,
    -- Sinais de Infecção Local
    infeccaoEritemaPerilesional BOOLEAN DEFAULT FALSE,
    infeccaoCalorLocal BOOLEAN DEFAULT FALSE,
    infeccaoEdema BOOLEAN DEFAULT FALSE,
    infeccaoDorLocal BOOLEAN DEFAULT FALSE,
    infeccaoExsudato BOOLEAN DEFAULT FALSE,
    infeccaoOdor BOOLEAN DEFAULT FALSE,
    infeccaoRetardoCicatrizacao BOOLEAN DEFAULT FALSE,
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida)
);

-- M - Umidade (Exsudato)
CREATE TABLE AvaliacaoExsudato (
    idAvaliacaoExsudato INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    quantidadeExsudato ENUM('Ausente', 'Escasso', 'Pequeno', 'Moderado', 'Abundante'),
    tipoExsudato ENUM('Seroso', 'Sanguinolento', 'Serossanguinolento', 'Purulento', 'Seropurulento'),
    consistenciaExsudato ENUM('Fina', 'Viscosa', 'Espessa'),
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida)
);

-- E - Bordas (Edge)
CREATE TABLE AvaliacaoBordas (
    idAvaliacaoBordas INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    bordasCaracteristicas ENUM('Regulares', 'Irregulares', 'Elevadas', 'Maceradas', 'Epitelizadas'),
    fixacaoBordas ENUM('Aderidas', 'Não Aderidas', 'Descoladas'),
    velocidadeCicatrizacao ENUM('Rápida', 'Moderada', 'Lenta', 'Estagnada'),
    -- Pele Perilesional
    pelePerilesionalUmidade ENUM('Seca', 'Hidratada', 'Macerada', 'Edemaciada'),
    pelePerilesionalExtensao VARCHAR(255),
    -- Condições da Pele (múltiplas opções)
    pelePerilesionalIntegra BOOLEAN DEFAULT FALSE,
    pelePerilesionalEritematosa BOOLEAN DEFAULT FALSE,
    pelePerilesionalMacerada BOOLEAN DEFAULT FALSE,
    pelePerilesionalSecaDescamativa BOOLEAN DEFAULT FALSE,
    pelePerilesionalEczematosa BOOLEAN DEFAULT FALSE,
    pelePerilesionalHiperpigmentada BOOLEAN DEFAULT FALSE,
    pelePerilesionalHipopigmentada BOOLEAN DEFAULT FALSE,
    pelePerilesionalIndurada BOOLEAN DEFAULT FALSE,
    pelePerilesionalSensivel BOOLEAN DEFAULT FALSE,
    pelePerilesionalEdema BOOLEAN DEFAULT FALSE,
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida)
);

-- R - Reparo e Recomendações
CREATE TABLE AvaliacaoReparo (
    idAvaliacaoReparo INT AUTO_INCREMENT PRIMARY KEY,
    idFerida INT NOT NULL,
    observacoes TEXT,
    dataConsulta DATE,
    horaConsulta TIME,
    profissionalResponsavel VARCHAR(255),
    coren VARCHAR(20),
    dataRetorno DATE,
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida)
);

-- S - Fatores Sociais e Histórico do Paciente
CREATE TABLE AvaliacaoSocial (
    idAvaliacaoSocial INT AUTO_INCREMENT PRIMARY KEY,
    idPaciente INT NOT NULL,
    nivelAtividade VARCHAR(100),
    compreensaoAdesao VARCHAR(100),
    suporteSocial TEXT,
    praticaAtividadeFisica BOOLEAN DEFAULT FALSE,
    ingestaoAlcool BOOLEAN DEFAULT FALSE,
    fumante BOOLEAN DEFAULT FALSE,
    estadoNutricional TEXT,
    ingestaoAguaDia VARCHAR(100),
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

-- Histórico Clínico e Comorbidades
CREATE TABLE AvaliacaoClinica (
    idAvaliacaoClinica INT AUTO_INCREMENT PRIMARY KEY,
    idPaciente INT NOT NULL,
    objetivoTratamento TEXT,
    historicoCicrizacao TEXT,
    -- Comorbidades
    dmi BOOLEAN DEFAULT FALSE,
    dmii BOOLEAN DEFAULT FALSE,
    has BOOLEAN DEFAULT FALSE,
    neoplasia BOOLEAN DEFAULT FALSE,
    hivAids BOOLEAN DEFAULT FALSE,
    obesidade BOOLEAN DEFAULT FALSE,
    cardiopatia BOOLEAN DEFAULT FALSE,
    dpoc BOOLEAN DEFAULT FALSE,
    doencaHematologica BOOLEAN DEFAULT FALSE,
    doencaVascular BOOLEAN DEFAULT FALSE,
    demenciaSenil BOOLEAN DEFAULT FALSE,
    insuficienciaRenal BOOLEAN DEFAULT FALSE,
    hanseniase BOOLEAN DEFAULT FALSE,
    insuficienciaHepatica BOOLEAN DEFAULT FALSE,
    doencaAutoimune BOOLEAN DEFAULT FALSE,
    outrosHpp TEXT,
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

-- =====================================================
-- TABELAS DE APOIO
-- =====================================================

-- Tabela de Terapias
CREATE TABLE Terapia (
    idTerapia INT AUTO_INCREMENT PRIMARY KEY,
    nomeTerapia VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Equipamentos
CREATE TABLE Equipamento (
    idEquipamento INT AUTO_INCREMENT PRIMARY KEY,
    nomeEquipamento VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Insumos
CREATE TABLE Insumo (
    idInsumo INT AUTO_INCREMENT PRIMARY KEY,
    nomeTerapia VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Procedimentos
CREATE TABLE Procedimento (
    idProcedimento INT AUTO_INCREMENT PRIMARY KEY,
    nomeProcedimento VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Relatórios de Consulta
CREATE TABLE RelatorioConsulta (
    idRelatorio INT AUTO_INCREMENT PRIMARY KEY,
    idConsulta INT NOT NULL,
    descricaoAnalise TEXT,
    recomendacoes TEXT,
    dataGeracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idConsulta) REFERENCES Consulta(idConsulta)
);

-- Tabela de Agendamentos
CREATE TABLE ChatAgendamento (
    idAgendamento INT AUTO_INCREMENT PRIMARY KEY,
    idPaciente INT NOT NULL,
    idProfissional INT NOT NULL,
    dataAgendamento DATE NOT NULL,
    horaAgendamento TIME NOT NULL,
    status ENUM('agendado', 'confirmado', 'realizado', 'cancelado', 'reagendado') DEFAULT 'agendado',
    observacoes TEXT,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idProfissional) REFERENCES ProfissionalDeSaude(idProfissional)
);

-- =====================================================
-- RELACIONAMENTOS ADICIONAIS
-- =====================================================

-- Adicionar chaves estrangeiras para Consulta
ALTER TABLE Consulta 
ADD COLUMN idFerida INT,
ADD COLUMN idTerapia INT,
ADD COLUMN idEquipamento INT,
ADD COLUMN idInsumo INT,
ADD COLUMN idProcedimento INT,
ADD COLUMN idAgendamento INT,
ADD FOREIGN KEY (idFerida) REFERENCES Ferida(idFerida),
ADD FOREIGN KEY (idTerapia) REFERENCES Terapia(idTerapia),
ADD FOREIGN KEY (idEquipamento) REFERENCES Equipamento(idEquipamento),
ADD FOREIGN KEY (idInsumo) REFERENCES Insumo(idInsumo),
ADD FOREIGN KEY (idProcedimento) REFERENCES Procedimento(idProcedimento),
ADD FOREIGN KEY (idAgendamento) REFERENCES ChatAgendamento(idAgendamento);

-- =====================================================
-- VIEWS PARA CONSULTAS DETALHADAS
-- =====================================================

-- View para visualizar consultas detalhadas
CREATE VIEW vw_ConsultasDetalhadas AS
SELECT 
    c.idConsulta,
    c.dataConsulta,
    c.situacaoConsulta,
    p.nomePaciente,
    p.cpfPaciente,
    prof.nomeProfissional,
    prof.especialidadeProfissional,
    f.localFerida,
    f.tipoFerida,
    t.nomeTerapia,
    e.nomeEquipamento,
    ins.nomeTerapia AS nomeInsumo,
    pr.nomeProcedimento
FROM 
    Consulta c
LEFT JOIN Paciente p ON c.idPaciente = p.idPaciente
LEFT JOIN ProfissionalDeSaude prof ON c.idProfissional = prof.idProfissional
LEFT JOIN Ferida f ON c.idFerida = f.idFerida
LEFT JOIN Terapia t ON c.idTerapia = t.idTerapia
LEFT JOIN Equipamento e ON c.idEquipamento = e.idEquipamento
LEFT JOIN Insumo ins ON c.idInsumo = ins.idInsumo
LEFT JOIN Procedimento pr ON c.idProcedimento = pr.idProcedimento;

-- View de agendamentos com nome dos envolvidos
CREATE VIEW vw_Agendamentos AS
SELECT 
    ca.idAgendamento,
    ca.dataAgendamento,
    ca.horaAgendamento,
    ca.status,
    p.nomePaciente,
    prof.nomeProfissional
FROM 
    ChatAgendamento ca
INNER JOIN Paciente p ON ca.idPaciente = p.idPaciente
INNER JOIN ProfissionalDeSaude prof ON ca.idProfissional = prof.idProfissional;

-- View de relatórios de consultas
CREATE VIEW vw_RelatoriosConsultas AS
SELECT 
    rc.idRelatorio,
    rc.descricaoAnalise,
    rc.recomendacoes,
    c.dataConsulta,
    p.nomePaciente,
    prof.nomeProfissional
FROM 
    RelatorioConsulta rc
INNER JOIN Consulta c ON rc.idConsulta = c.idConsulta
INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
INNER JOIN ProfissionalDeSaude prof ON c.idProfissional = prof.idProfissional;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para tabelas principais
CREATE INDEX idx_paciente_nome ON Paciente(nomePaciente);
CREATE INDEX idx_paciente_cpf ON Paciente(cpfPaciente);
CREATE INDEX idx_consulta_data ON Consulta(dataConsulta);
CREATE INDEX idx_consulta_paciente ON Consulta(idPaciente);
CREATE INDEX idx_consulta_profissional ON Consulta(idProfissional);
CREATE INDEX idx_ferida_consulta ON Ferida(idConsulta);
CREATE INDEX idx_agendamento_data ON ChatAgendamento(dataAgendamento);
CREATE INDEX idx_agendamento_paciente ON ChatAgendamento(idPaciente);
CREATE INDEX idx_agendamento_profissional ON ChatAgendamento(idProfissional);

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir dados de exemplo
INSERT INTO ProfissionalDeSaude (nomeProfissional, especialidadeProfissional, coren, crm, email) VALUES
('Dr. Pedro Tescaro', 'Especialista em Feridas', '123456-SP', 'CRM123456', 'pedroatescaro@gmail.com'),
('Dra. Maria Silva', 'Enfermeira Estomaterapeuta', '789012-SP', 'COREN789012', 'maria.silva@email.com');

INSERT INTO Paciente (nomePaciente, dataNascimento, telefone, email, profissao, estadoCivil, cpfPaciente) VALUES
('Pedro Antonio Silvestre Tescaro', '1985-05-15', '(11) 99999-9999', 'pedro.paciente@email.com', 'Engenheiro', 'casado', '123.456.789-00'),
('Guilherme Santos', '1990-08-22', '(11) 88888-8888', 'guilherme@email.com', 'Advogado', 'solteiro', '987.654.321-00');

INSERT INTO Terapia (nomeTerapia, descricao) VALUES
('Curativo Hidrocolóide', 'Curativo para feridas com exsudato moderado'),
('Terapia por Pressão Negativa', 'Sistema de vácuo para cicatrização'),
('Curativo de Alginato', 'Para feridas com exsudato abundante');

INSERT INTO Equipamento (nomeEquipamento, descricao) VALUES
('Ultrassom Terapêutico', 'Equipamento para terapia ultrassônica'),
('Laser de Baixa Intensidade', 'Para estimulação da cicatrização'),
('Sistema de Pressão Negativa', 'Equipamento portátil de vácuo');

-- =====================================================
-- CONSULTAS DE EXEMPLO
-- =====================================================

-- Consulta completa com dados do paciente, profissional, ferida e terapia
SELECT 
    c.idConsulta,
    c.dataConsulta,
    c.situacaoConsulta,
    p.nomePaciente,
    p.cpfPaciente,
    prof.nomeProfissional,
    prof.especialidadeProfissional,
    f.localFerida,
    f.tipoFerida,
    t.nomeTerapia
FROM 
    Consulta c
INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
INNER JOIN ProfissionalDeSaude prof ON c.idProfissional = prof.idProfissional
LEFT JOIN Ferida f ON c.idFerida = f.idFerida
LEFT JOIN Terapia t ON c.idTerapia = t.idTerapia;

-- Consultas com agendamento e status
SELECT 
    c.idConsulta,
    c.dataConsulta,
    ca.dataAgendamento,
    ca.horaAgendamento,
    ca.status,
    p.nomePaciente,
    prof.nomeProfissional
FROM 
    Consulta c
INNER JOIN ChatAgendamento ca ON c.idAgendamento = ca.idAgendamento
INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
INNER JOIN ProfissionalDeSaude prof ON c.idProfissional = prof.idProfissional;

-- Relatório das consultas com paciente e profissional
SELECT 
    r.idRelatorio,
    r.descricaoAnalise,
    r.recomendacoes,
    p.nomePaciente,
    prof.nomeProfissional
FROM 
    RelatorioConsulta r
INNER JOIN Consulta c ON r.idConsulta = c.idConsulta
INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
INNER JOIN ProfissionalDeSaude prof ON c.idProfissional = prof.idProfissional;
