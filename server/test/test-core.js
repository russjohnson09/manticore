var mocha = require('mocha');
var assert = require('assert');
var core = require('../lib/core.js');
var nomader = require('nomad-helper');

describe("#expect()", function () {
	it("should return an object with a send function to invoke", function () {
		var expecting = core.expect(3, function(){});
		assert(typeof expecting.send === "function", "send is a function. Found " + (typeof expecting.send))
	});
	it("should invoke the callback after the send function is called 3 times and return a job", function (done){
		var key1 = "manticore/1234567890abcdef";
		var key2 = "manticore/abc";
		var key3 = "manticore/123";
		var value = {
			Value: {}
		};
		value.Value = JSON.stringify(value.Value);

		var expecting = core.expect(3, function (job) {
			var groups = job.getJob().Job.TaskGroups;
			assert(groups.length === 3, "There are 3 group tasks. Found " + groups.length);
			done();
		});
		expecting.send(key1, value);
		expecting.send(key2, value);
		expecting.send(key3, value);
	});
});

describe("#findPairs()", function () {
	it("should return an empty array if no pairs are found", function () {
		let coreTagObj = {
			userId: "userId",
			tcpPort: "44300",
			userToHmiPrefix: "userToHmi1",
			hmiToCorePrefix: "hmiToCore1",
			userToCorePrefix: "userToCore1"
		};
		let hmiTagObj = {
			userId: "userId2"
		};
		var cores = [{
			Address: "127.0.0.1",
			Tags: [JSON.stringify(coreTagObj)]
		}];
		var hmis = [{
			Address: "127.0.0.1",
			Port: "8687",
			Tags: [JSON.stringify(hmiTagObj)]
		}];
		var pairs = core.findPairs(cores, hmis);
		assert(pairs.length === 0, "There are no pairs. Found " + pairs.length);
	});

	//use this data for the next two tests
	let coreTagObj1 = {
		userId: "userId1",
		tcpPort: "44300",
		userToHmiPrefix: "userToHmi1",
		hmiToCorePrefix: "hmiToCore1",
		userToCorePrefix: "userToCore1"
	};
	let coreTagObj2 = {
		userId: "userId3",
		tcpPort: "12345",
		userToHmiPrefix: "userToHmi2",
		hmiToCorePrefix: "hmiToCore2",
		userToCorePrefix: "userToCore2"
	};
	let coreTagObj3 = {
		userId: "userId2",
		tcpPort: "25252",
		userToHmiPrefix: "userToHmi3",
		hmiToCorePrefix: "hmiToCore3",
		userToCorePrefix: "userToCore3"
	};
	let hmiTagObj1 = {userId: "userId1"};
	let hmiTagObj2 = {userId: "userId2"};
	let hmiTagObj3 = {userId: "userId4"};
	let cores = [{
		Address: "127.0.0.1",
		Port: "1211",
		Tags: [JSON.stringify(coreTagObj1)]
	},
	{
		Address: "127.0.0.2",
		Port: "1212",
		Tags: [JSON.stringify(coreTagObj2)]
	},
	{
		Address: "127.0.0.3",
		Port: "1213",
		Tags: [JSON.stringify(coreTagObj3)]
	}];
	let hmis = [{
		Address: "127.0.0.4",
		Port: "8687",
		Tags: [JSON.stringify(hmiTagObj1)]
	},
	{
		Address: "127.0.0.5",
		Port: "1234",
		Tags: [JSON.stringify(hmiTagObj2)]
	},
	{
		Address: "127.0.0.6",
		Port: "2345",
		Tags: [JSON.stringify(hmiTagObj3)]
	}];
	it("should return 2 pairs that are found", function () {
		var pairs = core.findPairs(cores, hmis);
		assert(pairs.length === 2, "There are 2 pairs. Found " + pairs.length);
		assert(pairs[0].user === "userId1");
		assert(pairs[0].tcpAddressInternal === "127.0.0.1:44300");
		assert(pairs[0].hmiAddressInternal === "127.0.0.1:1211");
		assert(pairs[0].userAddressInternal === "127.0.0.4:8687");
		assert(pairs[0].userAddressExternal === "userToHmi1");
		assert(pairs[0].hmiAddressExternal === "hmiToCore1");
		assert(pairs[0].tcpAddressExternal === "userToCore1");

		assert(pairs[1].user === "userId2");
		assert(pairs[1].tcpAddressInternal === "127.0.0.3:25252");
		assert(pairs[1].hmiAddressInternal === "127.0.0.3:1213");
		assert(pairs[1].userAddressInternal === "127.0.0.5:1234");
		assert(pairs[1].userAddressExternal === "userToHmi3");
		assert(pairs[1].hmiAddressExternal === "hmiToCore3");
		assert(pairs[1].tcpAddressExternal === "userToCore3");
	});

	it("should invoke callback for every HMI not paired with core", function (done) {
		var pairs = core.findPairs(cores, hmis, function (userId) {
			assert(userId === "userId4", "userId4 has no core pair. Found " + userId);
			done();
		});

	});
});

