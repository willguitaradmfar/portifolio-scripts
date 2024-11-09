return async ({ utils, input }) => {
  
  const StockActionEvent = utils.coll('stock_action_events')
  
  const allQuotes = await utils.coll('stock_action').find({
  	is_active: true,
    can_update:  true
  })
  
  const results = await Promise.all(allQuotes.map(async quote => {
    try {
      const result = await utils.fetch('https://www.infomoney.com.br/wp-json/infomoney/v1/quotes/earnings', {
          method: 'POST',
          body: new URLSearchParams({
            symbol: quote.quote_name,
            type: null,
            page: 1,
            perPage: 1000
        })
      }).then(res => res.json())
      
      const { aaData } = result

      const data = {
      	quote_name: quote.quote_name,
        stock: quote._id,
        events: aaData.map(d => {
          	let [day, month, year] = d[6] === "n/d" ? d[5].split('/') : d[6].split('/')
            
            const type = d[0] === 'Dividendo' ? 'DIVIDEND' : d[0] === 'Desdobramento' ? 'SPLIT' : null;            
            const price = type === 'DIVIDEND' ? parseFloat(d[1].replace(',', '.')) : 0;
            const quantity = type === 'SPLIT' ? parseFloat(d[2].replace(',', '.')) / 100 : 0;
            
            if(year && year.length === 2) year = `20${year}`
          
        	return {
            	type,
              	price,
              	quantity,
            	date: new Date(`${year}-${month}-${day}T03:00:00`)
         	}
        }).filter(q => !!q.type)
      }
      
      for(const row of data.events) {
      	let event = await StockActionEvent.findOne({
          type: row.type,
          stock: data.stock,
          date: row.date
        })
        
        const toUpdate = {
        	price: row.price,
          	quantity: row.quantity
        }
        
        if(!event) {
        	event = new StockActionEvent({
            	type: row.type,
                stock: data.stock,
                date: row.date,
              	...toUpdate
            })
          
          	await event.save()
        } else {
        	await StockActionEvent.updateOne({
            	_id: event._id
            }, {
            	$set: toUpdate
            })
        }
      }
      
      return data
    } catch (err) {
    	return{
          	quote_name: quote.quote_name,
        	error: err.message
        }
    }
  }))
  
  return {
    results
  }
}