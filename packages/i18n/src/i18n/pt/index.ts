import type { BaseTranslation } from "../i18n-types.js"

const ops = {
  eq: "=",
  neq: "!=",
  contains: "Contém",
  does_not_contain: "Não Contém",
  starts_with: "Começa Com",
  ends_with: "Termina Com",
  is_empty: "Está Vazio",
  is_not_empty: "Não Está Vazio",
  min: "Mínimo",
  max: "Máximo",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: 'Em',
  nin: 'Não Em',
  any_of: 'Qualquer Um',
  not_any_of: 'Nenhum',
  is_same_day: "É o Mesmo Dia",
  is_not_same_day: "Não É o Mesmo Dia",
  is_tody: "É Hoje",
  is_not_today: "Não É Hoje",
  is_after_today: "É Depois de Hoje",
  is_before_today: "É Antes de Hoje",
  is_tomorrow: "É Amanhã",
  is_not_tomorrow: "Não É Amanhã",
  is_after_tomorrow: "É Depois de Amanhã",
  is_before_tommorow: "É Antes de Amanhã",
  is_yesterday: "É Ontem",
  is_not_yesterday: "Não É Ontem",
  is_after_yesterday: "É Depois de Ontem",
  is_before_yesterday: "É Antes de Ontem",
  is_before: "É Antes",
  is_not_before: "Não É Antes",
  is_after: "É Depois",
  is_not_after: "Não É Depois",
  is_true: "É Verdadeiro",
  is_false: "É Falso",
}

const fieldTypes = {
  string: "Texto",
  longText: "Texto Longo",
  number: "Número",
  date: "Data",
  dateRange: "Intervalo de Data",
  id: "ID",
  createdAt: "Criado Em",
  autoIncrement: "Auto Incremento",
  updatedAt: "Atualizado Em",
  createdBy: "Criado Por",
  updatedBy: "Atualizado Por",
  reference: "Referência",
  rollup: "Agregação",
  select: "Seleção",
  rating: "Avaliação",
  email: "Email",
  url: "URL",
  attachment: "Anexo",
  json: "JSON",
  checkbox: "Caixa de Seleção",
  user: "Usuário",
  currency: "Moeda",
  duration: "Duração",
  button: "Botão",
  percentage: "Porcentagem",
  formula: "Fórmula",
}

const rollupFns = {
  min: "Mínimo",
  max: "Máximo",
  sum: "Soma",
  average: "Média",
  count: "Contagem",
  lookup: "Consulta"
}

const aggregateFns = {
  min: "Mínimo",
  max: "Máximo",
  sum: "Soma",
  count: "Contagem",
  count_empty: "Vazio",
  count_uniq: "Único",
  count_not_empty: "Preenchido",
  percent_empty: "Porcentagem Vazio",
  percent_not_empty: "Porcentagem Preenchido",
  percent_uniq: "Porcentagem Único",
  avg: "Média",
  count_true: "Verdadeiro",
  count_false: "Falso",
  percent_true: "Porcentagem Verdadeiro",
  percent_false: "Porcentagem Falso",
  start_max: "Data Início Máxima",
  end_max: "Data Fim Máxima",
  start_min: "Data Início Mínima",
  end_min: "Data Fim Mínima",
}

const macros = {
  "@me": "Usuário Atual",
  "@now": "Agora",
  "@today": "Hoje",
  "@yesterday": "Ontem",
  "@tomorrow": "Amanhã",
}

const viewTypes = {
  grid: "Grade",
  kanban: "Kanban",
  gallery: "Galeria",
  list: "Lista",
  calendar: "Calendário",
  pivot: "Pivot"
}

const widgetTypes = {
  aggregate: "Agregação",
  chart: "Gráfico",
  table: "Tabela"
}

const timeScales = {
  month: "Mês",
  week: "Semana",
  day: "Dia"
}