describe("#getUniqueString()", function () {
	it("should return a four digit string", function () {
		function randomGenerator () {
			return "1234";
		}
		var string = core.getUniqueString([], randomGenerator);
		assert(string === "1234", "string is a 4 digit string. Got " + string);
	});
	it("should return a new string if the first one was in the blacklist", function () {
		var funcIndex = 1210;
		function randomGenerator () {
			let result = "" + funcIndex;
			funcIndex++;
			return result;
		}
		var string = core.getUniqueString(["1210", "1211"], randomGenerator);
		assert(string === "1212", "string is 1212. Got " + string);
	});
});

describe("#getAddressesFromUserRequests()", function () {
	it("should retrieve all address prefixes from all keys in manticore", function () {
		var testData = [{
			LockIndex: 0,
			Key: 'manticore/1234567890abcdef',
			Flags: 0,
			Value: '{"url":"http://127.0.0.1:3000/v1/address","branch":{"hmi":"master","core":"master"},"hmiName":"ford","userToHmiPrefix":"fr0231rj23t","hmiToCorePrefix":"t20tg84j3t","userToCorePrefix":"5410"}'
		},
		{
			LockIndex: 0,
			Key: 'manticore/1234567890abcdef',
			Flags: 0,
			Value: '{"url":"http://127.0.0.1:3000/v1/address","branch":{"hmi":"master","core":"master"},"hmiName":"ford","userToHmiPrefix":"g345yg36","hmiToCorePrefix":"2juh542q5jui6","userToCorePrefix":"9372"}'
		}];
		var addresses = core.getAddressesFromUserRequests(testData);
		assert(addresses.length === 6, "there are 6 addresses. found " + addresses.length);
		assert(addresses[0] === "fr0231rj23t");
		assert(addresses[1] === "t20tg84j3t");
		assert(addresses[2] === "5410");
		assert(addresses[3] === "g345yg36");
		assert(addresses[4] === "2juh542q5jui6");
		assert(addresses[5] === "9372");
	});
});

describe("#generateNginxFile()", function () {
	it("should generate server blocks meant for HTTP and for TCP proxying", function () {
		var testData = {
			pairs: [{
				user: "3456789yduc2nj3f",
				userAddressInternal: "127.0.0.1:4000",
				hmiAddressInternal: "127.0.0.1:5000",
				tcpAddressInternal: "127.0.0.1:6000",
				userAddressExternal: "15uyh6176",
				hmiAddressExternal: "a4a4y43yq53",
				tcpAddressExternal: "2742"
			},{
				user: "3456789yduc2nj3f",
				userAddressInternal: "127.0.0.1:4000",
				hmiAddressInternal: "127.0.0.1:5000",
				tcpAddressInternal: "127.0.0.1:6000",
				userAddressExternal: "15uyh6176",
				hmiAddressExternal: "a4a4y43yq53",
				tcpAddressExternal: "2742"
			}]
		};
		var nginxFiles = core.generateNginxFile(testData);
		//there should be 4 server blocks. check for server_name as a string
		var matches1 = nginxFiles[0].match(/server_name/g);
		var matches2 = nginxFiles[1].match(/server_name/g);
		assert(matches1.length === 5, "there are 5 server blocks. found " + matches1.length);
		assert(matches2.length === 2, "there is 2 server block. found " + matches2.length);
	});

});

