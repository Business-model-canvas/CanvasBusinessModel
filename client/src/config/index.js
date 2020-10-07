const funcS = () => {
	switch(process.env.NODE_ENV) {
		case 'production':
			return "http://localhost:8080"
		case 'development':
			return "http://localhost:8080"
		default:
			return ""
	}
}
// export SERVER_PORT;
export const SERVER_PORT = funcS();