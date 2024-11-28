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

    private async registerSnapshot(investPositionHistoryInput: OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput): Promise<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput> {
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
                investPositionHistoryInput.gross_value - lastSnapshot.gross_value

            investPositionHistoryInput.net_value_variation =
                investPositionHistoryInput.net_value - lastSnapshot.net_value
            
            investPositionHistoryInput.net_value_variation_percent =
                (investPositionHistoryInput.gross_value_variation * 100) / lastSnapshot.gross_value
        }

        if(firstSnapshotDay) {
            investPositionHistoryInput.gross_value_variation_day = 
                investPositionHistoryInput.gross_value - firstSnapshotDay.gross_value

            investPositionHistoryInput.net_value_variation_day =
                investPositionHistoryInput.net_value - firstSnapshotDay.net_value
            
            investPositionHistoryInput.net_value_variation_percent_day =
                (investPositionHistoryInput.gross_value_variation_day * 100) / firstSnapshotDay.gross_value
        }

        if(firstSnapshotWeek) {
            investPositionHistoryInput.gross_value_variation_week = 
                investPositionHistoryInput.gross_value - firstSnapshotWeek.gross_value

            investPositionHistoryInput.net_value_variation_week =
                investPositionHistoryInput.net_value - firstSnapshotWeek.net_value
            
            investPositionHistoryInput.net_value_variation_percent_week =
                (investPositionHistoryInput.gross_value_variation_week * 100) / firstSnapshotWeek.gross_value
        }

        if(firstSnapshotMonth) {
            investPositionHistoryInput.gross_value_variation_month = 
                investPositionHistoryInput.gross_value - firstSnapshotMonth.gross_value

            investPositionHistoryInput.net_value_variation_month =
                investPositionHistoryInput.net_value - firstSnapshotMonth.net_value
            
            investPositionHistoryInput.net_value_variation_percent_month =
                (investPositionHistoryInput.gross_value_variation_month * 100) / firstSnapshotMonth.gross_value
        }
        
        return await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput>('invest_position_history')
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

        const results = [] as any[]

        for (const authentication of authentications) {

            const summaries = await this.portifolio$Summarize
                .execute({
                    authentication: {
                        _id: authentication._id.toString(),
                    }
                })

            if (!summaries?.by_wallet?.length) {
                results.push({
                    message: `Nenhum resultado para ${authentication._id}`
                })
                continue
            }            

            let message = ''

            for (const summary of summaries.by_wallet?.sort((a, b) => a.wallet_code.localeCompare(b.wallet_code))) {

                const newSummary = await this.registerSnapshot({
                    invest_wallet: summary.wallet_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    gross_value: summary.total_gross,
                    net_value: summary.total_net
                })

                const text = `
${newSummary?.gross_value_variation_day! < 0 ? '🔴' : '🟢'} ${summary.wallet_name}:
Dia: ${newSummary.gross_value_variation_day?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}  (${newSummary.net_value_variation_percent_day?.toFixed(1)}%)
Sem: ${newSummary.gross_value_variation_week?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} (${newSummary.net_value_variation_percent_week?.toFixed(1)}%)
Mês: ${newSummary.gross_value_variation_month?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} (${newSummary.net_value_variation_percent_month?.toFixed(1)}%)
SubTotal: ${newSummary.gross_value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}.
`
                message += text

                results.push({
                    tipo: newSummary
                })
            }

            message += `
=================`

            message += `
Total: ${summaries?.total[0]?.total_gross?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}.
`

            const telegram_token = await this.parameter.get('TELEGRAM_TOKEN')
            const chat_id = await this.parameter.get('CHAT_ID')

            await axios.post(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
                chat_id,
                text: message,
                disable_notification: true
            })
        }

        return results
    }
}