describe("#addHmisToJob()", function () {
	it("should create an hmi job based on the core job when NGINX_OFF isn't true", function () {
		process.env.NGINX_OFF = "";
		let coreTagObj1 = {
			userId: "userId1",
			tcpPort: "44300",
			userToHmiPrefix: "userToHmi1",
			hmiToCorePrefix: "hmiToCore1",
			userToCorePrefix: "userToCore1"
		};
		let coreTagObj2 = {
			userId: "userId3",
			tcpPort: "12345",
			userToHmiPrefix: "userToHmi2",
			hmiToCorePrefix: "hmiToCore2",
			userToCorePrefix: "userToCore2"
		};
		var job = nomader.createJob("hmi");
		var cores = [{
			Address: "127.0.0.1",
			Port: "1211",
			Tags: [JSON.stringify(coreTagObj1)]
		},
		{
			Address: "127.0.0.2",
			Port: "1212",
			Tags: [JSON.stringify(coreTagObj2)]
		}];
		core.addHmisToJob(job, cores);
		//check env and userId in tag for each hmi task
		var env1 = job.findTask("hmi-userId1", "hmi-master").Env.HMI_WEBSOCKET_ADDR;
		var env2 = job.findTask("hmi-userId3", "hmi-master").Env.HMI_WEBSOCKET_ADDR;
		var tag1 = job.findTask("hmi-userId1", "hmi-master").Services[0].Tags[0];
		var tag2 = job.findTask("hmi-userId3", "hmi-master").Services[0].Tags[0];
		assert.equal(env1, "hmiToCore1." + process.env.DOMAIN_NAME + ":3000");
		assert.equal(env2, "hmiToCore2." + process.env.DOMAIN_NAME + ":3000");
		assert.equal(JSON.parse(tag1).userId, JSON.parse(cores[0].Tags[0]).userId);
		assert.equal(JSON.parse(tag2).userId, JSON.parse(cores[1].Tags[0]).userId);
	});

	it("should create an hmi job based on the core job when NGINX_OFF is true", function () {
		process.env.NGINX_OFF = "true";
		let coreTagObj1 = {
			userId: "userId1",
			tcpPort: "44300",
			userToHmiPrefix: "userToHmi1",
			hmiToCorePrefix: "hmiToCore1",
			userToCorePrefix: "userToCore1"
		};
		let coreTagObj2 = {
			userId: "userId3",
			tcpPort: "12345",
			userToHmiPrefix: "userToHmi2",
			hmiToCorePrefix: "hmiToCore2",
			userToCorePrefix: "userToCore2"
		};
		var job = nomader.createJob("hmi");
		var cores = [{
			Address: "127.0.0.1",
			Port: "1211",
			Tags: [JSON.stringify(coreTagObj1)]
		},
		{
			Address: "127.0.0.2",
			Port: "1212",
			Tags: [JSON.stringify(coreTagObj2)]
		}];
		core.addHmisToJob(job, cores);
		//check env and userId in tag for each hmi task
		var env1 = job.findTask("hmi-userId1", "hmi-master").Env.HMI_WEBSOCKET_ADDR;
		var env2 = job.findTask("hmi-userId3", "hmi-master").Env.HMI_WEBSOCKET_ADDR;
		var tag1 = job.findTask("hmi-userId1", "hmi-master").Services[0].Tags[0];
		var tag2 = job.findTask("hmi-userId3", "hmi-master").Services[0].Tags[0];
		assert.equal(env1, cores[0].Address+":"+cores[0].Port);
		assert.equal(env2, cores[1].Address+":"+cores[1].Port);
		assert.equal(JSON.parse(tag1).userId, JSON.parse(cores[0].Tags[0]).userId);
		assert.equal(JSON.parse(tag2).userId, JSON.parse(cores[1].Tags[0]).userId);
	});
});