const record = {
  label: 'Registro',
  labels: 'Registros',
  search: 'Pesquisar Registros...',
  openMenu: 'Abrir Menu',
  create: 'Criar Registro',
  update: 'Atualizar Registro',
  delete: 'Excluir Registro',
  bulkDuplicated: 'Registros duplicados!',
  viewRecordDetail: 'Ver Detalhes do Registro',
  copyRecordId: 'Copiar ID do Registro',
  createByForm: 'Criar por Formulário',
  duplicateRecord: 'Duplicar Registro',
  includeData: 'Incluir Dados',
  records: '{n|number} Registros',
  detail: 'Detalhes do Registro',
  duplicate: 'Duplicar {n|number} Registros',
  updateRecords: 'Atualizar {n|number} Registros',
  bulkUpdateRecords: 'Atualização em Massa de {n|number} Registros',
  deleteRecords: 'Excluir {n|number} Registros',
  confirmDeleteRecord: 'Tem certeza de que deseja excluir este registro?',
  confirmDeleteRecordDescription: 'Esta ação não pode ser desfeita. Isso excluirá permanentemente este registro e removerá seus dados de nossos servidores.',
  confirmDeleteRecords: 'Tem certeza de que deseja excluir {n|number} registros?',
  confirmDeleteRecordsDescription: 'Esta ação não pode ser desfeita. Isso excluirá permanentemente registros de {table}.',
  confirmDuplicateRecords: 'Duplicar {n|number} Registros?',
  confirmDuplicateRecordsDescription: 'Esta ação duplicará {n|number} registros da tabela {table}.',
  confirmDuplicateRecord: 'Duplicar Registro?',
  confirmDuplicateRecordDescription: 'Um novo registro com novo ID será criado.',
  failedToDuplicateRecord: 'Falha ao duplicar registro',
  failedToDeleteRecord: 'Falha ao excluir registro',
  copiedRecordId: 'ID do registro copiado para a área de transferência',
  createdRecord: 'Registro foi criado!',
  bulkUpdate: {
    title: 'Atualização em Massa de Registros',
    description: 'Todos os campos selecionados serão atualizados',
    updateWithCondition: 'Atualizar registros com a seguinte condição',
    addField: 'Adicionar Campo de Atualização',
    selectColumns: 'SELECIONAR COLUNAS PARA EDITAR',
    updated: 'atualizado',
    selectAll: 'Selecionar Tudo',
    removeAll: 'Remover Tudo',
    continue: 'Continuar',
    noRecordsUpdated: 'Nenhum registro atualizado',
    recordsUpdated: '{count} registros atualizados com sucesso',
    button: 'Atualização em Massa',
    noFilterAlert: 'Sem filtro, todos os registros serão atualizados, por favor, tenha cuidado!'
  },
  reference: {
    link: 'Vincular Registros',
    linked: '{n|number} Registros Vinculados'
  },
  button: {
    confirmToUpdate: 'Confirmar para atualizar',
    confirmToUpdateDescription: 'Os seguintes campos serão atualizados quando você clicar no botão.',
  },
  noRecord: 'Nenhum registro',
  showHiddenFields: 'Mostrar {n|number} Campos Ocultos',
  hideHiddenFields: 'Ocultar {n|number} Campos Ocultos',
}

const form =  {
  label: 'Formulário',
  create: 'Criar Formulário',
  noForms: '{tableName} não tem formulários',
  noFormsDescription: 'Você pode coletar dados em formulários.',
  addDescription: 'Adicionar descrição',
  condition: 'Condição',
  invalidCondition: 'Condição inválida',
  setDefaultValue: 'Definir valor padrão para {field}',
  formField: 'Campo do Formulário',
  fieldsSelected: '{n} Campos Selecionados',
  searchFormField: 'Pesquisar campo do formulário...',
  selectAllFields: 'Selecionar todos os campos',
  hideFields: 'Ocultar Campos',
  showFields: 'Mostrar Campos',
  noFieldsFound: 'Nenhum campo encontrado com o título `{q}`',
  formSetting: 'Configuração do Formulário',
  duplicateForm: 'Duplicar Formulário',
  deleteForm: 'Excluir Formulário',
  duplicateSuccess: 'Formulário duplicado com sucesso',
  backgroundColor: 'Cor de Fundo',
  autoAddNewField: 'Adicionar automaticamente novo campo ao formulário ao criar campo',
  autoAddNewFieldDescription: 'Quando um novo campo é criado, ele será automaticamente configurado para exibição.',
  deleteFormConfirm: 'Excluir formulário: {name}?',
  deleteFormDescription: 'O formulário será excluído permanentemente.',
  duplicateFormDialog: 'Duplicar formulário: {name}?',
  duplicateFormDialogDescription: 'O formulário será duplicado.',
  setName: 'Definir nome do formulário',
  enableCondition: 'Habilitar condição',
}

