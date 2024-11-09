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
   */
  type AuditInput = {
      _id?: string;
      author?: string | null;
      model_name: string;
      module_name: string;
      api_name: string;
      difference: object;
      action: "created" | "updated" | "removed";
      docId: string;
      headers: object;
      createdAt?: Date | null;
  }
  /**
   * Module: Common
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
   */
  type MenuroleInput = {
      _id?: string;
      name: string;
      users: Array<string>;
      menus: Array<string>;
  }
  /**
   * Module: Common
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
   */
  type MetacontactInput = {
      _id?: string;
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
   */
  type TrashInput = {
      _id?: string;
      model?: string | null;
      schemaName?: string | null;
      doc?: object | null;
      createdAt?: Date | null;
  }

  /**
   * Module: Common
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
   */
  type Audit = {
      _id: string;
      author?: OrkiSchemaTypes.Common.Authentication;
      model_name: string;
      module_name: string;
      api_name: string;
      difference: object;
      action: "created" | "updated" | "removed";
      docId: string;
      headers: object;
      createdAt?: Date;
  }
  /**
   * Module: Common
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
   */
  type Menurole = {
      _id: string;
      name: string;
      users: Array<OrkiSchemaTypes.Common.Authentication>;
      menus: Array<OrkiSchemaTypes.Common.Menu>;
  }
  /**
   * Module: Common
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
   */
  type Metacontact = {
      _id: string;
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
   */
  type Trash = {
      _id: string;
      model?: string;
      schemaName?: string;
      doc?: object;
      createdAt?: Date;
  }
}

/**
 * Module: Portifolio
 */
declare namespace OrkiSchemaTypes.Portifolio {
  /**
   * Module: Portifolio
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

