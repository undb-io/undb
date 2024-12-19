const ops = {
  eq: "igual a",
  neq: "no igual a",
  contains: "contiene",
  does_not_contain: "no contiene",
  starts_with: "comienza con",
  ends_with: "termina con",
  is_empty: "está vacío",
  is_not_empty: "no está vacío",
  min: "mínimo",
  max: "máximo",
  gt: "mayor que",
  gte: "mayor o igual que",
  lt: "menor que",
  lte: "menor o igual que",
  in: "está en lista",
  nin: "no está en lista",
  any_of: "cualquiera de",
  not_any_of: "ninguno de",
  is_same_day: "es el mismo día",
  is_not_same_day: "no es el mismo día",
  is_tody: "hoy",
  is_not_today: "no es hoy",
  is_after_today: "después de hoy",
  is_before_today: "antes de hoy",
  is_tomorrow: "mañana",
  is_not_tomorrow: "no es mañana",
  is_after_tomorrow: "después de mañana",
  is_before_tommorow: "antes de mañana",
  is_yesterday: "ayer",
  is_not_yesterday: "no es ayer",
  is_after_yesterday: "después de ayer",
  is_before_yesterday: "antes de ayer",
  is_before: "antes",
  is_not_before: "no es antes",
  is_after: "después",
  is_not_after: "no es después",
  is_true: "verdadero",
  is_false: "falso"
}

const fieldTypes = {
  string: "texto",
  longText: "texto largo",
  number: "número",
  date: "fecha",
  dateRange: "rango de fecha",
  id: "ID",
  createdAt: "fecha de creación",
  autoIncrement: "incremento automático",
  updatedAt: "fecha de actualización",
  createdBy: "creador",
  updatedBy: "actualizador",
  reference: "referencia",
  rollup: "rollup",
  select: "seleccionar",
  rating: "calificación",
  email: "correo electrónico",
  url: "URL",
  attachment: "archivo adjunto",
  json: "JSON",
  checkbox: "casilla de verificación",
  user: "usuario",
  currency: "moneda",
  duration: "duración",
  button: "botón",
  percentage: "porcentaje",
  formula: "fórmula"
}

const rollupFns = {
  min: "mínimo",
  max: "máximo",
  sum: "suma",
  average: "promedio",
  count: "conteo",
  lookup: "consulta"
}

const aggregateFns = {
  min: "mínimo",
  max: "máximo",
  sum: "suma",
  count: "conteo",
  count_empty: "conteo de valores vacíos",
  count_uniq: "conteo de valores únicos",
  count_not_empty: "conteo de valores no vacíos",
  percent_empty: "porcentaje de valores vacíos",
  percent_not_empty: "porcentaje de valores no vacíos",
  percent_uniq: "porcentaje de valores únicos",
  avg: "promedio",
  count_true: "conteo de valores verdaderos",
  count_false: "conteo de valores falsos",
  percent_true: "porcentaje de valores verdaderos",
  percent_false: "porcentaje de valores falsos",
  start_max: "máximo de fecha de inicio",
  end_max: "máximo de fecha de finalización",
  start_min: "mínimo de fecha de inicio",
  end_min: "mínimo de fecha de finalización"
}


const macros = {
  "@me": "usuario actual",
  "@now": "ahora",
  "@today": "hoy",
  "@yesterday": "ayer",
  "@tomorrow": "mañana"
}

const viewTypes = {
  grid: "cuadrícula",
  kanban: "kanban",
  gallery: "galería",
  list: "lista",
  calendar: "calendario",
  pivot: "pivote"
}

const widgetTypes = {
  aggregate: "agregado",
  chart: "gráfico",
  table: "tabla"
}

const timeScales = {
  month: "mes",
  week: "semana",
  day: "día"
}