const common = {
  tables: 'Tabelas',
  table: 'Tabela',
  filters: 'Filtro',
  color: 'Cor',
  select: 'Selecione uma Tabela...',
  search: 'Pesquisar Tabelas...',
  noTablesFound: 'Nenhuma tabela encontrada.',
  sorts: {
    sort: 'Ordenar',
    add: 'Adicionar Ordenação',
    empty: 'Não há ordenação',
    direction: {
      asc: 'Ascendente',
      desc: 'Descendente'
    }
  },
  fields: 'Campos',
  filter: {
    empty: 'Não há filtros'
  },
  condition: {
    add: 'Adicionar Condição',
    addGroup: 'Adicionar Grupo de Condição'
  },
  submit: 'Enviar',
  cancel: 'Cancelar',
  where: 'Onde',
  searchOp: 'Pesquisar Operação...',
  colorEmpty: 'Não há cor',
  updateName: 'Atualizar Nome da Tabela',
  duplicateTable: 'Duplicar Tabela',
  deleteTable: 'Excluir Tabela',
  create: 'Criar Nova Tabela',
  import: 'Importar Tabela'
}

const webhook = {
  label: 'Webhook',
  create: 'Criar Webhook',
  delete: 'Excluir Webhook',
  update: 'Atualizar Webhook',
  duplicate: 'Duplicar Webhook',
  noWebhooks: '{table} não tem webhooks',
  noWebhooksDescription: 'Clique no botão para criar seu primeiro webhook',
}

