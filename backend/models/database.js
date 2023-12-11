async function getDatabases() {
	const client = new MongoClient('mongodb://localhost:27017');
	try {
		await client.connect();
		const databases = await client.db().admin().listDatabases();
		return databases.databases.map((db) => db.name);
	} finally {
		await client.close();
	}
}

async function deleteDatabases(databaseNames) {
	const client = new MongoClient('mongodb://localhost:27017');
	try {
		await client.connect();
		const adminDb = client.db().admin();

		for (const dbName of databaseNames) {
			await adminDb.command({
				dropDatabase: 1,
				writeConcern: { w: 'majority' },
			});
			console.log(`Database ${dbName} cleared.`);
		}
	} finally {
		await client.close();
	}
}

module.exports = { getDatabases, deleteDatabases };