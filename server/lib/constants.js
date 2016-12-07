module.exports = {
	//keys in the KV store
	keys: {
		//locations of pieces of data meant for a certain purpose
		request: "manticore/requests",
		waiting: "manticore/waiting",
		haproxy: "haproxy/data",
		//data keys store actual data related to users
		data: {
			request: "manticore/requests/data",
			waiting: "manticore/waiting/data"
		},
		//filler keys that are kept next to a list so that we receive change notifications if the list is empty
		fillers: {
			request: "manticore/requests/filler",
			waiting: "manticore/waiting/filler"
		},
		//information specific to the construction of the config file
		haproxy: {
			//port that reverse proxy opens to access manticore web app
			mainPort: "haproxy/mainPort",
			domainName: "haproxy/domainName",
			webApp: "haproxy/data/webAppAddresses",
			tcpMaps: "haproxy/data/tcpMaps",
			httpFront: "haproxy/data/httpFront",
			httpBack: "haproxy/data/httpBack"
		}
	}
}