const field = {
  typeChanged: 'Você alterou o tipo de campo, os dados serão convertidos para o novo tipo quando possível, mas podem ser excluídos',
  field: 'Campo',
  fields: 'Campos',
  create: 'Criar Campo',
  created: 'Campo foi criado!',
  update: 'Atualizar Campo',
  updated: 'Campo foi atualizado!',
  delete: 'Excluir Campo',
  deleteConfirm: "Tem certeza de que deseja excluir o seguinte campo? Todos os dados associados a este campo serão excluídos permanentemente da tabela.",
  deleted: 'Campo foi excluído!',
  deleteFailed: 'Falha ao excluir campo',
  duplicate: 'Duplicar Campo',
  duplicateDescription: 'Tem certeza de que deseja duplicar o seguinte campo?',
  hidden: '{n|number} Campos Ocultos',
  searchTableFields: 'Pesquisar campos da tabela {table}...',
  selectField: 'Selecionar campo...',
  empty: 'Nenhum campo',
  searchType: 'Pesquisar tipo de campo...',
  defaultValue: {
    label: 'Valor Padrão',
    placeholder: 'Valor padrão...',
    invalid: 'Valor padrão inválido',
    invalidDescription: 'Seu valor padrão é inválido. O valor padrão não será salvo.',
    markAsRequired: 'Marcar como campo obrigatório.'
  },
  display: {
    label: 'Campo de Exibição',
    markAsDisplay: 'Marcar como campo de exibição.'
  },
  id: {
    placeholder: 'Deixe em branco para gerar automaticamente...'
  },
  string: {
    min: 'Comprimento Mínimo',
    max: 'Comprimento Máximo'
  },
  longText: {
    allowRichText: 'Permitir texto rico.'
  },
  number: {
    min: 'Mínimo',
    max: 'Máximo',
    minPlaceholder: 'Valor mínimo...',
    maxPlaceholder: 'Valor máximo...'
  },
  duration: {
    min: "Mínimo",
    max: "Máximo",
    minPlaceholder: "Valor mínimo...",
    maxPlaceholder: "Valor máximo..."
  },
  currency: {
    symbol: 'Símbolo',
    min: 'Mínimo',
    max: 'Máximo',
    minPlaceholder: 'Valor mínimo...',
    maxPlaceholder: 'Valor máximo...'
  },
  percentage: {
    min: 'Mínimo',
    max: 'Máximo',
    minPlaceholder: 'Itens mínimos...',
    maxPlaceholder: 'Itens máximos...'
  },
  date: {
    format: 'Formato de Data',
    includeTime: 'Incluir Hora',
    timeFormat: 'Formato de Hora',
    selectMacro: 'Selecionar Macro...'
  },
  dateRange: {
    format: 'Formato de Data',
    includeTime: 'Incluir Hora',
    timeFormat: 'Formato de Hora'
  },
  formula: {
    label: 'Fórmula',
    placeholder: 'Fórmula...',
    syntax: 'Sintaxe',
    examples: 'Exemplos'
  },
  select: {
    option: {
      label: 'Opção',
      add: 'Adicionar Opção',
      selectDefault: 'Selecionar opções padrão...',
      search: 'Pesquisar opção...',
      noOptionFound: 'Nenhuma opção encontrada.',
      update: 'Atualizar opção',
      delete: 'Excluir opção',
      createRecord: 'Criar registro sob esta opção',
      create: 'Criar opção'
    },
    allowAddMultiple: 'Permitir adicionar múltiplas opções',
    changeFromMultipleToSingle: 'Mudar de múltiplas opções para uma única opção!',
    changeFromMultipleToSingleDescription: 'Apenas a primeira opção será mantida.',
    min: 'Itens mínimos',
    max: 'Itens máximos',
    minPlaceholder: 'Itens mínimos...',
    maxPlaceholder: 'Itens máximos...'
  },
  attachment: {
    min: 'Itens mínimos',
    max: 'Itens máximos',
    minPlaceholder: 'Itens mínimos...',
    maxPlaceholder: 'Itens máximos...'
  },
  user: {
    allowAddMultiple: 'Permitir adicionar múltiplos usuários',
    changeFromMultipleToSingle: 'Mudar de múltiplas opções para uma única opção!',
    changeFromMultipleToSingleDescription: 'Apenas o primeiro usuário será mantido.',
    min: 'Itens mínimos',
    max: 'Itens máximos',
    minPlaceholder: 'Itens mínimos...',
    maxPlaceholder: 'Itens máximos...'
  },
  reference: {
    foreignTable: 'Tabela estrangeira',
    createSymmetricField: 'Criar campo simétrico',
    limitRecordSelectionToCondition: 'Limitar seleção de registros à condição.',
    min: 'Itens mínimos',
    max: 'Itens máximos',
    minPlaceholder: 'Itens mínimos...',
    maxPlaceholder: 'Itens máximos...'
  },
  rollup: {
    referenceField: 'Campo de referência',
    selectReferenceField: 'Selecionar campo de referência...',
    foreignRollupField: 'Campo de agregação estrangeiro',
    aggregateFunction: 'Função de agregação'
  },
  button: {
    label: 'Rótulo',
    disabledWhen: 'Desativado quando...',
    updateValueWhenClickButton: 'Atualizar valor ao clicar no botão',
    confirmBeforeUpdate: 'Confirmar antes de atualizar',
    addAnotherFieldToUpdate: 'Adicionar outro campo para atualizar',
    valueToUpdate: 'Valor para atualizar...'
  }
}