const record = {
  label: 'registro',
  labels: 'registros',
	search: 'búsqueda de registro...',
  openMenu: 'abrir menú',
  create: 'crear registro',
  update: 'actualizar registro',
  delete: 'eliminar registro',
  bulkDuplicated: '¡Registros duplicados!',
  viewRecordDetail: 'ver detalle del registro',
  copyRecordId: 'copiar ID de registro',
  createByForm: 'crear por formulario',
  includeData: 'incluir datos',
  duplicateRecord: 'duplicar registro',
  detail: 'detalle del registro',
  duplicate: 'duplicar {n|número} registros',
  updateRecords: 'actualizar {n|número} registros',
  bulkUpdateRecords: 'actualizar en masa {n|número} registros',
  deleteRecords: 'eliminar {n|número} registros',
  confirmDeleteRecord: '¿Desea eliminar el registro?',
  confirmDeleteRecordDescription: 'Esta operación no se puede cancelar. Esta operación eliminará permanentemente el registro y eliminará los datos del servidor.',
  confirmDeleteRecords: '¿Desea eliminar {n|número} registros?',
  confirmDeleteRecordsDescription: 'Esta operación no se puede cancelar. Esta operación eliminará permanentemente los registros y eliminará los datos del servidor.',
  confirmDuplicateRecords: '¿Duplicar {n|número} registros?',
  confirmDuplicateRecordsDescription: 'Esta operación duplicará {n|número} registros y copiará los datos del servidor.',
  confirmDuplicateRecord: '¿Duplicar registro?',
  confirmDuplicateRecordDescription: 'Creará un nuevo registro con un nuevo ID.',
  failedToDuplicateRecord: 'fallo al duplicar registro',
  failedToDeleteRecord: 'fallo al eliminar registro',
  copiedRecordId: 'Copió el ID del registro al portapapeles',
  createdRecord: '¡Registro creado!',
  bulkUpdate: {
    title: 'Actualizar registros?',
    description: 'Los campos seleccionados se actualizarán',
    updateWithCondition: 'Usar condición para actualizar',
    addField: 'Agregar campo de actualización',
    selectColumns: 'Seleccionar columnas para actualizar',
    updated: 'Actualizado',
    selectAll: 'Seleccionar todo',
    removeAll: 'Deseleccionar todo',
    continue: 'Continuar',
    noRecordsUpdated: 'No hay registros actualizados',
    recordsUpdated: '{count} registros actualizados correctamente',
    button: 'Actualizar en masa',
    noFilterAlert: 'No hay filtro, se actualizarán todos los registros, por favor, ten cuidado!'
  },
  reference: {
    link: 'enlace de registro',
    linked: '{n|número} registros vinculados'
  },
  button: {
    confirmToUpdate: 'Confirmar actualización',
    confirmToUpdateDescription: 'Campo que se actualizará cuando se haga clic en el botón',
  },
  noRecord: 'No hay registros',
  showHiddenFields: 'Mostrar {n|número} campos ocultos',
  hideHiddenFields: 'Ocultar {n|número} campos ocultos'
}

const form = {
  label: 'formulario',
  create: 'crear formulario',
  noForms: '{tableName} no hay formularios',
  noFormsDescription: 'Puede recoger datos del formulario.',
  addDescription: 'Agregar descripción',
  condition: 'condición',
  invalidCondition: 'Condición inválida',
  setDefaultValue: 'Establecer valor predeterminado de {field}',
  formField: 'Campo de formulario',
  fieldsSelected: '{n} campos seleccionados',
  searchFormField: 'Buscar campo de formulario...',
  selectAllFields: 'Seleccionar todos los campos',
  hideFields: 'Ocultar campos',
  showFields: 'Mostrar campos',
  noFieldsFound: 'No se encontró el campo con el título `{q}`',
  formSetting: 'Configuración del formulario',
  duplicateForm: 'Duplicar formulario',
  deleteForm: 'Eliminar formulario',
  duplicateSuccess: 'Duplicar formulario exitoso',
  backgroundColor: 'Color de fondo',
  autoAddNewField: 'Agregar automáticamente al formulario',
  autoAddNewFieldDescription: 'Se mostrará automáticamente al crear el formulario.',
  deleteFormConfirm: 'Eliminar formulario: {name}?',
  deleteFormDescription: 'El formulario se eliminará permanentemente.',
  duplicateFormDialog: 'Duplicar formulario: {name}?',
  duplicateFormDialogDescription: 'El formulario se duplicará.',
  setName: 'Establecer nombre del formulario',
  enableCondition: 'Habilitar condición'
}

