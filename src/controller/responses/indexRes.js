const homePage = {
	server: 'The Liko RESTful API'
};

/**
 * Sends the home page as a JSON response.
 * 
 * @param {*} request - The request object.
 * @param {*} response - The response object.
 */
export const sendHomePage = (request, response) => {
	response.json(homePage);
};

/**
 * Handles the case when a route is not found.
 * Sends a JSON response with a 404 status.
 * 
 * @param {*} request - The request object.
 * @param {*} response - The response object.
 * @param {*} next - The next middleware function.
 */
export const routeNotFound = (request, response, next) => {
	response.status(404).json({
		status: '404 route not found'
	});
};