const view = {
  field: {
    showAllFields: 'Mostrar todos os campos',
    hideAllFields: 'Ocultar todos os campos',
    showSystemFields: 'Mostrar campos do sistema',
    hideSystemFields: 'Ocultar campos do sistema'
  },
  widget: {
    title: 'Widgets de Visualização',
    empty: 'Nenhum widget',
    add: 'Adicionar Widget'
  },
  kanban: {
    kanban: 'Kanban',
    update: 'Atualizar Visualização Kanban',
    view: 'Visualização Kanban',
    field: 'Campo Kanban',
    groupBy: 'Agrupar por campo de tipo seleção',
    noSelectField: 'Nenhum campo de seleção encontrado.',
    noOption: 'Nenhuma opção',
    collapseLane: 'Recolher faixa'
  },
  gallery: {
    gallery: 'Galeria',
    update: 'Atualizar Visualização de Galeria',
    view: 'Visualização de Galeria',
    field: 'Campo de Galeria',
    groupBy: 'Agrupar por campo de tipo anexo',
    noAttachmentField: 'Nenhum campo de tipo anexo encontrado.'
  },
  calendar: {
    calendar: 'Calendário',
    update: 'Atualizar Visualização de Calendário',
    view: 'Visualização de Calendário',
    field: 'Campo de Calendário',
    groupBy: 'Agrupar por campo de data',
    noDateField: 'Nenhum campo de data encontrado.',
    select: 'Selecione um campo de tipo seleção para agrupar faixas do calendário',
    selectField: 'Selecionar campo de calendário',
    scope: {
      selectedDate: 'Na data selecionada',
      withoutDate: 'Sem data',
      thisMonth: 'Neste mês',
      allRecords: 'Todos os registros',
      thisWeek: 'Nesta semana',
    }
  },
  pivot: {
    pivot: 'Pivot',
    update: 'Atualizar Visualização Pivot',
    view: 'Visualização Pivot',
    columnLabel: 'Rótulo da Coluna',
    rowLabel: 'Rótulo da Linha',
    swap: 'Trocar com Rótulo da Coluna',
    aggregate: 'Agregação',
    aggregateFn: {
      sum: 'Soma',
      count: 'Contagem',
      average: 'Média',
      max: 'Máximo',
      min: 'Mínimo'
    },
    value: 'Valor',
    selectField: 'Selecionar um campo para pivotar...'
  },
  create: 'Criar Visualização',
  created: 'Visualização criada com sucesso',
  type: 'Tipo de Visualização',
  updated: 'Visualização atualizada',
  updateName: 'Atualizar Nome da Visualização',
  duplicateView: 'Duplicar Visualização',
  deleteView: 'Excluir Visualização',
  downloadView: 'Baixar Visualização',
  downloadAsExcel: 'Baixar como Excel',
  downloadAsCSV: 'Baixar como CSV',
  downloadAsJSON: 'Baixar como JSON',
  setAsDefaultView: 'Definir como Visualização Padrão'
}

const aggregate = {
  searchType: 'Pesquisar tipo de agregação...',
  selectField: 'Selecionar um Campo para Agregar...'
}

const dashboard = {
  dashboards: 'Painéis',
  create: 'Criar Painel',
  nameDescription: 'Nome de exibição público do painel.',
  updateName: 'Atualizar Nome do Painel',
  duplicateDashboard: 'Duplicar Painel',
  deleteDashboard: 'Excluir Painel',
  confirmDeleteDashboard: 'Confirmar exclusão do painel?',
  confirmDeleteDashboardDescription: 'Esta ação não pode ser desfeita. Isso excluirá permanentemente seu painel e removerá seus dados de nossos servidores.',
  duplicateDashboardDescription: 'Confirmar duplicação do painel?',
  duplicateDashboardConfirm: 'Duplicar Painel',
  updateDashboard: 'Atualizar Painel',
}

const base = {
  name: 'Nome da Base',
  createBase: 'Criar Nova Base',
  created: 'Base criada com sucesso',
  importFromTemplate: 'Importar do Modelo',
  displayName: 'Nome de Exibição da Base',
  noBases: 'Nenhuma Base',
  baseSettings: 'Configurações da Base',
  updateBase: 'Atualizar Base',
  updateBaseName: 'Atualizar Nome da Base',
  deleteBase: 'Excluir Base',
  deleteBaseConfirm: 'Tem certeza de que deseja excluir a seguinte base?',
  duplicateBase: 'Duplicar Base {name}',
  nameDescription: 'Nome de exibição da base.',
  includeData: 'Incluir Dados',
  includeDataDescription: 'Incluir dados na nova base.',
  duplicateBaseDescription: 'Criar uma nova base incluindo todas as tabelas na base.',
  systemFieldsUpdated: 'Os campos do sistema serão atualizados para o usuário atual e o carimbo de data/hora.'
}

