const hf = require('huggingface-api')

hf.request({
	text: 'My name is Jeff and',
	model: 'EleutherAI/gpt-neo-2.7B',
	api_key: 'api_[API KEY REDACTED]',
	return_type: 'STRING'
}).then((data) => {
	console.log(data)
})