const common = {
  tables: 'tablas',
  table: 'tabla',
  filters: 'filtros',
  color: 'color',
  select: 'Seleccionar tabla...',
  search: 'Buscar tabla...',
  noTablesFound: 'No hay tablas',
  sorts: {
    sort: 'ordenar',
    add: 'Agregar ordenación',
    empty: 'Ordenación vacía',
    direction: {
      asc: 'ascendente',
      desc: 'descendente'
    }
  },
  fields: 'campos',
  filter: {
    empty: 'No hay condiciones de filtro'
	},
  condition: {
    add: 'Agregar condición',
    addGroup: 'Agregar grupo de condiciones'
  },
  submit: 'Enviar',
  where: 'donde',
  searchOp: 'Buscar operación...',
  colorEmpty: 'Color vacío',
  updateName: 'Actualizar nombre de la tabla',
  duplicateTable: 'Duplicar tabla',
  deleteTable: 'Eliminar tabla',
  create: 'Crear tabla',
  import: 'Importar tabla'
}

  const field = {
    typeChanged: 'Ha cambiado el tipo de campo, los datos se convertirán al nuevo tipo cuando sea posible, pero pueden ser eliminados',
    field: 'campo',
    fields: 'lista de campos',
    create: 'crear campo',
		created: '¡Campo creado!',
    update: 'actualizar campo',
    updated: '¡Campo actualizado!',
    delete: 'eliminar campo',
    deleted: '¡Campo eliminado!',
    deleteConfirm: '¿Desea eliminar el campo?',
    deleteFailed: 'fallo al eliminar campo',
    duplicate: 'duplicar campo',
    duplicateDescription: '¿Desea duplicar el siguiente campo?',
    hidden: '{n|número} campos ocultos',
    searchTableFields: 'Buscar campos de la tabla {table}...',
    selectField: 'Seleccionar campo...',
		empty: 'No hay campos',
		min: 'Valor mínimo',
		max: 'Valor máximo',
		searchType: 'Buscar tipo de campo...',
		defaultValue: {
			label: 'Valor predeterminado',
			placeholder: 'Valor predeterminado...',
			invalid: 'Valor predeterminado inválido',
			invalidDescription: 'El valor predeterminado es inválido. No se guardará el valor predeterminado.',
			markAsRequired: 'Marcar como campo obligatorio.'
		},
		display: {
			label: 'Mostrar campo',
			markAsDisplay: 'Marcar el campo como campo de visualización.'
		},
		id: {
			placeholder: 'Generado automáticamente...'
		},
		string: {
			min: 'Longitud mínima',
			max: 'Longitud máxima'
		},
		longText: {
			allowRichText: 'Permitir texto enriquecido válido.'
		},
    duration: {
      min: "Valor mínimo",
      max: "Valor máximo",
      minPlaceholder: "Valor mínimo...",
      maxPlaceholder: "Valor máximo..."
    },
		number: {
			min: 'Valor mínimo',
			max: 'Valor máximo',
			minPlaceholder: 'Valor mínimo...',
			maxPlaceholder: 'Valor máximo...'
		},
		currency: {
			symbol: 'Símbolo',
			min: 'Valor mínimo',
			max: 'Valor máximo',
			minPlaceholder: 'Valor mínimo...',
			maxPlaceholder: 'Valor máximo...'
		},
    percentage: {
      min: 'Valor mínimo',
      max: 'Valor máximo',
      minPlaceholder: 'Valor mínimo...',
      maxPlaceholder: 'Valor máximo...'
    },
    date: {
      format: 'Formato de fecha',
      includeTime: 'Incluir tiempo',
      timeFormat: 'Formato de tiempo',
			selectMacro: 'Seleccionar macro...'
    },
    dateRange: {
      format: 'Formato de fecha',
      includeTime: 'Incluir tiempo',
      timeFormat: 'Formato de tiempo'
    },
    formula: {
      label: 'Fórmula',
      placeholder: 'Fórmula...',
      syntax: 'Sintaxis',
      examples: 'Ejemplos'
    },
    select: {
      option: {
        label: 'Opción',
        add: 'Agregar opción',
        selectDefault: 'Seleccionar opción predeterminada...',
        search: 'Buscar opción...',
        noOptionFound: 'No hay opciones',
        update: 'Actualizar opción',
        delete: 'Eliminar opción',
        createRecord: 'Crear registro en la opción seleccionada',
				create: 'Crear opción'
      },
      allowAddMultiple: 'Permitir agregar múltiples opciones',
      changeFromMultipleToSingle: 'Cambiar de múltiples opciones a una sola opción!',
      changeFromMultipleToSingleDescription: 'Solo se mantendrá la primera opción.',
      min: 'Número mínimo de elementos',
      max: 'Número máximo de elementos',
      minPlaceholder: 'Número mínimo de elementos...',
      maxPlaceholder: 'Número máximo de elementos...'
    },
    attachment: {
      min: 'Número mínimo de elementos',
      max: 'Número máximo de elementos',
      minPlaceholder: 'Número mínimo de elementos...',
      maxPlaceholder: 'Número máximo de elementos...'
    },
    user: {
      allowAddMultiple: 'Permitir agregar múltiples usuarios',
      changeFromMultipleToSingle: 'Cambiar de múltiples opciones a una sola opción!',
      changeFromMultipleToSingleDescription: 'Solo se mantendrá la primera opción.',
      min: 'Número mínimo de elementos',
      max: 'Número máximo de elementos',
      minPlaceholder: 'Número mínimo de elementos...',
      maxPlaceholder: 'Número máximo de elementos...'
    },
    reference: {
      foreignTable: 'Tabla externa',
      createSymmetricField: 'Crear campo simétrico',
      limitRecordSelectionToCondition: 'Limitar la selección de registros a una condición.',
      min: 'Número mínimo de elementos',
      max: 'Número máximo de elementos',
      minPlaceholder: 'Número mínimo de elementos...',
      maxPlaceholder: 'Número máximo de elementos...'
    },
    rollup: {
      referenceField: 'Campo de referencia',
      selectReferenceField: 'Seleccionar campo de referencia...',
      foreignRollupField: 'Campo de agregado externo',
      aggregateFunction: 'Función de agregado'
    },
    button: {
      label: 'Etiqueta',
      disabledWhen: 'Condición para deshabilitar el botón',
      updateValueWhenClickButton: 'Actualizar valor cuando se haga clic en el botón',
      confirmBeforeUpdate: 'Confirmar antes de actualizar',
      addAnotherFieldToUpdate: 'Agregar otro campo de actualización',
      valueToUpdate: 'Valor para actualizar...'
    }
  }