const space = {
  space: 'Espaço',
  spaces: 'Espaços',
  name: "Nome do Espaço",
  setDisplayName: 'Definir Nome de Exibição',
  searchMembers: 'Pesquisar membros...',
  cannotInviteMemberToPersonalSpace: 'Você não pode convidar membros para um espaço pessoal.',
  createSpace: 'Criar Espaço',
  personalSpace: 'Espaço Pessoal de {username}',
  createSpaceDescription: 'Crie um novo espaço para organizar seus dados e colaborar com sua equipe.',
  spaceName: 'Nome do Espaço',
  spaceNameDescription: 'Nome de exibição do espaço.',
  cannotDeletePersonalSpace: 'Você não pode excluir seu espaço pessoal.',
  deleteSpace: 'Excluir Espaço',
  deleteSpaceConfirm: 'Tem certeza de que deseja excluir o seguinte espaço?',
  deleteSpaceDescription: 'Esta ação não pode ser desfeita. Isso excluirá permanentemente o estado do seu banco de dados e removerá seus dados de nossos servidores.',
  memberList: 'Uma lista dos membros do seu espaço de trabalho.',
  inviteMember: 'Convidar Membro',
  invitations: 'Convites',
  invite: 'Convidar',
  pendingInvitations: 'Uma lista de convites pendentes.',
  invitedAt: 'Convidado em',
  deleteInvitation: 'Excluir Convite'
}

const schema = {
  label: 'Esquema',
  systemFields: 'Campos do Sistema',
  required: 'Obrigatório',
  display: 'Exibição',
  fieldName: 'Nome do Campo',
  addField: 'Adicionar Campo'
}

const account = {
  logout: 'Sair',
  accountSettings: 'Configurações da Conta',
  apiToken: 'Token da API',
  undbTemplates: 'Modelos Undb',
  undbWebsite: 'Site Undb',
}

const setting = {
  setting: 'Configurações',
  members: 'Membros',
  settingAndMembers: 'Configurações e Membros',
}

const roles = {
  owner: 'Proprietário',
  admin: 'Administrador',
  member: 'Membro',
  viewer: 'Visualizador'
}

const authz = {
  noRecordLevelSecurity: '{table} não tem segurança de nível de registro',
  noRecordLevelSecurityDescription: 'Clique no botão para criar sua primeira política de segurança de nível de registro',
  create: 'Criar Segurança de Nível de Registro',
  created: 'Segurança de nível de registro criada',
  failed: 'Falha ao criar segurança de nível de registro',
  rlsName: 'Nome da Segurança de Nível de Registro',
  giveYourRLSName: 'Dê um nome à sua segurança de nível de registro',
  actions: {
    read: 'Ler',
    create: 'Criar',
    update: 'Atualizar',
    delete: 'Excluir'
  },
  subjectName: 'Assunto',
  subject: {
    any: 'Qualquer usuário',
    user: 'Usuário específico',
    group: 'Grupo de usuários específico'
  },
  action: "Ação",
  allow: 'Permitir',
  deny: 'Negar',
  matchesConditions: 'Corresponde às condições...',
  updateCondition: 'Atualizar condição',
  notAllow: 'Não permitir',
  policy: {
    update: 'Atualizar política',
    delete: 'Excluir política'
  },
  updateRLS: 'Atualizar Segurança de Nível de Registro'
}

const events = {
  record: {
    created: 'Registro Criado',
    updated: 'Registro Atualizado',
    deleted: 'Registro Excluído'
  }
}

const template = {
  template: 'Modelo',
  useThisTemplate: 'Usar este modelo',
  previewTemplate: 'Visualizar modelo',
  getStarted: 'Começar com este modelo',
  whichSpace: 'Em qual espaço?',
  whichSpaceDescription: "Você pode criar uma nova base ou uma nova tabela em um espaço selecionado.",
  createBase: 'Criar Nova Base',
  selectATemplateToCreateABase: 'Selecione um modelo para criar uma nova base',
  includeDataDescription: 'Incluir dados do modelo na nova base ou tabela.',
  loginToCreateNewBaseOrTable: 'Faça login para criar uma nova base ou tabela'
}

