declare namespace OrkiViews {

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
        key: string;
        value: string;
    }
    }> | string
  
  /**
   * - From: ```schema/audit/models/audit.model.yaml```
   */
  type AuditInput = {
      _id?: string;
      createdAt?: Date | null;
      author?: string | null;
      model_name: string;
      module_name: string;
      api_name: string;
      difference: object;
      action: "created" | "updated" | "removed";
      docId: string;
      headers: object;
  }
  
  /**
   * - From: ```schema/authentication/models/authentication.model.yaml```
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
   * - From: ```schema/code/models/code.model.yaml```
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
      engineVersion: "v1" | "v2";
  }
  
  /**
   * - From: ```schema/llmbot/models/llmbot.model.yaml```
   */
  type LlmbotInput = {
      _id?: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
      /**
      * Nome do bot
      */
      name: string;
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
  }
  
  /**
   * - From: ```schema/llmfact/models/llmfact.model.yaml```
   */
  type LlmfactInput = {
      _id?: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
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
  }
  
  /**
   * - From: ```schema/llmprompttemplate/models/llmprompttemplate.model.yaml```
   */
  type LlmprompttemplateInput = {
      _id?: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date | null;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date | null;
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
  }
  
  /**
   * - From: ```schema/menu/models/menu.model.yaml```
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
   * - From: ```schema/menurole/models/menurole.model.yaml```
   */
  type MenuroleInput = {
      _id?: string;
      name: string;
      users: Array<string>;
      menus: Array<string>;
  }
  
  /**
   * - From: ```schema/nord_files/models/nord_files.model.yaml```
   */
  type NordFilesInput = {
      _id?: string;
      created_at?: Date | null;
      wallet: string;
      file: OrkiViews.OrkiFileType;
      name: string;
  }
  
  /**
   * - From: ```schema/position/models/position.model.yaml```
   */
  type PositionInput = {
      _id?: string;
      codigoNegociacao: string;
      tipoProduto?: string | null;
      quantidade?: number | null;
      precoFechamento?: number | null;
      precoMedioFechamento?: number | null;
      lucroMedio?: number | null;
      lucroMedioVariacao?: number | null;
      variacaoFechamento?: number | null;
      variacaoValorAtualizado?: number | null;
      variacaoPrecoFechamento?: number | null;
      valorAtualizado?: number | null;
      recomendacaoDeAlocacao?: number | null;
      alocado?: number | null;
      precisaAlocar?: number | null;
      valorAplicado?: number | null;
      valorBruto?: number | null;
      valorLiquido?: number | null;
      vencimento?: Date | null;
      updated_at?: Date | null;
  }
  
  /**
   * - From: ```schema/position_history/models/position_history.model.yaml```
   */
  type PositionHistoryInput = {
      _id?: string;
      tipoProduto?: string | null;
      valorAtualizado?: number | null;
      percent?: number | null;
      variacaoValorAtualizado?: number | null;
      created_at?: Date | null;
  }
  
  /**
   * - From: ```schema/stock_action/models/stock_action.model.yaml```
   */
  type StockActionInput = {
      _id?: string;
      name: string;
      quote_name: string;
      setor?: string | null;
      current_price: number;
      /**
      * quote_name alternativo
      */
      previous_quote_name?: string | null;
      updated_at?: Date | null;
      is_active?: boolean | null;
      can_update?: boolean | null;
      variation?: number | null;
      lpa?: number | null;
      vpa?: number | null;
      graham?: number | null;
      ev_ebitda?: number | null;
      ev_receita_liquida?: number | null;
      updated_price_at?: Date | null;
      updated_info_at?: Date | null;
      country?: "BRAZIL" | "EUA" | null;
      has_error_update_price?: boolean | null;
      bolsa?: "NASDAQ" | "BVMF" | null;
      investing_link?: string | null;
  }
  
  /**
   * - From: ```schema/stock_action_events/models/stock_action_events.model.yaml```
   */
  type StockActionEventsInput = {
      _id?: string;
      stock: string;
      date: Date;
      type: "SPLIT" | "DIVIDEND";
      quantity?: number | null;
      price?: number | null;
  }
  
  /**
   * - From: ```schema/transaction/models/transaction.model.yaml```
   */
  type TransactionInput = {
      _id?: string;
      stock: string;
      user: string;
      quantity: number;
      price: number;
      operation: "Venda" | "Compra" | "SPLIT" | "DIVIDEND";
      date: Date;
      institution: string;
      quantity_acc?: number | null;
      avg_price_acc?: number | null;
      total_acc?: number | null;
      total?: number | null;
      profit?: number | null;
      profit_acc?: number | null;
      was_imported?: boolean | null;
      order?: number | null;
  }
  
  /**
   * - From: ```schema/trigger/models/trigger.model.yaml```
   */
  type TriggerInput = {
      _id?: string;
      name?: string | null;
      isLastError?: boolean | null;
      type?: "" | null;
      trigger?: "" | null;
      createdAt?: Date | null;
      executedAt?: Date | null;
  }
  
  /**
   * - From: ```schema/wallet/models/wallet.model.yaml```
   */
  type WalletInput = {
      _id?: string;
      name?: string | null;
      description?: string | null;
      is_active?: boolean | null;
  }
  
  /**
   * - From: ```schema/wallet_target/models/wallet_target.model.yaml```
   */
  type WalletTargetInput = {
      _id?: string;
      wallet: string;
      rank: number;
      recommendation: "LONG" | "SHORT" | "KEEP" | "OUT";
      allocation: number;
      max_price: number;
      stock: string;
      updated_at?: Date | null;
  }
  
  /**
   * - From: ```schema/wallet_target_user/models/wallet_target_user.model.yaml```
   */
  type WalletTargetUserInput = {
      _id?: string;
      user: string;
      wallet_target: string;
      updated_at?: Date | null;
      quantity?: number | null;
      stock: string;
      avg_price_acc?: number | null;
      total_acc?: number | null;
      profit_acc?: number | null;
      wallet_total?: number | null;
      wallet_allocation?: number | null;
      wallet_need_allocation?: number | null;
      wallet_allocation_diff?: number | null;
      current_price?: number | null;
      wallet?: string | null;
      profit_acc_projection?: number | null;
      variation_wallet?: number | null;
      variation?: number | null;
      current_month_sell?: number | null;
      current_month_sell_profit?: number | null;
      variation_wallet_total?: number | null;
  }
  
  /**
   * - From: ```schema/wallet_target_user_history/models/wallet_target_user_history.model.yaml```
   */
  type WalletTargetUserHistoryInput = {
      _id?: string;
      created_at?: Date | null;
      user: string;
      wallet: string;
      variation?: number | null;
      variation_wallet?: number | null;
      wallet_total?: number | null;
  }
  
  /**
   * - From: ```schema/audit/models/audit.model.yaml```
   */
  type Audit = {
      _id: string;
      createdAt?: Date;
      author?: Authentication;
      model_name: string;
      module_name: string;
      api_name: string;
      difference: object;
      action: "created" | "updated" | "removed";
      docId: string;
      headers: object;
  }
  
  /**
   * - From: ```schema/authentication/models/authentication.model.yaml```
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
   * - From: ```schema/code/models/code.model.yaml```
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
      engineVersion: "v1" | "v2";
  }
  
  /**
   * - From: ```schema/llmbot/models/llmbot.model.yaml```
   */
  type Llmbot = {
      _id: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
      /**
      * Nome do bot
      */
      name: string;
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
      authentication?: Authentication;
      /**
      * Scripts bot
      */
      scripts?: Array<Code>;
  }
  
  /**
   * - From: ```schema/llmfact/models/llmfact.model.yaml```
   */
  type Llmfact = {
      _id: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
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
      prompt: Llmprompttemplate;
  }
  
  /**
   * - From: ```schema/llmprompttemplate/models/llmprompttemplate.model.yaml```
   */
  type Llmprompttemplate = {
      _id: string;
      /**
      * Data de criação do registro
      */
      createdAt?: Date;
      /**
      * Data de atualização do registro
      */
      updatedAt?: Date;
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
      llmbot: Llmbot;
  }
  
  /**
   * - From: ```schema/menu/models/menu.model.yaml```
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
   * - From: ```schema/menurole/models/menurole.model.yaml```
   */
  type Menurole = {
      _id: string;
      name: string;
      users: Array<Authentication>;
      menus: Array<Menu>;
  }
  
  /**
   * - From: ```schema/nord_files/models/nord_files.model.yaml```
   */
  type NordFiles = {
      _id: string;
      created_at?: Date;
      wallet: Wallet;
      file: OrkiViews.OrkiFileType;
      name: string;
  }
  
  /**
   * - From: ```schema/position/models/position.model.yaml```
   */
  type Position = {
      _id: string;
      codigoNegociacao: string;
      tipoProduto?: string;
      quantidade?: number;
      precoFechamento?: number;
      precoMedioFechamento?: number;
      lucroMedio?: number;
      lucroMedioVariacao?: number;
      variacaoFechamento?: number;
      variacaoValorAtualizado?: number;
      variacaoPrecoFechamento?: number;
      valorAtualizado?: number;
      recomendacaoDeAlocacao?: number;
      alocado?: number;
      precisaAlocar?: number;
      valorAplicado?: number;
      valorBruto?: number;
      valorLiquido?: number;
      vencimento?: Date;
      updated_at?: Date;
  }
  
  /**
   * - From: ```schema/position_history/models/position_history.model.yaml```
   */
  type PositionHistory = {
      _id: string;
      tipoProduto?: string;
      valorAtualizado?: number;
      percent?: number;
      variacaoValorAtualizado?: number;
      created_at?: Date;
  }
  
  /**
   * - From: ```schema/stock_action/models/stock_action.model.yaml```
   */
  type StockAction = {
      _id: string;
      name: string;
      quote_name: string;
      setor?: string;
      current_price: number;
      /**
      * quote_name alternativo
      */
      previous_quote_name?: string;
      updated_at?: Date;
      is_active?: boolean;
      can_update?: boolean;
      variation?: number;
      lpa?: number;
      vpa?: number;
      graham?: number;
      ev_ebitda?: number;
      ev_receita_liquida?: number;
      updated_price_at?: Date;
      updated_info_at?: Date;
      country?: "BRAZIL" | "EUA";
      has_error_update_price?: boolean;
      bolsa?: "NASDAQ" | "BVMF";
      investing_link?: string;
  }
  
  /**
   * - From: ```schema/stock_action_events/models/stock_action_events.model.yaml```
   */
  type StockActionEvents = {
      _id: string;
      stock: StockAction;
      date: Date;
      type: "SPLIT" | "DIVIDEND";
      quantity?: number;
      price?: number;
  }
  
  /**
   * - From: ```schema/transaction/models/transaction.model.yaml```
   */
  type Transaction = {
      _id: string;
      stock: StockAction;
      user: Authentication;
      quantity: number;
      price: number;
      operation: "Venda" | "Compra" | "SPLIT" | "DIVIDEND";
      date: Date;
      institution: string;
      quantity_acc?: number;
      avg_price_acc?: number;
      total_acc?: number;
      total?: number;
      profit?: number;
      profit_acc?: number;
      was_imported?: boolean;
      order?: number;
  }
  
  /**
   * - From: ```schema/trigger/models/trigger.model.yaml```
   */
  type Trigger = {
      _id: string;
      name?: string;
      isLastError?: boolean;
      type?: "";
      trigger?: "";
      createdAt?: Date;
      executedAt?: Date;
  }
  
  /**
   * - From: ```schema/wallet/models/wallet.model.yaml```
   */
  type Wallet = {
      _id: string;
      name?: string;
      description?: string;
      is_active?: boolean;
  }
  
  /**
   * - From: ```schema/wallet_target/models/wallet_target.model.yaml```
   */
  type WalletTarget = {
      _id: string;
      wallet: Wallet;
      rank: number;
      recommendation: "LONG" | "SHORT" | "KEEP" | "OUT";
      allocation: number;
      max_price: number;
      stock: StockAction;
      updated_at?: Date;
  }
  
  /**
   * - From: ```schema/wallet_target_user/models/wallet_target_user.model.yaml```
   */
  type WalletTargetUser = {
      _id: string;
      user: Authentication;
      wallet_target: WalletTarget;
      updated_at?: Date;
      quantity?: number;
      stock: StockAction;
      avg_price_acc?: number;
      total_acc?: number;
      profit_acc?: number;
      wallet_total?: number;
      wallet_allocation?: number;
      wallet_need_allocation?: number;
      wallet_allocation_diff?: number;
      current_price?: number;
      wallet?: Wallet;
      profit_acc_projection?: number;
      variation_wallet?: number;
      variation?: number;
      current_month_sell?: number;
      current_month_sell_profit?: number;
      variation_wallet_total?: number;
  }
  
  /**
   * - From: ```schema/wallet_target_user_history/models/wallet_target_user_history.model.yaml```
   */
  type WalletTargetUserHistory = {
      _id: string;
      created_at?: Date;
      user: Authentication;
      wallet: Wallet;
      variation?: number;
      variation_wallet?: number;
      wallet_total?: number;
  }
}