const view = {
  field: {
    showAllFields: 'Mostrar todos los campos',
    hideAllFields: 'Ocultar todos los campos',
    showSystemFields: 'Mostrar campos del sistema',
    hideSystemFields: 'Ocultar campos del sistema'
  },
	widget: {
		title: 'Vista de widget',
		empty: 'No hay widgets',
		add: 'Agregar widget'
	},
  kanban: {
    kanban: 'Kanban',
    update: 'Actualizar vista de Kanban',
    view: 'Vista de Kanban',
    field: 'Campo de Kanban',
    groupBy: 'Agrupar por tipo de campo',
    noSelectField: 'No seleccionar campo de tipo',
    noOption: 'Sin opción',
    collapseLane: 'Colapsar'
  },
  gallery: {
    gallery: 'Galería',
    update: 'Actualizar vista de galería',
    view: 'Vista de galería',
    field: 'Campo de galería',
    groupBy: 'Agrupar por tipo de archivo',
    noAttachmentField: 'No hay campo de tipo de archivo'
  },
  calendar: {
    calendar: 'Calendario',
    update: 'Actualizar vista de calendario',
    view: 'Vista de calendario',
    field: 'Campo de calendario',
    groupBy: 'Agrupar por campo de fecha',
    select: 'Seleccionar tipo de campo para agrupar el calendario',
    selectField: 'Seleccionar campo de calendario',
    noDateField: 'No hay campo de fecha',
    scope: {
      selectedDate: 'Fecha seleccionada',
      withoutDate: 'Sin fecha',
      thisMonth: 'Este mes',
      allRecords: 'Todos los registros',
      thisWeek: 'Esta semana',
    }
  },
  pivot: {
    pivot: 'Pivote',
    update: 'Actualizar vista de pivote',
    view: 'Vista de pivote',
    columnLabel: 'Etiqueta de columna',
    rowLabel: 'Etiqueta de fila',
    swap: 'Intercambiar etiqueta de columna y fila',
    aggregate: 'Agregado',
    aggregateFn: {
      sum: 'Suma',
      count: 'Conteo',
      average: 'Promedio',
      max: 'Valor máximo',
      min: 'Valor mínimo'
    },
    value: 'Valor',
    selectField: 'Seleccionar campo para agregado de datos del pivote...'
  },
  type: 'Tipo de vista',
  create: 'Crear vista',
  created: 'Vista creada correctamente',
  updateName: 'Actualizar nombre de la vista',
  updated: 'Vista actualizada',
  duplicateView: 'Duplicar vista',
  deleteView: 'Eliminar vista',
  downloadView: 'Descargar vista',
  downloadAsExcel: 'Descargar como Excel',
  downloadAsCSV: 'Descargar como CSV',
  downloadAsJSON: 'Descargar como JSON',
  setAsDefaultView: 'Establecer como vista predeterminada',
}

