[portifolio-scripts](../README.md) / [Exports](../modules.md) / OrkiViews

# Namespace: OrkiViews

## Table of contents

### Type Aliases

- [Audit](OrkiViews.md#audit)
- [AuditInput](OrkiViews.md#auditinput)
- [Authentication](OrkiViews.md#authentication)
- [AuthenticationInput](OrkiViews.md#authenticationinput)
- [Code](OrkiViews.md#code)
- [CodeInput](OrkiViews.md#codeinput)
- [Llmbot](OrkiViews.md#llmbot)
- [LlmbotInput](OrkiViews.md#llmbotinput)
- [Llmfact](OrkiViews.md#llmfact)
- [LlmfactInput](OrkiViews.md#llmfactinput)
- [Llmprompttemplate](OrkiViews.md#llmprompttemplate)
- [LlmprompttemplateInput](OrkiViews.md#llmprompttemplateinput)
- [Menu](OrkiViews.md#menu)
- [MenuInput](OrkiViews.md#menuinput)
- [Menurole](OrkiViews.md#menurole)
- [MenuroleInput](OrkiViews.md#menuroleinput)
- [NordFiles](OrkiViews.md#nordfiles)
- [NordFilesInput](OrkiViews.md#nordfilesinput)
- [OrkiFileType](OrkiViews.md#orkifiletype)
- [OrkiFileTypeList](OrkiViews.md#orkifiletypelist)
- [OrkiStringI18N](OrkiViews.md#orkistringi18n)
- [Position](OrkiViews.md#position)
- [PositionHistory](OrkiViews.md#positionhistory)
- [PositionHistoryInput](OrkiViews.md#positionhistoryinput)
- [PositionInput](OrkiViews.md#positioninput)
- [StockAction](OrkiViews.md#stockaction)
- [StockActionEvents](OrkiViews.md#stockactionevents)
- [StockActionEventsInput](OrkiViews.md#stockactioneventsinput)
- [StockActionInput](OrkiViews.md#stockactioninput)
- [Transaction](OrkiViews.md#transaction)
- [TransactionInput](OrkiViews.md#transactioninput)
- [Trigger](OrkiViews.md#trigger)
- [TriggerInput](OrkiViews.md#triggerinput)
- [Wallet](OrkiViews.md#wallet)
- [WalletInput](OrkiViews.md#walletinput)
- [WalletTarget](OrkiViews.md#wallettarget)
- [WalletTargetInput](OrkiViews.md#wallettargetinput)
- [WalletTargetUser](OrkiViews.md#wallettargetuser)
- [WalletTargetUserHistory](OrkiViews.md#wallettargetuserhistory)
- [WalletTargetUserHistoryInput](OrkiViews.md#wallettargetuserhistoryinput)
- [WalletTargetUserInput](OrkiViews.md#wallettargetuserinput)

## Type Aliases

### Audit

Ƭ **Audit**: `Object`

- From: ```schema/audit/models/audit.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `action` | ``"created"`` \| ``"updated"`` \| ``"removed"`` |
| `api_name` | `string` |
| `author?` | [`Authentication`](OrkiViews.md#authentication) |
| `createdAt?` | `Date` |
| `difference` | `object` |
| `docId` | `string` |
| `headers` | `object` |
| `model_name` | `string` |
| `module_name` | `string` |

#### Defined in

orki-views.d.ts:445

___

### AuditInput

Ƭ **AuditInput**: `Object`

- From: ```schema/audit/models/audit.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `action` | ``"created"`` \| ``"updated"`` \| ``"removed"`` |
| `api_name` | `string` |
| `author?` | `string` \| ``null`` |
| `createdAt?` | `Date` \| ``null`` |
| `difference` | `object` |
| `docId` | `string` |
| `headers` | `object` |
| `model_name` | `string` |
| `module_name` | `string` |

#### Defined in

orki-views.d.ts:26

___

### Authentication

Ƭ **Authentication**: `Object`

- From: ```schema/authentication/models/authentication.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `accessedAt?` | `Date` | Data do último acesso |
| `confirmationEmailToken?` | `string` | Token de confirmação de email |
| `confirmationEmailTokenAt?` | `Date` | Data de expiração do token de confirmação de email |
| `detail?` | `object` | Detalhes do usuário |
| `email` | `string` | E-mail do usuário |
| `gravatarURL?` | `string` | URL do avatar do usuário |
| `name` | `string` | Nome do usuário |
| `resetPasswordToken?` | `string` | Token de reset de senha |
| `resetPasswordTokenAt?` | `Date` | Data de expiração do token de reset de senha |
| `secret2FA?` | `string` | Secret 2FA, se habilitado |

#### Defined in

orki-views.d.ts:461

___

### AuthenticationInput

Ƭ **AuthenticationInput**: `Object`

- From: ```schema/authentication/models/authentication.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `accessedAt?` | `Date` \| ``null`` | Data do último acesso |
| `confirmationEmailToken?` | `string` \| ``null`` | Token de confirmação de email |
| `confirmationEmailTokenAt?` | `Date` \| ``null`` | Data de expiração do token de confirmação de email |
| `detail?` | `object` \| ``null`` | Detalhes do usuário |
| `email` | `string` | E-mail do usuário |
| `gravatarURL?` | `string` \| ``null`` | URL do avatar do usuário |
| `name` | `string` | Nome do usuário |
| `resetPasswordToken?` | `string` \| ``null`` | Token de reset de senha |
| `resetPasswordTokenAt?` | `Date` \| ``null`` | Data de expiração do token de reset de senha |
| `secret2FA?` | `string` \| ``null`` | Secret 2FA, se habilitado |

#### Defined in

orki-views.d.ts:42

___

### Code

Ƭ **Code**: `Object`

- From: ```schema/code/models/code.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `createdAt?` | `Date` | Data de criação do registro |
| `description?` | `string` | Descrição do script |
| `engineVersion` | ``"v1"`` \| ``"v2"`` | Versão do engine |
| `isHTTPAuthentication?` | `boolean` | Autenticação HTTP |
| `isHTTPAuthorization?` | `boolean` | Autorização HTTP |
| `name` | `string` | Nome do script |
| `path?` | `string` | Caminho do script |

#### Defined in

orki-views.d.ts:508

___

### CodeInput

Ƭ **CodeInput**: `Object`

- From: ```schema/code/models/code.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `createdAt?` | `Date` \| ``null`` | Data de criação do registro |
| `description?` | `string` \| ``null`` | Descrição do script |
| `engineVersion` | ``"v1"`` \| ``"v2"`` | Versão do engine |
| `isHTTPAuthentication?` | `boolean` \| ``null`` | Autenticação HTTP |
| `isHTTPAuthorization?` | `boolean` \| ``null`` | Autorização HTTP |
| `name` | `string` | Nome do script |
| `path?` | `string` \| ``null`` | Caminho do script |

#### Defined in

orki-views.d.ts:89

___

### Llmbot

Ƭ **Llmbot**: `Object`

- From: ```schema/llmbot/models/llmbot.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `authentication?` | [`Authentication`](OrkiViews.md#authentication) | Parameters bot |
| `createdAt?` | `Date` | Data de criação do registro |
| `isActive?` | `boolean` | Ativo |
| `name` | `string` | Nome do bot |
| `parameters?` | `object` | Parameters bot |
| `scripts?` | [`Code`](OrkiViews.md#code)[] | Scripts bot |
| `updatedAt?` | `Date` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:543

___

### LlmbotInput

Ƭ **LlmbotInput**: `Object`

- From: ```schema/llmbot/models/llmbot.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `authentication?` | `string` \| ``null`` | Parameters bot |
| `createdAt?` | `Date` \| ``null`` | Data de criação do registro |
| `isActive?` | `boolean` \| ``null`` | Ativo |
| `name` | `string` | Nome do bot |
| `parameters?` | `object` \| ``null`` | Parameters bot |
| `scripts?` | `string`[] | Scripts bot |
| `updatedAt?` | `Date` \| ``null`` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:124

___

### Llmfact

Ƭ **Llmfact**: `Object`

- From: ```schema/llmfact/models/llmfact.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `createdAt?` | `Date` | Data de criação do registro |
| `embeddedAt?` | `Date` | Data de incorporação do registro |
| `embedding?` | `object` | Vetor de incorporação do registro |
| `fact` | `string` | Fato |
| `factHash?` | `string` | Hash do fato |
| `isActive?` | `boolean` | Ativo |
| `prompt` | [`Llmprompttemplate`](OrkiViews.md#llmprompttemplate) | Prompt do fato |
| `updatedAt?` | `Date` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:578

___

### LlmfactInput

Ƭ **LlmfactInput**: `Object`

- From: ```schema/llmfact/models/llmfact.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `createdAt?` | `Date` \| ``null`` | Data de criação do registro |
| `embeddedAt?` | `Date` \| ``null`` | Data de incorporação do registro |
| `embedding?` | `object` \| ``null`` | Vetor de incorporação do registro |
| `fact` | `string` | Fato |
| `factHash?` | `string` \| ``null`` | Hash do fato |
| `isActive?` | `boolean` \| ``null`` | Ativo |
| `prompt` | `string` | Prompt do fato |
| `updatedAt?` | `Date` \| ``null`` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:159

___

### Llmprompttemplate

Ƭ **Llmprompttemplate**: `Object`

- From: ```schema/llmprompttemplate/models/llmprompttemplate.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `createdAt?` | `Date` | Data de criação do registro |
| `description?` | `string` | Descrição do template |
| `isActive?` | `boolean` | Ativo |
| `llmbot` | [`Llmbot`](OrkiViews.md#llmbot) | Bot |
| `name` | `string` | Nome do template |
| `prompt` | `string` | Prompt do template |
| `updatedAt?` | `Date` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:617

___

### LlmprompttemplateInput

Ƭ **LlmprompttemplateInput**: `Object`

- From: ```schema/llmprompttemplate/models/llmprompttemplate.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `createdAt?` | `Date` \| ``null`` | Data de criação do registro |
| `description?` | `string` \| ``null`` | Descrição do template |
| `isActive?` | `boolean` \| ``null`` | Ativo |
| `llmbot` | `string` | Bot |
| `name` | `string` | Nome do template |
| `prompt` | `string` | Prompt do template |
| `updatedAt?` | `Date` \| ``null`` | Data de atualização do registro |

#### Defined in

orki-views.d.ts:198

___

### Menu

Ƭ **Menu**: `Object`

- From: ```schema/menu/models/menu.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `folder?` | `string` |
| `icon` | `string` |
| `isVisible?` | `boolean` |
| `name` | `string` |
| `path` | `string` |

#### Defined in

orki-views.d.ts:652

___

### MenuInput

Ƭ **MenuInput**: `Object`

- From: ```schema/menu/models/menu.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `folder?` | `string` \| ``null`` |
| `icon` | `string` |
| `isVisible?` | `boolean` \| ``null`` |
| `name` | `string` |
| `path` | `string` |

#### Defined in

orki-views.d.ts:233

___

### Menurole

Ƭ **Menurole**: `Object`

- From: ```schema/menurole/models/menurole.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `menus` | [`Menu`](OrkiViews.md#menu)[] |
| `name` | `string` |
| `users` | [`Authentication`](OrkiViews.md#authentication)[] |

#### Defined in

orki-views.d.ts:664

___

### MenuroleInput

Ƭ **MenuroleInput**: `Object`

- From: ```schema/menurole/models/menurole.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `menus` | `string`[] |
| `name` | `string` |
| `users` | `string`[] |

#### Defined in

orki-views.d.ts:245

___

### NordFiles

Ƭ **NordFiles**: `Object`

- From: ```schema/nord_files/models/nord_files.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `created_at?` | `Date` |
| `file` | [`OrkiFileType`](OrkiViews.md#orkifiletype) |
| `name` | `string` |
| `wallet` | [`Wallet`](OrkiViews.md#wallet) |

#### Defined in

orki-views.d.ts:674

___

### NordFilesInput

Ƭ **NordFilesInput**: `Object`

- From: ```schema/nord_files/models/nord_files.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `created_at?` | `Date` \| ``null`` |
| `file` | [`OrkiFileType`](OrkiViews.md#orkifiletype) |
| `name` | `string` |
| `wallet` | `string` |

#### Defined in

orki-views.d.ts:255

___

### OrkiFileType

Ƭ **OrkiFileType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `list` | [`OrkiFileTypeList`](OrkiViews.md#orkifiletypelist)[] |
| `uuid` | `string` |

#### Defined in

orki-views.d.ts:3

___

### OrkiFileTypeList

Ƭ **OrkiFileTypeList**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bucketId` | `string` |
| `isPublic` | `boolean` |
| `key` | `string` |
| `link` | `string` |
| `originalname` | `string` |

#### Defined in

orki-views.d.ts:8

___

### OrkiStringI18N

Ƭ **OrkiStringI18N**: \{ `translate`: \{ `key`: `string` ; `value`: `string`  }  }[] \| `string`

#### Defined in

orki-views.d.ts:16

___

### Position

Ƭ **Position**: `Object`

- From: ```schema/position/models/position.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `alocado?` | `number` |
| `codigoNegociacao` | `string` |
| `lucroMedio?` | `number` |
| `lucroMedioVariacao?` | `number` |
| `precisaAlocar?` | `number` |
| `precoFechamento?` | `number` |
| `precoMedioFechamento?` | `number` |
| `quantidade?` | `number` |
| `recomendacaoDeAlocacao?` | `number` |
| `tipoProduto?` | `string` |
| `updated_at?` | `Date` |
| `valorAplicado?` | `number` |
| `valorAtualizado?` | `number` |
| `valorBruto?` | `number` |
| `valorLiquido?` | `number` |
| `variacaoFechamento?` | `number` |
| `variacaoPrecoFechamento?` | `number` |
| `variacaoValorAtualizado?` | `number` |
| `vencimento?` | `Date` |

#### Defined in

orki-views.d.ts:685

___

### PositionHistory

Ƭ **PositionHistory**: `Object`

- From: ```schema/position_history/models/position_history.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `created_at?` | `Date` |
| `percent?` | `number` |
| `tipoProduto?` | `string` |
| `valorAtualizado?` | `number` |
| `variacaoValorAtualizado?` | `number` |

#### Defined in

orki-views.d.ts:711

___

### PositionHistoryInput

Ƭ **PositionHistoryInput**: `Object`

- From: ```schema/position_history/models/position_history.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `created_at?` | `Date` \| ``null`` |
| `percent?` | `number` \| ``null`` |
| `tipoProduto?` | `string` \| ``null`` |
| `valorAtualizado?` | `number` \| ``null`` |
| `variacaoValorAtualizado?` | `number` \| ``null`` |

#### Defined in

orki-views.d.ts:292

___

### PositionInput

Ƭ **PositionInput**: `Object`

- From: ```schema/position/models/position.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `alocado?` | `number` \| ``null`` |
| `codigoNegociacao` | `string` |
| `lucroMedio?` | `number` \| ``null`` |
| `lucroMedioVariacao?` | `number` \| ``null`` |
| `precisaAlocar?` | `number` \| ``null`` |
| `precoFechamento?` | `number` \| ``null`` |
| `precoMedioFechamento?` | `number` \| ``null`` |
| `quantidade?` | `number` \| ``null`` |
| `recomendacaoDeAlocacao?` | `number` \| ``null`` |
| `tipoProduto?` | `string` \| ``null`` |
| `updated_at?` | `Date` \| ``null`` |
| `valorAplicado?` | `number` \| ``null`` |
| `valorAtualizado?` | `number` \| ``null`` |
| `valorBruto?` | `number` \| ``null`` |
| `valorLiquido?` | `number` \| ``null`` |
| `variacaoFechamento?` | `number` \| ``null`` |
| `variacaoPrecoFechamento?` | `number` \| ``null`` |
| `variacaoValorAtualizado?` | `number` \| ``null`` |
| `vencimento?` | `Date` \| ``null`` |

#### Defined in

orki-views.d.ts:266

___

### StockAction

Ƭ **StockAction**: `Object`

- From: ```schema/stock_action/models/stock_action.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id` | `string` | - |
| `bolsa?` | ``"NASDAQ"`` \| ``"BVMF"`` | - |
| `can_update?` | `boolean` | - |
| `country?` | ``"BRAZIL"`` \| ``"EUA"`` | - |
| `current_price` | `number` | - |
| `ev_ebitda?` | `number` | - |
| `ev_receita_liquida?` | `number` | - |
| `graham?` | `number` | - |
| `has_error_update_price?` | `boolean` | - |
| `investing_link?` | `string` | - |
| `is_active?` | `boolean` | - |
| `lpa?` | `number` | - |
| `name` | `string` | - |
| `previous_quote_name?` | `string` | quote_name alternativo |
| `quote_name` | `string` | - |
| `setor?` | `string` | - |
| `updated_at?` | `Date` | - |
| `updated_info_at?` | `Date` | - |
| `updated_price_at?` | `Date` | - |
| `variation?` | `number` | - |
| `vpa?` | `number` | - |

#### Defined in

orki-views.d.ts:723

___

### StockActionEvents

Ƭ **StockActionEvents**: `Object`

- From: ```schema/stock_action_events/models/stock_action_events.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `date` | `Date` |
| `price?` | `number` |
| `quantity?` | `number` |
| `stock` | [`StockAction`](OrkiViews.md#stockaction) |
| `type` | ``"SPLIT"`` \| ``"DIVIDEND"`` |

#### Defined in

orki-views.d.ts:753

___

### StockActionEventsInput

Ƭ **StockActionEventsInput**: `Object`

- From: ```schema/stock_action_events/models/stock_action_events.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `date` | `Date` |
| `price?` | `number` \| ``null`` |
| `quantity?` | `number` \| ``null`` |
| `stock` | `string` |
| `type` | ``"SPLIT"`` \| ``"DIVIDEND"`` |

#### Defined in

orki-views.d.ts:334

___

### StockActionInput

Ƭ **StockActionInput**: `Object`

- From: ```schema/stock_action/models/stock_action.model.yaml```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_id?` | `string` | - |
| `bolsa?` | ``"NASDAQ"`` \| ``"BVMF"`` \| ``null`` | - |
| `can_update?` | `boolean` \| ``null`` | - |
| `country?` | ``"BRAZIL"`` \| ``"EUA"`` \| ``null`` | - |
| `current_price` | `number` | - |
| `ev_ebitda?` | `number` \| ``null`` | - |
| `ev_receita_liquida?` | `number` \| ``null`` | - |
| `graham?` | `number` \| ``null`` | - |
| `has_error_update_price?` | `boolean` \| ``null`` | - |
| `investing_link?` | `string` \| ``null`` | - |
| `is_active?` | `boolean` \| ``null`` | - |
| `lpa?` | `number` \| ``null`` | - |
| `name` | `string` | - |
| `previous_quote_name?` | `string` \| ``null`` | quote_name alternativo |
| `quote_name` | `string` | - |
| `setor?` | `string` \| ``null`` | - |
| `updated_at?` | `Date` \| ``null`` | - |
| `updated_info_at?` | `Date` \| ``null`` | - |
| `updated_price_at?` | `Date` \| ``null`` | - |
| `variation?` | `number` \| ``null`` | - |
| `vpa?` | `number` \| ``null`` | - |

#### Defined in

orki-views.d.ts:304

___

### Transaction

Ƭ **Transaction**: `Object`

- From: ```schema/transaction/models/transaction.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `avg_price_acc?` | `number` |
| `date` | `Date` |
| `institution` | `string` |
| `operation` | ``"Venda"`` \| ``"Compra"`` \| ``"SPLIT"`` \| ``"DIVIDEND"`` |
| `order?` | `number` |
| `price` | `number` |
| `profit?` | `number` |
| `profit_acc?` | `number` |
| `quantity` | `number` |
| `quantity_acc?` | `number` |
| `stock` | [`StockAction`](OrkiViews.md#stockaction) |
| `total?` | `number` |
| `total_acc?` | `number` |
| `user` | [`Authentication`](OrkiViews.md#authentication) |
| `was_imported?` | `boolean` |

#### Defined in

orki-views.d.ts:765

___

### TransactionInput

Ƭ **TransactionInput**: `Object`

- From: ```schema/transaction/models/transaction.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `avg_price_acc?` | `number` \| ``null`` |
| `date` | `Date` |
| `institution` | `string` |
| `operation` | ``"Venda"`` \| ``"Compra"`` \| ``"SPLIT"`` \| ``"DIVIDEND"`` |
| `order?` | `number` \| ``null`` |
| `price` | `number` |
| `profit?` | `number` \| ``null`` |
| `profit_acc?` | `number` \| ``null`` |
| `quantity` | `number` |
| `quantity_acc?` | `number` \| ``null`` |
| `stock` | `string` |
| `total?` | `number` \| ``null`` |
| `total_acc?` | `number` \| ``null`` |
| `user` | `string` |
| `was_imported?` | `boolean` \| ``null`` |

#### Defined in

orki-views.d.ts:346

___

### Trigger

Ƭ **Trigger**: `Object`

- From: ```schema/trigger/models/trigger.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `createdAt?` | `Date` |
| `executedAt?` | `Date` |
| `isLastError?` | `boolean` |
| `name?` | `string` |
| `trigger?` | ``""`` |
| `type?` | ``""`` |

#### Defined in

orki-views.d.ts:787

___

### TriggerInput

Ƭ **TriggerInput**: `Object`

- From: ```schema/trigger/models/trigger.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `createdAt?` | `Date` \| ``null`` |
| `executedAt?` | `Date` \| ``null`` |
| `isLastError?` | `boolean` \| ``null`` |
| `name?` | `string` \| ``null`` |
| `trigger?` | ``""`` \| ``null`` |
| `type?` | ``""`` \| ``null`` |

#### Defined in

orki-views.d.ts:368

___

### Wallet

Ƭ **Wallet**: `Object`

- From: ```schema/wallet/models/wallet.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `description?` | `string` |
| `is_active?` | `boolean` |
| `name?` | `string` |

#### Defined in

orki-views.d.ts:800

___

### WalletInput

Ƭ **WalletInput**: `Object`

- From: ```schema/wallet/models/wallet.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `description?` | `string` \| ``null`` |
| `is_active?` | `boolean` \| ``null`` |
| `name?` | `string` \| ``null`` |

#### Defined in

orki-views.d.ts:381

___

### WalletTarget

Ƭ **WalletTarget**: `Object`

- From: ```schema/wallet_target/models/wallet_target.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `allocation` | `number` |
| `max_price` | `number` |
| `rank` | `number` |
| `recommendation` | ``"LONG"`` \| ``"SHORT"`` \| ``"KEEP"`` \| ``"OUT"`` |
| `stock` | [`StockAction`](OrkiViews.md#stockaction) |
| `updated_at?` | `Date` |
| `wallet` | [`Wallet`](OrkiViews.md#wallet) |

#### Defined in

orki-views.d.ts:810

___

### WalletTargetInput

Ƭ **WalletTargetInput**: `Object`

- From: ```schema/wallet_target/models/wallet_target.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `allocation` | `number` |
| `max_price` | `number` |
| `rank` | `number` |
| `recommendation` | ``"LONG"`` \| ``"SHORT"`` \| ``"KEEP"`` \| ``"OUT"`` |
| `stock` | `string` |
| `updated_at?` | `Date` \| ``null`` |
| `wallet` | `string` |

#### Defined in

orki-views.d.ts:391

___

### WalletTargetUser

Ƭ **WalletTargetUser**: `Object`

- From: ```schema/wallet_target_user/models/wallet_target_user.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `avg_price_acc?` | `number` |
| `current_month_sell?` | `number` |
| `current_month_sell_profit?` | `number` |
| `current_price?` | `number` |
| `profit_acc?` | `number` |
| `profit_acc_projection?` | `number` |
| `quantity?` | `number` |
| `stock` | [`StockAction`](OrkiViews.md#stockaction) |
| `total_acc?` | `number` |
| `updated_at?` | `Date` |
| `user` | [`Authentication`](OrkiViews.md#authentication) |
| `variation?` | `number` |
| `variation_wallet?` | `number` |
| `variation_wallet_total?` | `number` |
| `wallet?` | [`Wallet`](OrkiViews.md#wallet) |
| `wallet_allocation?` | `number` |
| `wallet_allocation_diff?` | `number` |
| `wallet_need_allocation?` | `number` |
| `wallet_target` | [`WalletTarget`](OrkiViews.md#wallettarget) |
| `wallet_total?` | `number` |

#### Defined in

orki-views.d.ts:824

___

### WalletTargetUserHistory

Ƭ **WalletTargetUserHistory**: `Object`

- From: ```schema/wallet_target_user_history/models/wallet_target_user_history.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `created_at?` | `Date` |
| `user` | [`Authentication`](OrkiViews.md#authentication) |
| `variation?` | `number` |
| `variation_wallet?` | `number` |
| `wallet` | [`Wallet`](OrkiViews.md#wallet) |
| `wallet_total?` | `number` |

#### Defined in

orki-views.d.ts:851

___

### WalletTargetUserHistoryInput

Ƭ **WalletTargetUserHistoryInput**: `Object`

- From: ```schema/wallet_target_user_history/models/wallet_target_user_history.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `created_at?` | `Date` \| ``null`` |
| `user` | `string` |
| `variation?` | `number` \| ``null`` |
| `variation_wallet?` | `number` \| ``null`` |
| `wallet` | `string` |
| `wallet_total?` | `number` \| ``null`` |

#### Defined in

orki-views.d.ts:432

___

### WalletTargetUserInput

Ƭ **WalletTargetUserInput**: `Object`

- From: ```schema/wallet_target_user/models/wallet_target_user.model.yaml```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id?` | `string` |
| `avg_price_acc?` | `number` \| ``null`` |
| `current_month_sell?` | `number` \| ``null`` |
| `current_month_sell_profit?` | `number` \| ``null`` |
| `current_price?` | `number` \| ``null`` |
| `profit_acc?` | `number` \| ``null`` |
| `profit_acc_projection?` | `number` \| ``null`` |
| `quantity?` | `number` \| ``null`` |
| `stock` | `string` |
| `total_acc?` | `number` \| ``null`` |
| `updated_at?` | `Date` \| ``null`` |
| `user` | `string` |
| `variation?` | `number` \| ``null`` |
| `variation_wallet?` | `number` \| ``null`` |
| `variation_wallet_total?` | `number` \| ``null`` |
| `wallet?` | `string` \| ``null`` |
| `wallet_allocation?` | `number` \| ``null`` |
| `wallet_allocation_diff?` | `number` \| ``null`` |
| `wallet_need_allocation?` | `number` \| ``null`` |
| `wallet_target` | `string` |
| `wallet_total?` | `number` \| ``null`` |

#### Defined in

orki-views.d.ts:405
