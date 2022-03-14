const { Directus } = require('@directus/sdk');
module.exports = function (router, { services, exceptions }){
	const { ItemsService } = services;
	const { ServiceUnavailableException } = exceptions;

	router.get('/', async (req, res, next) => {
        const directus = new Directus(process.env.DIRECTUS_URL);
        const authenticated = await directus.auth.static(process.env.GLOBAL_API_ACCESS_TOKEN);
        if(authenticated){
            try {
                // const items = await directus.users.readMany();
                const items = directus.items("whishlist").readMany();
                return res.json(items);   
            } catch (error) {
                return next(new ServiceUnavailableException(error.message));
            }
        }else{
            return next(new ServiceUnavailableException(error.message));
        }
       
	});
};