const aggregate = {
  searchType: 'Buscar tipo de agregado...',
  selectField: 'Seleccionar campo para agregado...'
}

const dashboard = {
  dashboards: 'Paneles de control',
  create: 'Crear panel de control',
  nameDescription: 'Nombre de visualización pública del panel de control.',
  updateName: 'Actualizar nombre del panel de control',
  duplicateDashboard: 'Duplicar panel de control',
  deleteDashboard: 'Eliminar panel de control',
  confirmDeleteDashboard: '¿Desea eliminar el panel de control?',
  confirmDeleteDashboardDescription: 'Esta operación no se puede cancelar. Esta operación eliminará permanentemente el panel de control y eliminará los datos del servidor.',
  duplicateDashboardDescription: '¿Desea duplicar el panel de control?',
  duplicateDashboardConfirm: 'Duplicar panel de control',
  updateDashboard: 'Actualizar panel de control',
}

const base = {
  name: 'Nombre de Base',
  noBases: 'No hay bases',
  created: 'Base creada correctamente',
  displayName: 'Nombre de visualización de Base',
  importFromTemplate: 'Importar desde plantilla',
  createBase: 'Crear Base',
  baseSettings: 'Configuración de Base',
  updateBase: 'Actualizar Base',
  deleteBase: 'Eliminar Base',
  updateBaseName: 'Actualizar nombre de Base',
  deleteBaseConfirm: '¿Desea eliminar Base?',
  duplicateBase: 'Duplicar Base {name}',
  includeData: 'Incluir datos',
  nameDescription: 'Nombre de visualización de Base.',
  includeDataDescription: 'Incluir datos en la nueva Base.',
  duplicateBaseDescription: 'Crear una nueva Base y incluir todos los registros de la Base.',
  systemFieldsUpdated: 'Los campos del sistema se actualizarán con la fecha y hora del usuario actual.'
}

const space = {
  space: 'Espacio',
  spaces: 'Espacios',
  name: 'Nombre del espacio',
  setDisplayName: 'Establecer nombre de visualización',
  searchMembers: 'Buscar miembros...',
  cannotInviteMemberToPersonalSpace: 'No se puede invitar a miembros a un espacio personal.',
  createSpace: 'Crear espacio',
  createSpaceDescription: 'Crear un nuevo espacio y organizar datos y colaborar con otros miembros del equipo.',
  spaceName: 'Nombre del espacio',
  spaceNameDescription: 'Nombre de visualización del espacio.',
  personalSpace: 'No se puede eliminar un espacio personal.',
  deleteSpace: 'Eliminar espacio',
  deleteSpaceConfirm: '¿Desea eliminar el espacio?',
  deleteSpaceDescription: 'Esta operación no se puede cancelar. Esta operación eliminará permanentemente el estado de la base de datos y eliminará los datos del servidor.',
  memberList: 'Lista de miembros del área de trabajo',
  inviteMember: 'Invitar miembro',
  invitations: 'Invitaciones',
  invite: 'Invitar',
  pendingInvitations: 'Lista de invitaciones pendientes',
  invitedAt: 'Invitado en',
  deleteInvitation: 'Eliminar invitación'
}

