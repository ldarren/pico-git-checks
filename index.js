const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

/**
 * Spawn a modified version of visionmedia/deploy
 *
 * @param {string} repo: repo to be tested
 * @param {string} dst: local repo checkout place
 * @param {string} ref: branch or tag to be checkout
 * @callback cb
 */
module.exports = function(repo, dst, cfg, ref, cb) {
	const shellSyntaxCommand = path.join( __dirname.replace(/\\/g, '/'), 'check ') + `${repo} ${dst} ${cfg} ${ref}`
	const proc = childProcess.spawn('sh', ['-c', shellSyntaxCommand], { stdio: 'inherit' })

	proc.on('error', cb)

	// TODO: listen to stdout instead of passing data by file

	proc.on('close', function (code) {
		if (code !== 0) return cb(code)
		const lintRes = fs.readFileSync(`/tmp/${dst}.lint`, 'utf8')
		const testRes = fs.readFileSync(`/tmp/${dst}.result`, 'utf8')
		cb(null, lintRes, testRes)
	});
}