describe("#checkNginxFlag()", function () {
	it("should invoke the first function if NGINX_OFF is not set to 'true' as an env variable", function (done) {
		process.env.NGINX_OFF = ""; //force it
		core.checkNginxFlag(function () {
			done();
		}, function () {
			assert.fail(null, null, "The first function should've been called");
		});
	});
	it("should invoke the second function if NGINX_OFF is set to 'true' as an env variable", function (done) {
		process.env.NGINX_OFF = "true"; //force it
		core.checkNginxFlag(function () {
			assert.fail(null, null, "The second function should've been called");
		}, function () {
			done();
		});
	});
});

describe("#checkJobs()", function () {
	it("should invoke the first function if there are tasks in TaskGroups", function (done) {
		var job = nomader.createJob("test");
		job.addGroup("test-group");
		core.checkJobs(job, function () {
			done();
		}, function () {
			assert.fail(null, null, "The first function should've been called");
		});
	});

	it("should invoke the second function if there are no tasks in TaskGroups", function (done) {
		var job = nomader.createJob("test");
		core.checkJobs(job, function () {
			assert.fail(null, null, "The second function should've been called");
		}, function () {
			done();
		});
	});
});

describe("#filterKeys()", function () {
	it("should include keys that contain the target string", function () {
		var targetString = "requests/";
		var keys = [
			"requests/1234",
			"requests/13hb",
			"filler",
			"requests/abcd"
		]
		keys = core.filterKeys(keys, targetString);
		assert.equal(keys[0], "requests/1234");
		assert.equal(keys[1], "requests/13hb");
		assert.equal(keys[2], "requests/abcd");
	});
});

describe("#parseKvUserId()", function () {
	it("should strip off manticore/requests/ from the string", function () {
		var userId = "manticore/requests/2135494ygth";
		userId = core.parseKvUserId(userId);
		assert.equal(userId, "2135494ygth");
	});
});

describe("#getWsUrl()", function () {
	it("should return domain name if NGINX_OFF is not set to 'true' as an env variable", function () {
		process.env.NGINX_OFF = ""; //force it
		var address = core.getWsUrl();
		assert.equal(address, "http://" + process.env.DOMAIN_NAME + ":3000");
	});
	it("should return localhost if NGINX_OFF is set to 'true' as an env variable", function () {
		process.env.NGINX_OFF = "true"; //force it
		var address = core.getWsUrl();
		assert.equal(address, "http://localhost:" + process.env.HTTP_PORT);
	});
});

describe("#findAliveCoreAllocation()", function () {
	it("should return null if no ID matches", function () {
		var userId = "12345";
		var allocations = [{
			ID: "234710237512",
			TaskGroup: "core-15515",
			ClientStatus: "running"
		},{
			ID: "12312361163",
			TaskGroup: "core-24242",
			ClientStatus: "running"
		},{
			ID: "8425245674",
			TaskGroup: "core-35782",
			ClientStatus: "running"
		}];
		var result = core.findAliveCoreAllocation(allocations, userId);
		assert.equal(result, null);
	});
	it("should return null if there's no matching ID that is also running", function () {
		var userId = "35782";
		var allocations = [{
			ID: "234710237512",
			TaskGroup: "core-15515",
			ClientStatus: "complete"
		},{
			ID: "12312361163",
			TaskGroup: "core-24242",
			ClientStatus: "running"
		},{
			ID: "8425245674",
			TaskGroup: "core-35782",
			ClientStatus: "complete"
		}];
		var result = core.findAliveCoreAllocation(allocations, userId);
		assert.equal(result, null);
	});

	it("should return a match if an ID matches", function () {
		var userId = "12345";
		var allocations = [{
			ID: "234710237512",
			TaskGroup: "core-15515",
			ClientStatus: "complete"
		},{
			ID: "12312361163",
			TaskGroup: "core-17614",
			ClientStatus: "running"
		},{
			ID: "76343762266",
			TaskGroup: "core-26434",
			ClientStatus: "complete"
		},{
			ID: "8425245674",
			TaskGroup: "core-12345",
			ClientStatus: "running"
		},];
		var result = core.findAliveCoreAllocation(allocations, userId);
		assert.equal(result.ID, "8425245674");
	});
});