const schema = {
  label: 'Estructura de campo',
  systemFields: 'Campos del sistema',
  required: 'Requerido',
  display: 'Mostrar',
  fieldName: 'Nombre del campo',
  addField: 'Agregar campo'
}

const account = {
  logout: 'Cerrar sesión',
  accountSettings: 'Configuración de cuenta',
  apiToken: 'Token de API',
  undbTemplates: 'Plantillas de Undb',
  undbWebsite: 'Sitio web de Undb'
}

const setting = {
  setting: 'Configuración',
  members: 'Miembros',
  settingAndMembers: 'Configuración y miembros'
}

const roles = {
  owner: 'Propietario',
  admin: 'Administrador',
  member: 'Miembro',
  viewer: 'Visor'
}

const webhook = {
  label: 'Webhook',
  create: 'Crear Webhook',
  delete: 'Eliminar Webhook',
  update: 'Actualizar Webhook',
	duplicate: 'Duplicar Webhook',
  noWebhooks: '{table} no hay Webhooks',
  noWebhooksDescription: 'Haga clic en el botón para crear el primer Webhook'
}

const authz = {
  noRecordLevelSecurity: '{table} no hay permisos de nivel de registro',
  noRecordLevelSecurityDescription: 'Haga clic en el botón para crear la estrategia de permisos de nivel de registro',
  create: 'Crear permisos de nivel de registro',
  created: 'Permisos de nivel de registro creados',
  failed: 'Error al crear permisos de nivel de registro',
  rlsName: 'Nombre de permisos de nivel de registro',
  giveYourRLSName: 'Déjame tu nombre de permisos de nivel de registro',
  actions: {
    read: 'Leer',
    create: 'Crear',
    update: 'Actualizar',
    delete: 'Eliminar'
  },
  subjectName: 'Sujeto',
  subject: {
    any: 'Todos los usuarios',
    user: 'Usuario especificado',
    group: 'Grupo de usuario especificado'
  },
  action: 'Acción',
  allow: 'Permitir',
  deny: 'Denegar',
  matchesConditions: 'Condiciones coincidentes...',
  updateCondition: 'Actualizar condición',
  notAllow: 'No permitir',
  updateRLS: 'Actualizar permisos de nivel de registro',
  policy: {
    update: 'Estrategia de actualización',
    delete: 'Estrategia de eliminación'
  }
}

const events = {
  record: {
    created: 'Registro creado',
    updated: 'Registro actualizado',
    deleted: 'Registro eliminado'
  }
}

const template = {
  template: 'Plantilla',
  useThisTemplate: 'Usar esta plantilla',
  previewTemplate: 'Vista previa de plantilla',
  getStarted: 'Comenzar con esta plantilla',
  whichSpace: "¿Qué espacio quieres crear esta plantilla en?",
  whichSpaceDescription: "Puedes crear una nueva Base o una nueva tabla en el espacio seleccionado.",
  createBase: 'Crear Base',
  selectATemplateToCreateABase: 'Selecciona una plantilla para crear una Base',
  includeDataDescription: 'Incluir datos de la plantilla en la nueva Base o tabla.',
  loginToCreateNewBaseOrTable: 'Iniciar sesión para crear una nueva Base o tabla'
}