const auth = {
  login: 'Entrar',
  loginFailed: 'Falha no login',
  gotoSpace: 'Ir para o espaço',
  forgotPassword: 'Esqueceu sua senha?',
  emailPlaceholder: 'Digite seu email para entrar',
  password: 'Senha',
  register: 'Registrar',
  noAccount: 'Não tem uma conta?',
  registerDisabled: 'Registro desativado.',
  registerDisabledDescription: 'Entre em contato com seu administrador para solicitar acesso.',
  loginWith: 'Entrar com {provider}',
  loginWithEmailDescription: 'Digite seu email e senha para entrar.',
  invalidEmailOrPassword: 'Email ou senha inválidos.',
  loginToYourAccountAndAcceptTheInvitation: 'Entre em sua conta e aceite o convite',
  enterYourEmailBelowToResetYourPassword: 'Digite seu email abaixo para redefinir sua senha.',
  emailSent: 'Email enviado!',
  youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: 'Você pode verificar seu email e seguir os passos para redefinir sua senha.',
  registerFailed: 'Falha no registro',
  passwordDoesNotMatch: 'As senhas não coincidem',
  enterYourDisplayUsername: 'Digite seu nome de exibição',
  username: 'Nome de usuário',
  invited: 'Convidados',
  confirmPassword: 'Confirmar senha',
  createAnAccount: 'Criar uma conta',
  alreadyHaveAnAccount: 'Já tem uma conta?',
  signIn: 'Entrar',
  createAccountAndAcceptInvitation: 'Criar conta e aceitar convite',
  enterYourInformationToCreateAnAccount: 'Digite suas informações para criar uma conta.',
  enterYourWorkEmail: 'Digite seu email de trabalho...',
  sendOtpCode: 'Enviar código',
  verifyOtp: 'Verificar código'
}

const playground = {
  playgroundMode: 'Modo de teste',
  playgroundModeDescription: 'Você está no modo de teste, todos os seus dados serão perdidos após você fechar ou atualizar a página.'
}

const pt = {
  playground,
  auth,
  template,
  setting,
  base,
  space,
  account,
  roles,
  webhook,
  table: {
    authz,
    ops,
    fieldTypes,
    rollupFns,
    aggregateFns,
    macros,
    viewTypes,
    widgetTypes,
    timeScales,
    record,
    form,
    common,
    field,
    view,
    aggregate,
    schema,
    events,
    import: {
      importFile: 'Importar arquivo...',
      firstRowAsHeader: 'Primeira linha como cabeçalho',
      importData: 'Importar dados',
      fieldsSelected: '{count} campos selecionados',
      configField: 'Configurar campo',
      nextStep: 'Próximo passo',
    },
  },
  common: {
    back: 'Voltar',
    error: 'Erro',
    duplicate: 'Duplicar',
    description: 'Descrição',
    cancel: 'Cancelar',
    create: 'Criar',
    select: 'Selecionar',
    event: 'Evento',
    creating: 'Criando',
    search: 'Pesquisar',
    confirm: 'Confirmar',
    update: 'Atualizar',
    continue: 'Continuar',
    submit: 'Enviar',
    delete: 'Excluir',
    settings: 'Configurações',
    save: 'Salvar',
    language: 'Idioma',
    data: 'Dados',
    auth: 'Autenticação',
    developer: 'Desenvolvedor',
    name: 'Nome',
    dangerZone: 'Zona de Perigo',
    remove: 'Remover',
    accountAndSpaceSettings: 'Configurações de Conta e Espaço',
    email: 'Email',
    role: 'Função',
    action: 'Ação',
    status: 'Status',
    required: 'Obrigatório',
    enabled: 'Habilitado',
    enableCondition: 'Habilitar Condição',
    type: 'Tipo',
    loadMore: 'Carregar mais',
    today: 'Hoje',
    clear: 'Limpar',
    updated: 'Atualizado',
    now: 'Agora',
    import: 'Importar'
  },
  share: {
    title: 'Compartilhar',
    shareUrl: 'URL de Compartilhamento',
    iframeUrl: 'URL do IFrame',
    shareId: 'ID de Compartilhamento',
    enable: 'Habilitar compartilhamento',
    copied: 'Copiado para a área de transferência',
    button: 'Compartilhar'
  },
  widget: {
    title: 'Widget',
    button: "Widgets",
    name: 'Nome',
    add: 'Adicionar Widget',
    type: 'Tipo',
    editName: 'Editar Nome',
    duplicate: 'Duplicar Widget {name}',
    delete: 'Excluir Widget {name}',
    deleteConfirm: {
      title: 'Excluir Widget {name}?',
      description: 'Esta ação não pode ser desfeita. Isso excluirá permanentemente este widget e removerá seus dados de nossos servidores.'
    },
    count: 'Contagem',
    aggregate: 'Agregação',
    filters: 'Filtros',
  },
  dashboard
} satisfies BaseTranslation

export default pt