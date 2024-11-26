return async ({ utils, input }) => {
    const session = await utils.database.getSession();

    try {

        for (let i = 0; i < 100; i++) {
            const tset = await utils.coll('menu')
                .find({ isVisible: true })
                .limit(20)

            await utils.api('menu').create({
                name: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                path: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                icon: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                folder: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                isVisible: true
            }, { session });

            // Prepare bulk updates
            const bulkUpdates = tset.map(item => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: {
                        $set: {
                            name: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                            path: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                            icon: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                            folder: Math.random().toString(36).substring(7) + ' - ' + i + ' - ' + Math.random().toString(36).substring(7),
                            isVisible: true
                        }
                    }
                }
            }));

            // Execute bulk write
            if (bulkUpdates.length > 0) {
                await utils.coll('menu').bulkWrite(bulkUpdates, { session });
            }
        }

    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    } 

    return { success: true };
};