const auth = {
  login: 'Iniciar sesión',
  loginFailed: 'Inicio de sesión fallido',
  forgotPassword: '¿Olvidaste tu contraseña?',
  gotoSpace: 'Ir al espacio',
  emailPlaceholder: 'Introduce tu correo electrónico para iniciar sesión...',
  password: 'Contraseña',
  register: 'Registrarse',
  noAccount: '¿No tienes una cuenta?',
  loginWithEmailDescription: 'Introduce tu correo electrónico y contraseña para iniciar sesión.',
  registerDisabled: 'El registro está deshabilitado.',
  registerDisabledDescription: 'Póngase en contacto con su administrador para solicitar acceso.',
  loginWith: 'Iniciar sesión con {provider}',
  invalidEmailOrPassword: 'Correo electrónico o contraseña inválidos.',
  loginToYourAccountAndAcceptTheInvitation: 'Iniciar sesión en su cuenta y aceptar la invitación',
  enterYourEmailBelowToResetYourPassword: 'Introduce tu correo electrónico a continuación para restablecer tu contraseña.',
  emailSent: '¡Correo electrónico enviado!',
  youCanCheckYourEmailAddressAndFollowTheStepsToResetYourPassword: 'Puedes comprobar tu correo electrónico y seguir los pasos para restablecer tu contraseña.',
  registerFailed: 'Registro fallido',
  passwordDoesNotMatch: 'Contraseña no coincide',
  enterYourDisplayUsername: 'Introduce tu nombre de usuario para mostrar',
  username: 'Nombre de usuario',
  invited: 'Invitado',
  confirmPassword: 'Confirmar contraseña',
  createAnAccount: 'Crear una cuenta',
  alreadyHaveAnAccount: '¿Ya tienes una cuenta?',
  enterYourWorkEmail: 'Introduce tu correo electrónico de trabajo...',
  sendOtpCode: 'Enviar código',
  verifyOtp: 'Verificar código'
}

const playground = {
  playgroundMode: 'Modo de prueba',
  playgroundModeDescription: 'Estás en modo de prueba, todos los cambios se perderán después de cerrar o refrescar la página.'
}

const es = {
  playground,
  auth,
  template,
  roles,
  setting,
  base,
  space,
  account,
  table: {
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
  authz,
  events,
    import: {
      importFile: 'Importar archivo...',
      firstRowAsHeader: 'Primera fila como encabezado',
      importData: 'Importar datos',
      fieldsSelected: '{count} campos seleccionados',
      configField: 'Configurar campo',
      nextStep: 'Siguiente paso',
    },
  },
  webhook,
	common: {
    back: 'Atrás',
    error: 'Error',
		continue: 'Continuar',
    description: 'Descripción',
		cancel: 'Cancelar',
		create: 'Crear',
    search: 'Buscar',
		creating: 'Creando',
		confirm: 'Confirmar',
		update: 'Actualizar',
    select: 'Seleccionar',
    event: 'Evento',
		submit: 'Enviar',
		duplicate: 'Duplicar',
		delete: 'Eliminar',
		settings: 'Configuración',
		save: 'Guardar',
		language: 'Idioma',
		data: 'Datos',
    auth: 'Permisos',
    developer: 'Desarrollador',
    name: 'Nombre',
    dangerZone: 'Zona de peligro',
    remove: 'Eliminar',
    accountAndSpaceSettings: 'Configuración de cuenta y espacio',
    email: 'Correo electrónico',
    role: 'Rol',
    action: 'Acción',
    status: 'Estado',
    required: 'Requerido',
    enabled: 'Habilitado',
    enableCondition: 'Condición de habilitación',
    type: 'Tipo',
    loadMore: 'Cargar más',
    today: 'Hoy',
    clear: 'Limpiar',
    updated: 'Actualizado',
    now: 'Ahora',
    import: 'Importar'
	},
 share: {
	title: 'Compartir',
	shareUrl: 'Enlace de compartido',
	iframeUrl: 'Enlace de inserción',
	shareId: 'ID de compartido',
	enable: 'Habilitar compartido',
	copied: 'Copiado al portapapeles',
	button: 'Compartir'
},
widget: {
  title: 'Widget',
  button: "Widget",
	name: 'Nombre',
	add: 'Agregar widget',
	editName: 'Editar nombre',
	duplicate: 'Duplicar widget {name}',
	delete: 'Eliminar widget {name}',
	deleteConfirm: {
		title: '¿Eliminar widget {name}?',
		description: 'Esta operación no se puede cancelar. Esta operación eliminará permanentemente este widget y eliminará los datos del servidor.'
	},
	count: 'Cantidad',
	aggregate: 'Agregado',
	filters: 'Filtros',
},
dashboard

} satisfies BaseTranslation

export default es