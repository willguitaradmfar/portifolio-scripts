import dayjs from 'dayjs'
import axios from "axios";

import { Orki, OrkiInjectTypes, OrkiInterfaces, OrkiTest, RuntimeError } from "orki-core-runtime";
import { Summarize } from './usecases/interfaces';

@Orki()
export class TelegramNotify implements OrkiInterfaces.TriggerRuntime {

    constructor(
        private parameter: OrkiInjectTypes.Parameter,
        private portifolio$Summarize: Summarize,
        private database: OrkiInjectTypes.Database
    ) { }

    private async registerSnapshot(investPositionHistoryInput: OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput) {
        const lastSnapshot = await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput>('invest_position_history')
            .findOne({
                invest_wallet: investPositionHistoryInput.invest_wallet
            })
            .sort({ created_at: -1 })

        const firstSnapshotDay = await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput>('invest_position_history')
            .findOne({
                invest_wallet: investPositionHistoryInput.invest_wallet,
                created_at: {
                    $gte: dayjs().startOf('day').toDate()
                }
            })
            .sort({ created_at: 1 })

        const firstSnapshotWeek = await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput>('invest_position_history')
            .findOne({
                invest_wallet: investPositionHistoryInput.invest_wallet,
                created_at: {
                    $gte: dayjs().startOf('week').toDate()
                }
            })
            .sort({ created_at: 1 })

        const firstSnapshotMonth = await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput>('invest_position_history')
            .findOne({
                invest_wallet: investPositionHistoryInput.invest_wallet,
                created_at: {
                    $gte: dayjs().startOf('month').toDate()
                }
            })
            .sort({ created_at: 1 })

        if (lastSnapshot) {
            investPositionHistoryInput.gross_value_variation = 
                lastSnapshot.gross_value - investPositionHistoryInput.gross_value

            investPositionHistoryInput.net_value_variation =
                lastSnapshot.net_value - investPositionHistoryInput.net_value
        }

        if(firstSnapshotDay) {
            investPositionHistoryInput.gross_value_variation_day = 
                firstSnapshotDay.gross_value - investPositionHistoryInput.gross_value

            investPositionHistoryInput.net_value_variation_day =
                firstSnapshotDay.net_value - investPositionHistoryInput.net_value
        }

        if(firstSnapshotWeek) {
            investPositionHistoryInput.gross_value_variation_week = 
                firstSnapshotWeek.gross_value - investPositionHistoryInput.gross_value

            investPositionHistoryInput.net_value_variation_week =
                firstSnapshotWeek.net_value - investPositionHistoryInput.net_value
        }

        if(firstSnapshotMonth) {
            investPositionHistoryInput.gross_value_variation_month = 
                firstSnapshotMonth.gross_value - investPositionHistoryInput.gross_value

            investPositionHistoryInput.net_value_variation_month =
                firstSnapshotMonth.net_value - investPositionHistoryInput.net_value
        }
        
        return await this.database
            .getCollection('invest_position_history')
            .create(investPositionHistoryInput)
    }

    @OrkiTest()
    async execute(triggerRuntimeInput: OrkiInterfaces.TriggerRuntimeInput<any>): Promise<any> {
        const nowWeek = dayjs().format('d')
        const nowHour = parseInt(dayjs().add(-3, 'hour').format('HH'))

        if (['6', '0'].includes(nowWeek)) {
            return {
                message: `Semana fora do pregão: ${nowWeek}`,
                nowHour
            }
        }

        if (nowHour > 18 || nowHour < 10) {
            return {
                message: `Horário fora do pregão: ${nowHour}`,
                nowHour
            }
        }

        const authentications = await this.database
            .getCollection('authentication')
            .find()

        for (const authentication of authentications) {

            const summary = await this.portifolio$Summarize
                .execute({
                    authentication: {
                        _id: authentication._id.toString(),
                    }
                })

            if (!summary?.by_wallet?.length) {
                return {
                    message: 'Sem resumo'
                }
            }

            let message = ''

            for (const tipo of summary.by_wallet?.sort((a, b) => a.wallet_code.localeCompare(b.wallet_code))) {

                const text = `
${tipo.wallet_name}:
Dia: ${tipo.invest_position_history.gross_value_variation_day?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
Sem: ${tipo.invest_position_history.gross_value_variation_week?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
Mês: ${tipo.invest_position_history.gross_value_variation_month?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
${tipo.total_gross.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}.
`
                message += text

                await this.registerSnapshot({
                    invest_wallet: tipo.wallet_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    gross_value: tipo.total_gross,
                    net_value: tipo.total_net
                })
            }

            message += `
=================`

            message += `
Total: ${summary?.total[0]?.total_gross?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}.
`

            const telegram_token = await this.parameter.get('TELEGRAM_TOKEN')
            const chat_id = await this.parameter.get('CHAT_ID')

            await axios.post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
                chat_id,
                text: message,
                disable_notification: true
            })
        }
    }
}