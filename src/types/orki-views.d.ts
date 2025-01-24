declare namespace OrkiSchemaTypes {

    type OrkiFileType = {
        uuid: string;
        list: OrkiFileTypeList[]
    }

    type OrkiFileTypeList = {
        key: string;
        link: string;
        originalname: string;
        bucketId: string;
        isPublic: boolean;
    }

    type OrkiStringI18N = Array<{
    translate: {
        lang: string;
        value: string;
    }
    }> | string
}

/**
 * Module: Common
 */
declare namespace OrkiSchemaTypes.Common {
  /**
   * Module: Common
   *
   * CollectionName: `authentication`
   *
   * Modelo de autenticação
   */  
  type AuthenticationInput = {
      _id?: string;
      /**
      * Nome do usuário
      */
      name: string;
      /**
      * E-mail do usuário
      */
      email: string;
      /**
      * URL do avatar do usuário
      */
      gravatarURL?: string | null;
      /**
      * Data do último acesso
      */
      accessedAt?: Date | null;
      /**
      * Secret 2FA, se habilitado
      */
      secret2FA?: string | null;
      /**
      * Detalhes do usuário
      */
      detail?: object | null;
      /**
      * Token de reset de senha
      */
      resetPasswordToken?: string | null;
      /**
      * Data de expiração do token de reset de senha
      */
      resetPasswordTokenAt?: Date | null;
      /**
      * Token de confirmação de email
      */
      confirmationEmailToken?: string | null;
      /**
      * Data de expiração do token de confirmação de email
      */
      confirmationEmailTokenAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmfact`
   */  
  type LlmfactInput = {
      _id?: string;
      /**
      * Identificador do registro
      */
      identifier: string;
      /**
      * Data de incorporação do registro
      */
      embeddedAt?: Date | null;
      /**
      * Vetor de incorporação do registro
      */
      embedding?: object | null;
      /**
      * Fato
      */
      fact: string;
      /**
      * Ativo
      */
      isActive?: boolean | null;
      /**
      * Hash do fato
      */
      factHash?: string | null;
      /**
      * Prompt do fato
      */
      prompt: string;
      /**
      * Detalhes do fato
      */
      detail?: object | null;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `audit`
   *
   * This model is used to store the audit logs of the application.
The audit logs are generated when a record is created, updated or deleted.
The audit logs are stored in the audit collection in the database

   */  
  type AuditInput = {
      _id?: string;
      /**
      * The user who performed the action.
      */
      author?: string | null;
      /**
      * The name of the model that was affected.
      */
      model_name: string;
      /**
      * The name of the module where the action occurred.
      */
      module_name: string;
      /**
      * The name of the API endpoint that was called.
      */
      api_name: string;
      /**
      * The changes made to the document.
      */
      difference: object;
      /**
      * The type of action performed (created, updated, removed).
      */
      action: "created" | "updated" | "removed";
      /**
      * The ID of the document that was affected.
      */
      docId: string;
      /**
      * The headers of the request that triggered the action.
      */
      headers: object;
      /**
      * The date and time when the audit log was created.
      */
      createdAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmprompttemplate`
   */  
  type LlmprompttemplateInput = {
      _id?: string;
      /**
      * Nome do template
      */
      name: string;
      /**
      * Descrição do template
      */
      description?: string | null;
      /**
      * Prompt do template
      */
      prompt: string;
      /**
      * Ativo
      */
      isActive?: boolean | null;
      /**
      * Bot
      */
      llmbot: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `code`
   */  
  type CodeInput = {
      _id?: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Nome do script
      */
      name: string;
      /**
      * Descrição do script
      */
      description?: string | null;
      /**
      * Caminho do script
      */
      path?: string | null;
      /**
      * Autenticação HTTP
      */
      isHTTPAuthentication?: boolean | null;
      /**
      * Autorização HTTP
      */
      isHTTPAuthorization?: boolean | null;
      /**
      * Versão do engine
      */
      engineVersion: "v1" | "v2" | "v3";
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmbot`
   */  
  type LlmbotInput = {
      _id?: string;
      /**
      * Nome do bot
      */
      name: string;
      /**
      * Descrição do bot
      */
      description?: string | null;
      /**
      * Identificador do bot
      */
      identifier: string;
      /**
      * Prompt Fact
      */
      promptFact?: string | null;
      /**
      * Ativo
      */
      isActive?: boolean | null;
      /**
      * Parameters bot
      */
      parameters?: object | null;
      /**
      * Parameters bot
      */
      authentication?: string | null;
      /**
      * Scripts bot
      */
      scripts?: Array<string>;
      /**
      * Runtimes bot
      */
      runtimes?: string | null;
      /**
      * Experts bot
      */
      experts?: Array<string>;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `menu`
   */  
  type MenuInput = {
      _id?: string;
      name: string;
      path: string;
      icon: string;
      folder?: string | null;
      isVisible?: boolean | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `menurole`
   */  
  type MenuroleInput = {
      _id?: string;
      name: string;
      users: Array<string>;
      menus: Array<string>;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmconversation`
   */  
  type LlmconversationInput = {
      _id?: string;
      /**
      * Autenticação
      */
      authentication?: string | null;
      /**
      * Bot
      */
      llmbot: string;
      /**
      * Identificador do bot
      */
      identifier: string;
      /**
      * Ativo
      */
      isActive?: boolean | null;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmconversationmessage`
   */  
  type LlmconversationmessageInput = {
      _id?: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Autenticação
      */
      conversation?: string | null;
      /**
      * Name
      */
      name?: string | null;
      /**
      * Role
      */
      role: "user" | "assistant" | "system" | "function";
      /**
      * Content
      */
      content?: object | null;
      /**
      * Function call
      */
      function_call?: object | null;
      /**
      * Detail
      */
      detail?: object | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metaaccount`
   */  
  type MetaaccountInput = {
      _id?: string;
      name: string;
      phoneNumberId: string;
      metaAccessToken?: string | null;
      llmbotIdentifier?: string | null;
      bucketIdentifier?: string | null;
      isActive?: boolean | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metacontact`
   */  
  type MetacontactInput = {
      _id?: string;
      /**
      * Authentication
      */
      authentication?: string | null;
      name: string;
      phoneNumber: string;
      /**
      * Meta Account
      */
      metaAccount?: string | null;
      /**
      * Mention
      */
      lastMessage?: string | null;
      llmbotIsMute?: boolean | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metamessage`
   */  
  type MetamessageInput = {
      _id?: string;
      identifier: string;
      /**
      * Meta Account
      */
      metaAccount?: string | null;
      /**
      * Mention
      */
      mention?: string | null;
      data?: object | null;
      files?: OrkiSchemaTypes.OrkiFileType | null;
      detail?: object | null;
      /**
      * Meta Contact
      */
      metaContact?: string | null;
      reaction?: string | null;
      type?: "text" | "image" | "document" | "reaction" | "interactive" | "audio" | null;
      side?: "sent" | "received" | null;
      sentAt?: Date | null;
      deliveredAt?: Date | null;
      readAt?: Date | null;
      failedAt?: Date | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `runtimemodule`
   */  
  type RuntimemoduleInput = {
      _id?: string;
      name: string;
      qualifiedName: string;
      description?: string | null;
      version: string;
      revision?: number | null;
      hashInstall?: string | null;
      configs?: object | null;
      bundle?: OrkiSchemaTypes.OrkiFileType | null;
      decorators?: object | null;
      engineVersion: string;
      publishedAt?: Date | null;
      errorDetail?: object | null;
      createdBy?: string | null;
      createdAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `trash`
   */  
  type TrashInput = {
      _id?: string;
      /**
      * Model name
      */
      model?: string | null;
      schemaName?: string | null;
      doc?: object | null;
      createdAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmmemory`
   */  
  type LlmmemoryInput = {
      _id?: string;
      /**
      * Parameters bot
      */
      authentication?: string | null;
      /**
      * Bot
      */
      llmbot: string;
      /**
      * Nome do template
      */
      memory: string;
      expirationAt?: Date | null;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llminstructiontemplate`
   */  
  type LlminstructiontemplateInput = {
      _id?: string;
      /**
      * Bot
      */
      llmbot: string;
      /**
      * Referência para recuperar
      */
      ref: string;
      /**
      * Instrução do agent
      */
      instruction: string;
      /**
      * Ordem de execução
      */
      order: number;
      /**
      * Ativo
      */
      isActive?: boolean | null;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }
  /**
   * Module: Common
   *
   * CollectionName: `crudmodel`
   */  
  type CrudmodelInput = {
      _id?: string;
      /**
      * Model name
      */
      name: string;
      /**
      * Module responsible for the model
      */
      runtimeModuleName?: string | null;
      /**
      * Description of the model
      */
      description?: string | null;
      /**
      * Indicates whether the model is a view
      */
      isView?: boolean | null;
      /**
      * Pipeline to be executed when the model is a view (JSON)
      */
      viewPipeline?: string | null;
      /**
      * Model to be used as a view
      */
      viewOn?: string | null;
      /**
      * Fields of the model
      */
      fields?: object | null;
      /**
      * Indexes of the model
      */
      indexes?: object | null;
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
  }

  /**
   * Module: Common
   *
   * CollectionName: `authentication`
   *
   * Collection: authentication
   *
   * Modelo de autenticação
   */
  type Authentication = {
      _id: string;
      /**
      * Nome do usuário
      */
      name: string;
      /**
      * E-mail do usuário
      */
      email: string;
      /**
      * URL do avatar do usuário
      */
      gravatarURL?: string;
      /**
      * Data do último acesso
      */
      accessedAt?: Date;
      /**
      * Secret 2FA, se habilitado
      */
      secret2FA?: string;
      /**
      * Detalhes do usuário
      */
      detail?: object;
      /**
      * Token de reset de senha
      */
      resetPasswordToken?: string;
      /**
      * Data de expiração do token de reset de senha
      */
      resetPasswordTokenAt?: Date;
      /**
      * Token de confirmação de email
      */
      confirmationEmailToken?: string;
      /**
      * Data de expiração do token de confirmação de email
      */
      confirmationEmailTokenAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmfact`
   */
  type Llmfact = {
      _id: string;
      /**
      * Identificador do registro
      */
      identifier: string;
      /**
      * Data de incorporação do registro
      */
      embeddedAt?: Date;
      /**
      * Vetor de incorporação do registro
      */
      embedding?: object;
      /**
      * Fato
      */
      fact: string;
      /**
      * Ativo
      */
      isActive?: boolean;
      /**
      * Hash do fato
      */
      factHash?: string;
      /**
      * Prompt do fato
      */
      prompt: OrkiSchemaTypes.Common.Llmprompttemplate;
      /**
      * Detalhes do fato
      */
      detail?: object;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `audit`
   *
   * Collection: audit
   *
   * This model is used to store the audit logs of the application.
The audit logs are generated when a record is created, updated or deleted.
The audit logs are stored in the audit collection in the database

   */
  type Audit = {
      _id: string;
      /**
      * The user who performed the action.
      */
      author?: OrkiSchemaTypes.Common.Authentication;
      /**
      * The name of the model that was affected.
      */
      model_name: string;
      /**
      * The name of the module where the action occurred.
      */
      module_name: string;
      /**
      * The name of the API endpoint that was called.
      */
      api_name: string;
      /**
      * The changes made to the document.
      */
      difference: object;
      /**
      * The type of action performed (created, updated, removed).
      */
      action: "created" | "updated" | "removed";
      /**
      * The ID of the document that was affected.
      */
      docId: string;
      /**
      * The headers of the request that triggered the action.
      */
      headers: object;
      /**
      * The date and time when the audit log was created.
      */
      createdAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmprompttemplate`
   */
  type Llmprompttemplate = {
      _id: string;
      /**
      * Nome do template
      */
      name: string;
      /**
      * Descrição do template
      */
      description?: string;
      /**
      * Prompt do template
      */
      prompt: string;
      /**
      * Ativo
      */
      isActive?: boolean;
      /**
      * Bot
      */
      llmbot: OrkiSchemaTypes.Common.Llmbot;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `code`
   */
  type Code = {
      _id: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Nome do script
      */
      name: string;
      /**
      * Descrição do script
      */
      description?: string;
      /**
      * Caminho do script
      */
      path?: string;
      /**
      * Autenticação HTTP
      */
      isHTTPAuthentication?: boolean;
      /**
      * Autorização HTTP
      */
      isHTTPAuthorization?: boolean;
      /**
      * Versão do engine
      */
      engineVersion: "v1" | "v2" | "v3";
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmbot`
   */
  type Llmbot = {
      _id: string;
      /**
      * Nome do bot
      */
      name: string;
      /**
      * Descrição do bot
      */
      description?: string;
      /**
      * Identificador do bot
      */
      identifier: string;
      /**
      * Prompt Fact
      */
      promptFact?: string;
      /**
      * Ativo
      */
      isActive?: boolean;
      /**
      * Parameters bot
      */
      parameters?: object;
      /**
      * Parameters bot
      */
      authentication?: OrkiSchemaTypes.Common.Authentication;
      /**
      * Scripts bot
      */
      scripts?: Array<OrkiSchemaTypes.Common.Code>;
      /**
      * Runtimes bot
      */
      runtimes?: string;
      /**
      * Experts bot
      */
      experts?: Array<OrkiSchemaTypes.Common.Llmbot>;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `menu`
   */
  type Menu = {
      _id: string;
      name: string;
      path: string;
      icon: string;
      folder?: string;
      isVisible?: boolean;
  }
  /**
   * Module: Common
   *
   * CollectionName: `menurole`
   */
  type Menurole = {
      _id: string;
      name: string;
      users: Array<OrkiSchemaTypes.Common.Authentication>;
      menus: Array<OrkiSchemaTypes.Common.Menu>;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmconversation`
   */
  type Llmconversation = {
      _id: string;
      /**
      * Autenticação
      */
      authentication?: OrkiSchemaTypes.Common.Authentication;
      /**
      * Bot
      */
      llmbot: OrkiSchemaTypes.Common.Llmbot;
      /**
      * Identificador do bot
      */
      identifier: string;
      /**
      * Ativo
      */
      isActive?: boolean;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmconversationmessage`
   */
  type Llmconversationmessage = {
      _id: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Autenticação
      */
      conversation?: OrkiSchemaTypes.Common.Llmconversation;
      /**
      * Name
      */
      name?: string;
      /**
      * Role
      */
      role: "user" | "assistant" | "system" | "function";
      /**
      * Content
      */
      content?: object;
      /**
      * Function call
      */
      function_call?: object;
      /**
      * Detail
      */
      detail?: object;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metaaccount`
   */
  type Metaaccount = {
      _id: string;
      name: string;
      phoneNumberId: string;
      metaAccessToken?: string;
      llmbotIdentifier?: string;
      bucketIdentifier?: string;
      isActive?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metacontact`
   */
  type Metacontact = {
      _id: string;
      /**
      * Authentication
      */
      authentication?: OrkiSchemaTypes.Common.Authentication;
      name: string;
      phoneNumber: string;
      /**
      * Meta Account
      */
      metaAccount?: OrkiSchemaTypes.Common.Metaaccount;
      /**
      * Mention
      */
      lastMessage?: OrkiSchemaTypes.Common.Metamessage;
      llmbotIsMute?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `metamessage`
   */
  type Metamessage = {
      _id: string;
      identifier: string;
      /**
      * Meta Account
      */
      metaAccount?: OrkiSchemaTypes.Common.Metaaccount;
      /**
      * Mention
      */
      mention?: OrkiSchemaTypes.Common.Metamessage;
      data?: object;
      files?: OrkiSchemaTypes.OrkiFileType;
      detail?: object;
      /**
      * Meta Contact
      */
      metaContact?: OrkiSchemaTypes.Common.Metacontact;
      reaction?: string;
      type?: "text" | "image" | "document" | "reaction" | "interactive" | "audio";
      side?: "sent" | "received";
      sentAt?: Date;
      deliveredAt?: Date;
      readAt?: Date;
      failedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `runtimemodule`
   */
  type Runtimemodule = {
      _id: string;
      name: string;
      qualifiedName: string;
      description?: string;
      version: string;
      revision?: number;
      hashInstall?: string;
      configs?: object;
      bundle?: OrkiSchemaTypes.OrkiFileType;
      decorators?: object;
      engineVersion: string;
      publishedAt?: Date;
      errorDetail?: object;
      createdBy?: OrkiSchemaTypes.Common.Authentication;
      createdAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `trash`
   */
  type Trash = {
      _id: string;
      /**
      * Model name
      */
      model?: string;
      schemaName?: string;
      doc?: object;
      createdAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llmmemory`
   */
  type Llmmemory = {
      _id: string;
      /**
      * Parameters bot
      */
      authentication?: OrkiSchemaTypes.Common.Authentication;
      /**
      * Bot
      */
      llmbot: OrkiSchemaTypes.Common.Llmbot;
      /**
      * Nome do template
      */
      memory: string;
      expirationAt?: Date;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `llminstructiontemplate`
   */
  type Llminstructiontemplate = {
      _id: string;
      /**
      * Bot
      */
      llmbot: OrkiSchemaTypes.Common.Llmbot;
      /**
      * Referência para recuperar
      */
      ref: string;
      /**
      * Instrução do agent
      */
      instruction: string;
      /**
      * Ordem de execução
      */
      order: number;
      /**
      * Ativo
      */
      isActive?: boolean;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
  /**
   * Module: Common
   *
   * CollectionName: `crudmodel`
   */
  type Crudmodel = {
      _id: string;
      /**
      * Model name
      */
      name: string;
      /**
      * Module responsible for the model
      */
      runtimeModuleName?: string;
      /**
      * Description of the model
      */
      description?: string;
      /**
      * Indicates whether the model is a view
      */
      isView?: boolean;
      /**
      * Pipeline to be executed when the model is a view (JSON)
      */
      viewPipeline?: string;
      /**
      * Model to be used as a view
      */
      viewOn?: string;
      /**
      * Fields of the model
      */
      fields?: object;
      /**
      * Indexes of the model
      */
      indexes?: object;
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
  }
}

/**
 * Module: Portifolio
 */
declare namespace OrkiSchemaTypes.Portifolio {
  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_position`
   */  
  type InvestPositionInput = {
      _id?: string;
      /**
      * Carteira de Investimento
      */
      invest_wallet: string;
      /**
      * Código de Negociação
      */
      code: string;
      /**
      * Quantidade
      */
      quantity: number;
      /**
      * Variação de Preço de Fechamento
      */
      variation_closing_price?: number | null;
      /**
      * Preço de Fechamento
      */
      closing_price?: number | null;
      /**
      * Preço Médio de Fechamento
      */
      average_closing_price?: number | null;
      /**
      * Valor Bruto (closing_price * quantity)
      */
      gross_value?: number | null;
      /**
      * Valor Líquido (gross_value - applied_value)
      */
      net_value?: number | null;
      /**
      * Porcentagem do Valor Líquido (net_value / gross_value)
      */
      net_value_percentage?: number | null;
      /**
      * Valor Aplicado (average_closing_price * quantity)
      */
      applied_value?: number | null;
      /**
      * Lucro Médio (average_closing_price - closing_price)
      */
      average_profit?: number | null;
      /**
      * Variação do Lucro Médio (average_profit / closing_price)
      */
      average_profit_variation?: number | null;
      /**
      * Indicador de Insiders
      */
      insiders_indicator_confidence?: number | null;
      /**
      * Indicador de Insiders (Preço)
      */
      insiders_indicator_price?: number | null;
      /**
      * Porcentagem de Recomendação de Alocação
      */
      recommendation_allocation?: number | null;
      /**
      * Percentual Alocado
      */
      allocated?: number | null;
      /**
      * Percentual que Precisa Alocar
      */
      need_to_allocate?: number | null;
      /**
      * Se é Dólar
      */
      is_dolar?: boolean | null;
      /**
      * Data de criação do registro
      */
      created_at?: Date | null;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date | null;
  }
  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_position_history`
   */  
  type InvestPositionHistoryInput = {
      _id?: string;
      /**
      * Carteira de Investimento
      */
      invest_wallet: string;
      /**
      * Valor Bruto
      */
      gross_value: number;
      /**
      * Variação do Valor Bruto
      */
      gross_value_variation?: number | null;
      /**
      * Variação do Valor Bruto no dia
      */
      gross_value_variation_day?: number | null;
      /**
      * Variação do Valor Bruto na semana
      */
      gross_value_variation_week?: number | null;
      /**
      * Variação do Valor Bruto no mês
      */
      gross_value_variation_month?: number | null;
      /**
      * Valor Líquido
      */
      net_value: number;
      /**
      * Variação do Valor Líquido
      */
      net_value_variation?: number | null;
      /**
      * Variação do Valor Líquido em percentual
      */
      net_value_variation_percent?: number | null;
      /**
      * Variação do Valor Líquido no dia
      */
      net_value_variation_day?: number | null;
      /**
      * Variação do Valor Líquido em percentual no dia
      */
      net_value_variation_percent_day?: number | null;
      /**
      * Variação do Valor Líquido na semana
      */
      net_value_variation_week?: number | null;
      /**
      * Variação do Valor Líquido em percentual na semana
      */
      net_value_variation_percent_week?: number | null;
      /**
      * Variação do Valor Líquido no mês
      */
      net_value_variation_month?: number | null;
      /**
      * Variação do Valor Líquido em percentual no mês
      */
      net_value_variation_percent_month?: number | null;
      /**
      * Data de criação do registro
      */
      created_at?: Date | null;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date | null;
  }
  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_wallet`
   */  
  type InvestWalletInput = {
      _id?: string;
      /**
      * Autenticação
      */
      authentication?: string | null;
      /**
      * Código da carteira
      */
      code: string;
      /**
      * Nome
      */
      name: string;
      /**
      * Data de criação do registro
      */
      created_at?: Date | null;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date | null;
  }

  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_position`
   */
  type InvestPosition = {
      _id: string;
      /**
      * Carteira de Investimento
      */
      invest_wallet: OrkiSchemaTypes.Portifolio.InvestWallet;
      /**
      * Código de Negociação
      */
      code: string;
      /**
      * Quantidade
      */
      quantity: number;
      /**
      * Variação de Preço de Fechamento
      */
      variation_closing_price?: number;
      /**
      * Preço de Fechamento
      */
      closing_price?: number;
      /**
      * Preço Médio de Fechamento
      */
      average_closing_price?: number;
      /**
      * Valor Bruto (closing_price * quantity)
      */
      gross_value?: number;
      /**
      * Valor Líquido (gross_value - applied_value)
      */
      net_value?: number;
      /**
      * Porcentagem do Valor Líquido (net_value / gross_value)
      */
      net_value_percentage?: number;
      /**
      * Valor Aplicado (average_closing_price * quantity)
      */
      applied_value?: number;
      /**
      * Lucro Médio (average_closing_price - closing_price)
      */
      average_profit?: number;
      /**
      * Variação do Lucro Médio (average_profit / closing_price)
      */
      average_profit_variation?: number;
      /**
      * Indicador de Insiders
      */
      insiders_indicator_confidence?: number;
      /**
      * Indicador de Insiders (Preço)
      */
      insiders_indicator_price?: number;
      /**
      * Porcentagem de Recomendação de Alocação
      */
      recommendation_allocation?: number;
      /**
      * Percentual Alocado
      */
      allocated?: number;
      /**
      * Percentual que Precisa Alocar
      */
      need_to_allocate?: number;
      /**
      * Se é Dólar
      */
      is_dolar?: boolean;
      /**
      * Data de criação do registro
      */
      created_at?: Date;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date;
  }
  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_position_history`
   */
  type InvestPositionHistory = {
      _id: string;
      /**
      * Carteira de Investimento
      */
      invest_wallet: OrkiSchemaTypes.Portifolio.InvestWallet;
      /**
      * Valor Bruto
      */
      gross_value: number;
      /**
      * Variação do Valor Bruto
      */
      gross_value_variation?: number;
      /**
      * Variação do Valor Bruto no dia
      */
      gross_value_variation_day?: number;
      /**
      * Variação do Valor Bruto na semana
      */
      gross_value_variation_week?: number;
      /**
      * Variação do Valor Bruto no mês
      */
      gross_value_variation_month?: number;
      /**
      * Valor Líquido
      */
      net_value: number;
      /**
      * Variação do Valor Líquido
      */
      net_value_variation?: number;
      /**
      * Variação do Valor Líquido em percentual
      */
      net_value_variation_percent?: number;
      /**
      * Variação do Valor Líquido no dia
      */
      net_value_variation_day?: number;
      /**
      * Variação do Valor Líquido em percentual no dia
      */
      net_value_variation_percent_day?: number;
      /**
      * Variação do Valor Líquido na semana
      */
      net_value_variation_week?: number;
      /**
      * Variação do Valor Líquido em percentual na semana
      */
      net_value_variation_percent_week?: number;
      /**
      * Variação do Valor Líquido no mês
      */
      net_value_variation_month?: number;
      /**
      * Variação do Valor Líquido em percentual no mês
      */
      net_value_variation_percent_month?: number;
      /**
      * Data de criação do registro
      */
      created_at?: Date;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date;
  }
  /**
   * Module: Portifolio
   *
   * CollectionName: `invest_wallet`
   */
  type InvestWallet = {
      _id: string;
      /**
      * Autenticação
      */
      authentication?: OrkiSchemaTypes.Common.Authentication;
      /**
      * Código da carteira
      */
      code: string;
      /**
      * Nome
      */
      name: string;
      /**
      * Data de criação do registro
      */
      created_at?: Date;
      /**
      * Data de atualização do registro
      */
      updated_at?: Date;
  }
}

